describe("Test", function(){
  beforeEach(function () {
    MeteorStubs.install();
  });

  afterEach(function () {
    MeteorStubs.uninstall();
  });

  it("Should", function(){
    var f = Publications.aggregate;
    f.added = function(){};
    spyOn( Publications.aggregate, 'added');
    Publications.aggregate( 42, 2014 );
  });
});
