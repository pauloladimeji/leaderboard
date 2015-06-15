PlayersList = new Mongo.Collection('players');

//console.log('Hello World');
if (Meteor.isClient) {
  Template.leaderboard.helpers({
    'player': function() {
      return PlayersList.find()
    },
    'selectedClass': function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return "selected";
      }
    }
  });

  /****
  ***** Meteor Events
  ****/
  Template.leaderboard.events({
    'click li': function() {
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
      //console.log(selectedPlayer);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5} });
      //$set appends the value only once. $inc does it repeatedly.
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5} });
      //$set appends the value only once. $inc does it repeatedly.
    },
    'dblclick li': function() {
      console.log('You double-clicked');
    }
  });
}
if (Meteor.isServer) {
  console.log('Hello Server');
}