collection = new Mongo.Collection("Collection");

if( Meteor.isClient ){
  aggregate = new Mongo.Collection("aggregateCollectionName");
  Meteor.subscribe("aggregate", 42, 2014);
}

if (Meteor.isServer) {
  Publications = {};

  var calcId = function( date ){
    return date.format("MM/DD/YYYY");
  };

  var calcAggregate = function(date){
    return date.day;
  };

  /*
   * Takes IsoWeek and Year 
   */
  Publications.aggregate = function(weekNum, year){
    var self = this;
    check( weekNum, Number );
    check( year, Number );

    var initializing = true;
  
    self.week = moment( ).year(year).isoWeek( weekNum );
    self.start = self.week.clone().startOf('week');
    self.end = self.week.clone().endOf('week');
    self.colName = "aggregateCollectionName";

    var updateAggregate = function(doc){
      if( !initializing ){
        self.changed(self.colName, calcId(doc.date), {aggregate: calcAggregate(date)} );
      }
    }

    self.observeFuncs = {
      added: updateAggregate,
      changed: function( old, current ){
        updateAggregate( current );
        if( !moment(current.date).isSame(old.date,'date') ){
          updateAggregate( old );
        }
      },
      removed: updateAggregate
    };
  
    var selector = {'date': [
      {$gte: self.start.clone().startOf('day')}, 
      {$lte: self.end.endOf('day')}
    ]};
    self.handle = collection.find(selector).observe( self.observeFuncs );

    for( 
        var date = self.start.clone(); 
        !date.isAfter( self.end, 'day' ); 
        date.add(1, 'days') 
    ){
      self.added( self.colName, calcId( date ), calcAggregate( date ) );
    }

    initializing = false;
    self.ready();
    self.onStop(function(){
      self.handle.stop();
    });
  };

  Meteor.publish( "aggregate", Publications.aggregate );
}
