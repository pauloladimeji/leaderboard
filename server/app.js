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
