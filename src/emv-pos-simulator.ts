import { EMV } from './common/EMV'
import { EMVApplicationKernel } from './term/EMVApplicationKernel';
import { EMVCommandHelper } from './term/EMVKernelCommandHelper';
import { CommandAPDU, ResponseAPDU, SlotProtocolHandler } from 'cryptographix-se-core';
import { ByteString } from 'cryptographix-se-core';
import { Component, ComponentBuilder, Direction, Kind, EndPoint, Message } from 'cryptographix-sim-core';
import { MessageHeader } from 'cryptographix-sim-core';

export class EMVPOSSimulator implements Component
{
  private _emvKernel;

  constructor() {
  }

  private _toCard: EndPoint;
  private _toNetwork: EndPoint;

  initialize( config: Kind ): EndPoint[] {

    this._emvKernel = new EMVApplicationKernel();
    this._emvKernel.initKernel( this.getAPDUCommandProxy() );

    this._toCard = new EndPoint( 'toCard', Direction.OUT );
    this._toNetwork = new EndPoint( 'toNetwork', Direction.OUT );

    return [ this._toCard, this._toNetwork ];
  }

  teardown( )
  {
    this._toCard = null;
    this._toNetwork = null;
    this._emvKernel = null;
  }

  onPacket( port, packet )
  {
    if ( port.get( 'protocol' ) == "apdu" )
    {
      // handle return packets
      var cmd = packet.payload;

      if ( cmd.command == "executeAPDU" )
      {
        var bs = ( cmd.data instanceof Uint8Array ) ? cmd.data : new Uint8Array( cmd.data );
        var len = bs.length;
        var SW12 = ( bs[ len - 2 ] << 8 ) | bs[ len - 1 ];
        var responseBuffer = ( len > 2 ) ? new ByteString( bs.subarray( 0, len-2 ) ) : null;

        this._emvKernel.commandHelper.handleAPDUResponse( SW12, responseBuffer );

        if ( SW12 == 0x9000 )
          this.advanceCommandStep();

        return;
      }
      else if ( cmd.command == "ctrlPowerReset" )
      {
        var atr = cmd.data;

        return;
      }
    }
  }

  getAPDUCommandProxy()
  {
    var executeAPDUCommand = function( bCLA, bINS, bP1, bP2, commandData, wLe, onAPDUResponse )
    {
      var cmd = [ bCLA, bINS, bP1, bP2 ];
      var len = 4;
      var bsCommandData = ( commandData instanceof ByteString ) ? commandData : new ByteString( commandData, ByteString.HEX );
      if ( bsCommandData.length > 0 )
      {
        cmd[len++] = bsCommandData.length;
        for( var i = 0; i < bsCommandData.length; ++i )
          cmd[len++] = bsCommandData.byteAt( i );
      }
      else if ( wLe != undefined )
        cmd[len++] = wLe & 0xFF;

      return this.myNode.router.postPacket( this.myNode.getPorts().get( 'toCard' ), { command: "executeAPDU", data: cmd } );
    }

    var proxy = (function()
    {
      return {
        executeAPDUCommand: executeAPDUCommand // .bind( me )
      };
    })();

    return proxy;
  }

  resetTransaction()
  {
    this._emvKernel.setTag( 0x5A, "6271559900000013" );
    this._emvKernel.setTag( 0x5F34, "00" );

    this._emvKernel.setTag( 0x9A, "000000" );
    this._emvKernel.setTag( 0x9F02, "000000000000" );
    this._emvKernel.setTag( 0x5F2A, "0000" );
    this._emvKernel.setTag( 0x9F1A, "0000" );
    this._emvKernel.setTag( 0x84, "A0000000048002" );
    this._emvKernel.setTag( 0x9F03, "000000000000" );
  //  emvKernel.setTag( 0x9F37, "00000000" );
    this._emvKernel.setTag( 0x9F37, "69b0e75c" );
    this._emvKernel.setTag( 0x95, "8000000000" );
    this._emvKernel.setTag( 0x9C, "00" );
    this.curStep = EMVCommandHelper.cmdSelectFile;
  }

