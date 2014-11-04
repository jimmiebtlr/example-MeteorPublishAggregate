describe("Aggregate Publication", function(){
  beforeEach(function () {
    MeteorStubs.install();
    mock(global, "collection");
    spyOn( collection, "find").and.returnValue({observe: function() { return ; }});
    obj = {
      aggregate: Publications.aggregate,
      added: function(){},
      changed: function(){},
      ready: function(){},
      onStop: function(){}
    };
  });

  afterEach(function () {
    MeteorStubs.uninstall();
  });

  it("should add the correct number of initial records", function(){
    spyOn( obj, 'added');
    spyOn( obj, 'ready');
    obj.aggregate( 42, 2014 );
    expect( obj.added.calls.count() ).toBe( 7 ); // one week
    expect( obj.ready.calls.count() ).toBe( 1 ); // one week
  });

  it("should update the correct record when a collection record is inserted", function(){
    spyOn( obj, 'changed');
    obj.aggregate( 42, 2014 );

    var date = moment().year(2014).isoWeek(42);
    obj.observeFuncs.added({date: date});
    
    expect( obj.changed.calls.count() ).toBe( 1 );
    expect( obj.changed ).toHaveBeenCalledWith( "aggregateCollectionName",  date.format("MM/DD/YYYY"), {aggregate: date.day});
  });
  
  it("should update 2 records when a collection record changes date", function(){
    spyOn( obj, 'changed');
    obj.aggregate( 42, 2014 );

    var date = moment().year(2014).isoWeek(42);
    obj.observeFuncs.changed({date: date},{date: date.clone().add(2,'days')});
    
    expect( obj.changed.calls.count() ).toBe( 2 );
  });
  
  it("should update the correct record when a collection record is removed", function(){
    spyOn( obj, 'changed');
    obj.aggregate( 42, 2014 );

    var date = moment().year(2014).isoWeek(42);
    obj.observeFuncs.removed({date: date});
    
    expect( obj.changed.calls.count() ).toBe( 1 );
    expect( obj.changed ).toHaveBeenCalledWith( "aggregateCollectionName",  date.format("MM/DD/YYYY"), {aggregate: date.day});
  });
});
