describe("Test", function(){
  it("Should", function(){
    var f = Publications.aggregate;
    f.added = function(){};
    spyOn( Publications.aggregate, 'added');
    Publications.aggregate( 42, 2014 );
  });
});
