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
}
if (Meteor.isServer) {
  console.log('Hello Server');
}