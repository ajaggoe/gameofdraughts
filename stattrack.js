let gameStatus = {
    since: Date.now(),
    gamesInitialized: 0,
    gamesCompletedRed: 0,
    gamesCompletedWhite: 0,
    recentTime: '00:00'
  }
  
  module.exports = gameStatus;