PlayersList = new Mongo.Collection('players');

console.log('Hello World');
if (Meteor.isClient) {
  Template.leaderboard.helpers({
    'player': function() {
      return PlayersList.find()
    },
    'otherFunction': function() {
      return "Some other function"
    }
  });

  /****
  ***** Meteor Events
  ****/
  Template.leaderboard.events({
    'click li': function() {
      console.log('You clicked an li element');
    },
    'dblclick li': function() {
      console.log('You double-clicked');
    }
  });
}
if (Meteor.isServer) {
  console.log('Hello Server');
}