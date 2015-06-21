/*** CLIENT-SIDE ONLY **************************/

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