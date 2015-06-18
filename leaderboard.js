PlayersList = new Mongo.Collection('players');

//console.log('Hello World');
if (Meteor.isClient) {
  Meteor.subscribe('thePlayers');
  Template.leaderboard.helpers({
    'player': function() {
      var currentUserId = Meteor.userId();
      return PlayersList.find({createdBy: currentUserId}, { sort: {score: -1, name: 1} }); //score descending; name ascending
      //PlayersList.find().fetch() will return an array instead
    },
    'selectedClass': function() {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return "selected";
      }
    },
    'showSelectedPlayer': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    },
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
    'click .deletePlayer': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      var selectedPlayerName = PlayersList.findOne(selectedPlayer).name;
      var confirmRemove = confirm("Do you reallly want to remove " + selectedPlayerName + " from the list?");
      if (confirmRemove) {
        return PlayersList.remove(selectedPlayer);
      }
    },
    'dblclick li': function() {
      console.log('You double-clicked');
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var playerScoreVar = event.target.playerScore.value;
      var currentUserId = Meteor.userId();
      if (playerNameVar == '') {
        console.log('Enter a name');
      } 
      else{
        if (playerScoreVar == '') {
          PlayersList.insert({
            name: playerNameVar,
            score: 0,
            createdBy: currentUserId
          });
        } else {
          PlayersList.insert({
            name: playerNameVar,
            score: parseInt(playerScoreVar),
            createdBy: currentUserId
          });
        }
        event.target.playerName.value = '';
      }
    }
  });
}
if (Meteor.isServer) {
  Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId});
  });
}