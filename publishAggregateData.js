var collection = new Mongo.Collection("Collection");

if (Meteor.isServer) {
  Publications = {};

  Publications.aggregate = function(week, year){
    var self = this;
    check( week, Number );
    check( year, Number );

    var initializing = true;
  
    self.week = moment( ).year(year).isoWeek( week );
    self.start = week.startOf('week');
    self.end = week.endOf('week');
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
        self.changed(colName, calcId(doc.date), {aggregate: calcAggregate(date)} );
      }
    }
  
    var selector = {'date': [{$gte: self.start.clone().startOf('day')}, {$lte: self.end.endOf('day')}]};
    self.handle = collectionName.find(selector).observe({
      added: updateAggregate,
      changed: function( old, current ){
        updateAggregate( current );
        if( moment(doc.date).isSame(old.date,'day') ){
          updateAggregate( old );
        }
      },
      removed: updateAggregate
    });

    for( var date = start.clone(); !date.isAfter( end ); date.add(1, 'days') ){
      self.added( colName, calcId( date ), calAggregate( date ) );
    }

    initializing = false;
    self.ready();
    self.onStop(function(){
      self.handle.stop();
    });
  };

  Meteor.publish( Publications.aggregate );
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
