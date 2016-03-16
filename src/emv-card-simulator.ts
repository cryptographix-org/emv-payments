import { Kind, KindBuilder, ByteArray, Component, ComponentBuilder, EndPoint, Message, Direction } from 'cryptographix-sim-core';
//import { inject } from 'cryptographix-sim-core';
import { CommandAPDU, ResponseAPDU, JSIMSlot, JSIMScriptCard, SlotProtocolHandler } from 'cryptographix-se-core';
import { JSIMEMVApplet } from './card/jsim-emv-applet';

//@inject()
export class EMVCardSimulator implements Component
{
  _config: {};

  _slot: JSIMSlot;
  _card: JSIMScriptCard;
  _cardHandler: SlotProtocolHandler;
  _apduIn: EndPoint;

  private _node: Node;
  constructor( node: Node ) {
    this._node = node;
  }

  initialize( config: {} ): EndPoint[]
  {
    this._config = config;

    this._apduIn = new EndPoint( 'iso7816', Direction.IN );

    this._slot = new JSIMSlot();

    this._card = new JSIMScriptCard();

    this._slot.insertCard( this._card );

    let emvApp = new JSIMEMVApplet();

    this._card.loadApplication( new ByteArray( [ 0xA0, 0x00, 0x00, 0x01, 0x54, 0x44, 0x42 ] ), emvApp )

    return [ this._apduIn ];
  }

  teardown() {
    if ( this._slot )
      this._slot.ejectCard();

    this._slot = null;

//    if ( this._card )
//      this._card.deleteAllApplications();

    this._card = null;

    this._apduIn = null;
    this._cardHandler = null;
  }

  start(  )
  {
    // The SlotProtocolHandler will process incoming ISO7816 slot-protocol
    // packets, redirecting them to the linked Slot
    this._cardHandler = new SlotProtocolHandler();

    this._cardHandler.linkSlot( this._slot, this._apduIn );
  }

  stop()
  {
    // Stop processing slot packets ...
    this._cardHandler.unlinkSlot( );
    this._cardHandler = null;

    // reset card
    this._slot.powerOff();
  }
}

export class CardConfig implements Kind {
  onlineOnly: boolean;
  offlineDataAuth: OfflineDataAuthentication;
  profile: string;
}

export enum OfflineDataAuthentication {
  NOODA,
  SDA,
  DDA,
  CDA
}

KindBuilder.init( CardConfig, 'EMV Card Simulator Configuration')
  .boolField( 'onlineOnly', 'Online Line')
  .enumField( 'offlineDataAuth', 'Offline Authentication', OfflineDataAuthentication )
  .stringField( 'profile', 'Card Profile' );

ComponentBuilder
  .init( EMVCardSimulator, 'EMV Card Simulator', 'A pure-js simulator for EMV Payment Cards', 'emv-payments' )
  .config( CardConfig, { onlineOnly: true, offlineDataAuth: OfflineDataAuthentication.NOODA, profile: 'default' } )
  .port( 'iso7816', 'Smartcard Commands', Direction.IN, { protocol: SlotProtocolHandler, required: true } );
