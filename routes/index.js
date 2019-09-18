var express = require('express');
var router = express.Router();

var teamManager = require('../teams')
teamManager.load()
const progressManager = require("../playerProgress")
const stationsManager = require("../stationsManager")

const adminData = {
  login: "admin",
  password: "sas"
}

progressManager.load()
// teamManager.addTeam("memo-2", "password")
// progressManager.addTeam("memo-2")
// progressManager.chooseQuestType("memo-2", 1)
// progressManager.markTeamStationVisited("memo-2", 0, 0)


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Главная' });
});

router.get('/register', function(req, res, next) {
  console.log("Register data:", req.query.login, req.query.password)
  if (!req.query.login || !req.query.password || req.query.login == "null" || req.query.password == "null"){
    res.render('auto', { title: 'Регистрация команды', type: 'register' });
  }
  else {
    res.render('choose', { title: "Выбор квеста"});
  }
});

router.get('/login', function(req, res, next) {
  let login = req.query.login
  let password = req.query.password
  let UserType = whoIsUser(login, password)

  switch (UserType){
    case "player":
        res.render('choose', { title: "Выбор квеста"});
      break
    case "adminVolo":
        res.render('volunteer')
      break
    case "unknown":
        res.render('auto', { title: 'Вход', type: 'login' });
      break
    default: throw "UserType Error!"
  }
});

router.get('/content', function(req, res, next) {
  let login = req.query.login
  let password = req.query.password
  let UserType = whoIsUser(login, password)

  switch (UserType){
    case "player":
      res.render('choose', { title: "Выбор квеста"});
      break
    case "adminVolo":
      res.render('volunteer');
      break
    case "unknown":
      res.render('index', { title: 'Главная' });
      break
    default: throw "UserType Error!"
  }
});





router.post('/createUser', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  console.log("User wants to create account!");
  console.log(login, password);

  let isTeamExist = teamManager.findTeam(login, password)
  if (isTeamExist == false){
    teamManager.addTeam(login, password)
    progressManager.addTeam(login)
    progressManager.chooseQuestType(login, 1)
    // progressManager.markTeamStationVisited(login, 0, 0)
    isTeamExist = true
  }
  console.log("Send response:", isTeamExist);
  res.end(JSON.stringify(isTeamExist));
});

router.post("/acceptQuest", function(req, res, next){
  let login = req.body.login
  let password = req.body.password
  let questType = req.body.questType
  console.log("Data:", login, password, questType)

  if (teamManager.findTeam(login, password)){
    if (questType != 0 && questType != 1 && questType != -1){
      res.end()
      res.end(JSON.stringify({isTypeCorrect: false}))
    }
    else {
      progressManager.chooseQuestType(login, questType)
      res.end(JSON.stringify({isTypeCorrect: true}))

    }
  }
});

router.get("/seeStations", function(req, res, next){
  let login = req.query.login
  let password = req.query.password
  console.log("Data:", login, password)

  if (teamManager.findTeam(login, password)){
    switch (progressManager.getCurrentQuestType(login)){
      case 0:
        let bools = progressManager.getBoolArrayOfVisit(login)
        res.render("adultQuest", {isVisited: bools})
        break
      case 1:
        res.render("superQuest")
        break
    }
  }
});

router.post("/getVisitedStations", function(req, res, next){
  let login = req.body.login
  let password = req.body.password
  let UserType = whoIsUser(login, password)

  switch (UserType){
    case "player":
    case "adminVolo":
      let bools = progressManager.getBoolArrayOfVisit(login)
      console.log(bools)
      res.end(JSON.stringify(bools))
      break
    case "unknown":
      break
    default: throw "UserType Error!"
  }
});


router.post('/checkUser', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  console.log(`User wants to check account: ${login} ${password}`)
  let UserType = whoIsUser(login, password)
  let serverAns = {type: UserType, isExist: false}

  switch (UserType){
    case "player":
    case "adminVolo":
      serverAns.isExist = true
      break
    case "unknown":
      serverAns.isExist = false
      break
    default: throw "UserType Error!"
  }
  res.end(JSON.stringify(serverAns))
});

router.post('/getQuestStationsNumber', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  let questType = req.body.type
  console.log(`User wants to getStationsNumber: ${login} ${password} ${questType}`)
  let UserType = whoIsUser(login, password)
  let serverAns = {valid: false, number: 0}

  switch (UserType){
    case "adminVolo":
      serverAns.valid = true
      serverAns.number = stationsManager.getNumOfStationsByQuestType(questType)
      break
    case "unknown":
    case "player":
      break
    default: throw "UserType Error!"
  }
  res.end(JSON.stringify(serverAns))
});


router.post('/getSuitableTeams', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  let questType = req.body.type
  let stationNum = req.body.station
  console.log(`User wants to getStationsNumber: ${login} ${password} ${questType} ${stationNum}`)
  let UserType = whoIsUser(login, password)
  let serverAns = {valid: false, teams: []}

  switch (UserType){
    case "adminVolo":
      serverAns.valid = true
      serverAns.teams = progressManager.getSuitableTeams(questType, stationNum)
      break
    case "unknown":
    case "player":
      break
    default: throw "UserType Error!"
  }
  res.end(JSON.stringify(serverAns))
});

router.post('/markTeamVisited', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  let questType = req.body.type
  let stationNum = req.body.station
  let teamName = req.body.team
  console.log(`User wants to markTeamVisited: ${login} ${password} ${questType} ${stationNum} ${teamName}`)
  let UserType = whoIsUser(login, password)
  let serverAns = {valid: false}

  switch (UserType){
    case "adminVolo":
      serverAns.valid = true
      progressManager.markTeamStationVisited(teamName, questType, stationNum)
      break
    case "unknown":
    case "player":
      break
    default: throw "UserType Error!"
  }
  res.end(JSON.stringify(serverAns))
});

module.exports = router;


function whoIsUser(login, password){
  if (login == adminData.login && password == adminData.password){
    return "adminVolo"
  }
  if (teamManager.findTeam(login, password)){
    return "player"
  }
  else 
    return "unknown"
}