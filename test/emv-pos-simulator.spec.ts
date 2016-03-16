import { EMVPOSSimulator, EMVCardSimulator } from 'emv';
import { Channel, Component } from 'cryptographix-sim-core';

function newPOS( ): EMVPOSSimulator {
  let pos = new EMVPOSSimulator();
  let card = new EMVCardSimulator( null );

  let cardIn = card.initialize( {} )[ 0 ];
  let posOut = pos.initialize( {} )[ 0 ];

  let chan = new Channel();
  chan.addEndPoint( cardIn );
  chan.addEndPoint( posOut );
  chan.activate();

  return pos;
}

describe('EMVPOSSimulator', () => {
  it( 'implements the Component interface', () => {
    var pos = new EMVPOSSimulator();

    expect( pos[ 'initialize' ] ).not.toBe( undefined );
    expect( pos[ 'teardown' ] ).not.toBe( undefined );
  } );

  it( 'has a slot for cards', () => {
    var pos = newPOS();
  } );

} );
