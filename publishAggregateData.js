var collection = new Mongo.Collection("Collection");

if( Meteor.isClient ){
  aggregate = new Mongo.Collection("aggregateCollectionName");
  Meteor.subscribe("aggregate", 42, 2014);
}

if (Meteor.isServer) {
  Publications = {};

  /*
   * Takes IsoWeek and Year 
   */
  Publications.aggregate = function(weekNum, year){
    var self = this;
    console.log( weekNum, year );
    check( weekNum, Number );
    check( year, Number );

    var initializing = true;
  
    self.week = moment( ).year(year).isoWeek( weekNum );
    self.start = self.week.startOf('week');
    self.end = self.week.endOf('week');
    self.colName = "aggregateCollectionName";
  
    var calcId = function( date ){
      return date.format("MM/DD/YYYY");
    };

    var calcAggregate = function(date){
      // ... something to calculate your aggregate value for that date
      // My use case was included aggregate data that responds in different ways based on existing days
      // For a simple aggregation such as sum you can replace
      return date.day;
    };

    var updateAggregate = function(doc){
      if( !initializing ){
        self.changed(self.colName, calcId(doc.date), {aggregate: calcAggregate(date)} );
      }
    }
  
    var selector = {'date': [{$gte: self.start.clone().startOf('day')}, {$lte: self.end.endOf('day')}]};
    self.handle = collection.find(selector).observe({
      added: updateAggregate,
      changed: function( old, current ){
        updateAggregate( current );
        if( moment(doc.date).isSame(old.date,'day') ){
          updateAggregate( old );
        }
      },
      removed: updateAggregate
    });

    for( var date = self.start.clone(); !date.isAfter( self.end ); date.add(1, 'days') ){
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

/*
 * Publish Aggregate time data
 *
 * Create test case for check functions
 * - 
 *
 * Making it pass
 *
 * Lets start with a jasmine test case
 *
 *  - check subscription sends initial data
 *
 * And to make it pass
 *
 * This works great, but it isn't reactive. If a record is added the change is not sent down the wire.
 *
 * - Test case for record added.
 * 
 * Code to make it pass
 * - Reason for initializing flag
 *
 * Add Change and Removed
 *
 *
 */
