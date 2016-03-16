import { EMVCardSimulator } from 'emv';
import { EndPoint, Message, Component } from 'cryptographix-sim-core';

describe('EMVCardSimulator', () => {
  it( 'implements the Component interface', () => {
    var card: Component = new EMVCardSimulator( null );

    expect( card.initialize ).not.toBe( undefined );
    expect( card.teardown ).not.toBe( undefined );
  } );

  it( 'can be selected', () => {
    var card = new EMVCardSimulator( null );
    //var endPoint = new EndPoint();
    //card.
  } );

} );
