var express = require('express');
var router = express.Router();

var teamManager = require('../teams')
teamManager.load()
const progressManager = require("../playerProgress")

progressManager.load()
// teamManager.addTeam("memo-2", "password")
// progressManager.addTeam("memo-2")
// progressManager.chooseQuestType("memo-2", 1)
// progressManager.markTeamStationVisited("memo-2", 0, 0)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Главная' });
});

router.get('/register', function(req, res, next) {
  console.log("register data:", req.query.login)
  if (!req.query.login || !req.query.password || req.query.login == "null" || req.query.password == "null"){
    res.render('auto', { title: 'Регистрация команды', type: 'register' });
  }
  else {
    res.render('choose', { title: "Выбор квеста"});
  }
});

router.get('/login', function(req, res, next) {
  if (!req.query.login  || !req.query.password || req.query.login == "null" || req.query.password == "null"){
    res.render('auto', { title: 'Вход', type: 'login' });
  }
  else {
    res.render('choose', { title: "Выбор квеста"});
  }
});

router.get('/map', function(req, res, next) {
  res.render('choose', { title: "Выбор квеста"});
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

  if (teamManager.findTeam(login, password)){
    let bools = progressManager.getBoolArrayOfVisit(login)
    console.log(bools)
    res.end(JSON.stringify(bools))
  }
});




router.post('/checkUser', function(req, res, next) {
  let login = req.body.login
  let password = req.body.password
  console.log("User wants to check account!");
  console.log(login, password);

  var isTeamExist = teamManager.findTeam(login, password)
  console.log("Send response:", isTeamExist);
  res.end(JSON.stringify(isTeamExist));
});

module.exports = router;
