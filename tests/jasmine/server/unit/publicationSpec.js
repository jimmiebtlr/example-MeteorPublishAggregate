describe("Test", function(){
  beforeEach(function () {
    MeteorStubs.install();
    mock(global, "collection");
  });

  afterEach(function () {
    MeteorStubs.uninstall();
  });

  it("Should", function(){
    var obj = {
      aggregate: Publications.aggregate,
      added: function(){},
      ready: function(){},
      onStop: function(){}
    };
    spyOn( collection, "find").and.returnValue({observe: function() { return; }});
    spyOn( obj, 'added');
    obj.aggregate( 42, 2014 );
    expect( obj.added.calls.count() ).toBe( 7 ); // one week
  });
});