  apduCommandMonitor;
  showAPDUCommand( cmd )
  {
    var commandInfo = {
      commandBuffer: cmd,
      commandName: this._emvKernel.commandHelper.commandName
    };
    if ( this.apduCommandMonitor != undefined )
      this.apduCommandMonitor( commandInfo );
  }

  apduResponseMonitor;
  handleAPDUResponse( responseInfo )
  {
    if ( this.apduResponseMonitor != undefined )
      this.apduResponseMonitor( responseInfo );
  }

  advanceCommandStep()
  {
    switch( this.curStep )
    {
      case EMVCommandHelper.cmdSelectFile:
        this.curStep = EMVCommandHelper.cmdGetProcessingOptions;
        break;

      case EMVCommandHelper.cmdGetProcessingOptions:
        this.curStep = EMVCommandHelper.cmdReadRecord;
        this.rec = 0;
        break;

      case EMVCommandHelper.cmdReadRecord:
        if ( this.rec < 3 )
          this.rec++;
        else
          this.curStep = EMVCommandHelper.cmdGenerateAC;
        break;

      case EMVCommandHelper.cmdGenerateAC:
        this.curStep = 'cmdAuthorize';
        break;

      case 'cmdAuthorize':
        this.curStep = undefined;
        break;
    }
  }

  curStep;
  rec;
  executeStep( nextStep )
  {
    if ( nextStep != undefined )
      this.curStep == nextStep;

    switch( this.curStep )
    {
      case EMVCommandHelper.cmdSelectFile:
      {
        this.showAPDUCommand( this._emvKernel.commandHelper.buildSelectApplication( [ 0xA0, 0x00, 0x00, 0x01, 0x54, 0x44, 0x42 ] ) );
        break;
      }

      case EMVCommandHelper.cmdGetProcessingOptions:
      {
        this.showAPDUCommand( this._emvKernel.commandHelper.buildGetProcessingOptions( [ 0x83, 0x00 ] ) );
        break;
      }

      case EMVCommandHelper.cmdReadRecord:
      {
        if ( this.rec == 0 )
          this.showAPDUCommand( this._emvKernel.commandHelper.buildReadRecord( 1, 1 ) );
        else if ( this.rec == 1 )
          this.showAPDUCommand( this._emvKernel.commandHelper.buildReadRecord( 1, 2 ) );
        else if ( this.rec == 2 )
          this.showAPDUCommand( this._emvKernel.commandHelper.buildReadRecord( 1, 3 ) );
        else if ( this.rec == 3 )
          this.showAPDUCommand( this._emvKernel.commandHelper.buildReadRecord( 2, 1 ) );
        break;
      }

      case EMVCommandHelper.cmdGenerateAC:
      {
        var bCID = EMV.CID_ARQC;
        var gacData = this._emvKernel.formatDOL( "9F0206 9F0306 9F1A02 9505 5F2A02 9A03 9C01 9F3704 9F3501" );
        // = "00000000 00000000 00000000 00000000 00000000 00000000 00000000 0034";

        this.showAPDUCommand( this._emvKernel.commandHelper.buildGenerateAC( bCID, gacData ) );
        break;
      }

      case 'cmdAuthorize':
      {
        var de55 = this._emvKernel.getTLVList( "5A 5F34 9F02 9F03 9F1A 95 5F2A 9A 9C 9F37 9F35 5F2A 9F36 9F27 9F10 9F26" ).toString();

        this._toNetwork.sendMessage( new Message<{}>( { method: "authorize" }, de55 ) );

        return;
      }
    }

    this._emvKernel.commandHelper.executeAPDUCommand( this.handleAPDUResponse );
  }

  getStep() { return this.curStep; }
  setAPDUCommandMonitor( monitor ) { this.apduCommandMonitor = monitor; }
  setAPDUResponseMonitor( monitor ) { this.apduResponseMonitor = monitor; }

  getKernel() { return this._emvKernel; }
}

ComponentBuilder
  .init( EMVPOSSimulator, 'EMV POS Simulator', 'A pure-js simulation of an EMV payment (chip-and-pin) terminal', 'emv-payments' )
  .port( 'iso7816', 'ISO7816 Smartcard Commands', Direction.OUT, { protocol: SlotProtocolHandler, required: true } );
