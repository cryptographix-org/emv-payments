import { ByteArray } from 'cryptographix-sim-core';
import { JSIMEMVApplet, EMV } from 'emv';
import { CommandAPDU, ResponseAPDU, ISO7816 } from 'cryptographix-se-core';

function printResponse( rAPDU: ResponseAPDU )
{
  var l = rAPDU.data.toString();
  //l = JSON.stringify( rAPDU );
  console.log( l );
}

describe('JSIMEMVApplet', () => {
  it( 'can be selected', ( done ) => {
    var card = new JSIMEMVApplet();
    var selectAPDU = CommandAPDU.init().setINS( ISO7816.INS_SELECT_FILE );

    card.selectApplication( selectAPDU )
      .then( (rAPDU) => {
        printResponse( rAPDU );
        var gpoAPDU = CommandAPDU.init()
          .setINS( EMV.INS_GET_PROCESSING_OPTIONS )
          .setData( new ByteArray( [ 0x83, 0x00 ] ) );

        return card.executeAPDU( gpoAPDU );
      })
      .then( (rAPDU) => {
        printResponse( rAPDU );
        var gacAPDU = CommandAPDU.init()
          .setINS( EMV.INS_GENERATE_AC )
          .setData( new ByteArray( [ 0x83, 0x00 ] ) );

        return card.executeAPDU( gacAPDU );
      })
      .then( (rAPDU) => {
        printResponse( rAPDU ); ;

        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      })
  } );

} );
