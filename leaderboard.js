PlayersList = new Mongo.Collection('players');

//console.log('Hello World');
if (Meteor.isClient) {
  Meteor.subscribe('thePlayers');
  Template.leaderboard.helpers({
    'player': function() {
      var currentUserId = Meteor.userId();
      return PlayersList.find({}, { sort: {score: -1, name: 1} }); //score descending; name ascending
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

  /*********************************************
  /***** Meteor Events**************************
  *********************************************/
  Template.leaderboard.events({
    'click li': function() {
      var playerId = this._id; //cannot use Meteor.userId();
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScores', selectedPlayer, 5);
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      Meteor.call('modifyPlayerScores', selectedPlayer, -5);
    },
    'click .deletePlayer': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      var selectedPlayerName = PlayersList.findOne(selectedPlayer).name;
      var confirmRemove = confirm("Do you reallly want to remove " + selectedPlayerName + " from the list?");
      if (confirmRemove) {
        Meteor.call('removePlayerData', selectedPlayer);
      }
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();
      var playerNameVar = event.target.playerName.value, 
          playerScoreVar = event.target.playerScore.value;
      if (playerNameVar == '') {
        console.log('Enter a name');
      }
      else{
        Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);
      }
      event.target.playerName.value = '';
      event.target.playerScore.value = '';
    }
  });
}

/********** SERVER SIDE *********/
if (Meteor.isServer) {
  Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId; //meteor.userId() cannot be used within publish() function
    return PlayersList.find({createdBy: currentUserId});
  });

  //Create Meteor methods, which are functions executed from the server after being triggered by the client.
  Meteor.methods({
    'insertPlayerData': function(playerNameVar, playerScoreVar) {
      var currentUserId = Meteor.userId();
      if (playerScoreVar == '') {
        PlayersList.insert({
          name: playerNameVar,
          score: 0,
          createdBy: currentUserId
        });
      }
      else {
        PlayersList.insert({
          name: playerNameVar,
          score: parseInt(playerScoreVar),
          createdBy: currentUserId
        });
      }
    },
    'removePlayerData': function(selectedPlayer) {
      var currentUserId = Meteor.userId();
      return PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
    },
    'modifyPlayerScores': function(selectedPlayer, scoreValue) {
      var currentUserId = Meteor.userId();
      PlayersList.update({_id: selectedPlayer, createdBy: currentUserId}, {$inc: {score: scoreValue}});
      //$set appends the value only once. $inc does it repeatedly.
    }
  });


}