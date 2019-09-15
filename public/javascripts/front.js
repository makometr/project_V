function registerUser(){
    var login = document.getElementById("UserLogin").value;
    var password = document.getElementById("UserPassword").value;
    var parent = document.getElementById("MsgParent")
    if (parent.childElementCount > 0)
        parent.removeChild(parent.firstChild)

    // если что-то не заполнено, не отправляем
    if (login == "" || password == ""){
        console.log("Empty")
        var divCont = document.createElement("div")
        divCont.className = "w3-panel w3-red w3-display-container w3-round"
        divCont.innerHTML = "<h3>Ошибка!</h3><p>Незаполненные поля!</p>"
        parent.append(divCont)
        return;
    }
    
    $.post("/createUser", {login: login, password: password}, (data) => {
        data = JSON.parse(data)
        if (data == false){
            var divCont = document.createElement("div")
            divCont.className = "w3-panel w3-red w3-display-container w3-round"
            divCont.innerHTML = "<h3>Ошибка!</h3><p>Команда с таким именем уже существует!</p>"
            parent.append(divCont)
        }
        else {
            var divCont = document.createElement("div")
            divCont.className = "w3-panel w3-green w3-display-container w3-round"
            divCont.innerHTML = "<h3>Успех!</h3><p>Ваша команда успешно зарегистрирована!</p>"
            parent.append(divCont)

            window.localStorage.setItem("login", login);
            window.localStorage.setItem("pass", password);

            setTimeout(() => {  
                document.location.href = "/content?" + getBody();
            }, 1500);
        }
    });
}

function checkUser(){
    var login = document.getElementById("UserLogin").value;
    var password = document.getElementById("UserPassword").value;
    var parent = document.getElementById("MsgParent")
    if (parent.childElementCount > 0)
        parent.removeChild(parent.firstChild)

    
    if (login == "" || password == ""){
        var divCont = document.createElement("div")
        divCont.className = "w3-panel w3-red w3-display-container w3-round"
        divCont.innerHTML = "<h3>Ошибка!</h3><p>Незаполненные поля!</p>"
        parent.append(divCont)
        return;
    }
    
    $.post("/checkUser", {login: login, password: password}, (data) => {
        data = JSON.parse(data)
        console.log("Response from server checking:", data)
        if (data.isExist == false){
            var divCont = document.createElement("div")
            divCont.className = "w3-panel w3-red w3-display-container w3-round"
            divCont.innerHTML = "<h3>Ошибка!</h3><p>Неверные данные!</p>"
            parent.append(divCont)
        }
        else if (data.type == "player" || data.type == "adminVolo") {
            var divCont = document.createElement("div")
            divCont.className = "w3-panel w3-green w3-display-container w3-round"
            divCont.innerHTML = "<h3>Успех!</h3><p>Вход...</p>"
            parent.append(divCont)

            window.localStorage.setItem("login", login);
            window.localStorage.setItem("pass", password);

            if (data.type == "player"){
                setTimeout(() => {  
                    document.location.href = "/content?" + getBody();
                }, 1500);
            }
            if (data.type == "adminVolo"){
                setTimeout(() => {  
                    document.location.href = "/content?" + getBody();
                }, 1500);
            }
        }
    });
}

function getBody(){
    let body = 'login=' + encodeURIComponent(window.localStorage.getItem("login")) 
             + '&password=' + encodeURIComponent(window.localStorage.getItem("pass"));
    return body;
}

function GoToRegister(){
    document.location.href = "/register?" + getBody();
}

function GoToLogin(){
    document.location.href = "/login?" + getBody();
}

function rollQuest(rolledBlockID, plusBlockID){
    let rolledElem = document.getElementById(rolledBlockID);
    let plusElem = document.getElementById(plusBlockID);
    if (rolledElem.className.indexOf("w3-show") == -1) {
        rolledElem.className += " w3-show";
        plusElem.innerText = "–"
    }
    else { 
        rolledElem.className = rolledElem.className.replace(" w3-show", "");
        plusElem.innerText = "+"
    }
}

$(document).ready(() => {
    let nameElem = document.getElementById("TeamName")
    if (nameElem)
        nameElem.innerHTML = "<b>Команда:</b> " + localStorage.getItem("login")
        
    let elemsChoosen = document.getElementsByClassName("StationBlock")
    if (elemsChoosen.length != 0){
        for (elem of elemsChoosen){
                elem.classList.replace("w3-light-green", "w3-light-grey")
                elem.style.borderBottomColor = "#ccc"
                elem.style.borderTopColor = "#ccc"
        }
    
        $.post("/getVisitedStations", {login: window.localStorage.getItem("login"),
                                       password: window.localStorage.getItem("pass")},
        (data) => {
            data = JSON.parse(data)
            console.log("Response from server getVisitedStations:", data)
            let count = 0
            for (let index = 0; index < data.length; index++){
                if (data[index] == true){
                    count++
                    let elemStation = document.getElementById("station-"+index.toString())
                    elemStation.classList.replace("w3-light-grey", "w3-light-green")
                    elemStation.style.borderBottomColor = "green"
                    elemStation.style.borderTopColor = "green"

                }
            }
            if (count == data.length){
                document.getElementById('modalWinner').style.display='block';
                setTimeout(() => {  
                    document.location.href = "/content?" + getBody();
                }, 3000);
            }
        }); 
    }
})

function quitTeam(){
    localStorage.removeItem("login")
    localStorage.removeItem("pass")

    document.location = "/"
}


var choosedQuest = -1

function chooseQuest(questBlockID){
    let elemsChoosen = document.getElementsByClassName("QuestBlockChoose")
    for (elem of elemsChoosen){
        elem.classList.replace("w3-light-green", "w3-light-grey")
        elem.style.borderBottomColor = "#ccc"
        elem.style.borderTopColor = "#ccc"
    }

    let questBlock = document.getElementById(questBlockID)
    questBlock.classList.replace("w3-light-grey", "w3-light-green")
    questBlock.style.borderBottomColor = "green"
    questBlock.style.borderTopColor = "green"

    choosedQuest = parseInt(questBlockID.charAt(questBlockID.length-1))
}

function acceptQuest(){
    $.post("/acceptQuest", {login: window.localStorage.getItem("login"),
                            password: window.localStorage.getItem("pass"),
                            questType: choosedQuest},
            (data) => {
                data = JSON.parse(data)
                console.log("Response from server checking:", data)
                if (data.isTypeCorrect == true)
                document.location.href = "/seeStations?" + getBody();
    });   
}





// stations

function rollStation(rolledBlockID){
    let rolledElem = document.getElementById(rolledBlockID);
    if (rolledElem.className.indexOf("w3-show") == -1) {
        rolledElem.className += " w3-show";
    }
    else { 
        rolledElem.className = rolledElem.className.replace(" w3-show", "");
    }
}


// volo

var questVolo = -1
var stationVolo = -1

function chooseStationByVolo(questType, stationNumber, liID){
    questVolo = parseInt(questType)
    stationVolo = parseInt(stationNumber)

    let ulElem = document.getElementById("stationList") 
    for (let child of ulElem.children){
        child.className = child.className.replace(" w3-green", "")
    }

    let li = document.getElementById(liID)
    li.className += " w3-green"


}

function chooseQuestByVolo(buttonIDs, index, stationParentID, stationListID){
    for (let buttonID of buttonIDs){
        let button = document.getElementById(buttonID);
        button.style.fontWeight = "normal"
    }
    document.getElementById(buttonIDs[index]).style.fontWeight = "bold"
    questVolo = -1
    stationVolo = -1

    let rolledElem = document.getElementById(stationParentID);
    rolledElem.className += " w3-show";

    currQuestType = buttonIDs[index].charAt(buttonIDs[index].length-1)
    $.post("/getQuestStationsNumber", {login: window.localStorage.getItem("login"),
                                       password: window.localStorage.getItem("pass"),
                                       type: currQuestType},
    (data) => {
        data = JSON.parse(data)
        // console.log("Response from server getQuestStationsNumber:", data)
        if (data.valid == true){
            let ulParent = document.getElementById(stationListID)
            while (ulParent.childElementCount > 0)
                ulParent.removeChild(ulParent.firstChild)
            for (let i = 0; i < data.number; i++){
                let node = document.createElement("li")
                node.innerText = `Станция ${i+1}`
                node.setAttribute(`onClick`, `chooseStationByVolo(${currQuestType}, ${i}, 'station-${i}')`)
                node.setAttribute('id', `station-${i}`)
                ulParent.appendChild(node)
            }
        }
    }); 
}


var teamNameVoloAccept = null

function colorizeTeam(teamName, teamElemID){
    teamNameVoloAccept = teamName
    let ulElem = document.getElementById("teamList");
    for (let child of ulElem.children){
        child.className = child.className.replace(" w3-green", "")
    }

    let li = document.getElementById(teamElemID)
    li.className += " w3-green"
}

function showTeams(modalID, listID){
    if (questVolo == -1 || stationVolo == -1)
        return
    
    $.post("/getSuitableTeams", {login: window.localStorage.getItem("login"),
                                       password: window.localStorage.getItem("pass"),
                                       type: questVolo,
                                       station: stationVolo},
    (data) => {
        data = JSON.parse(data)
        console.log("Response from server getSuitableTeams:", data)
        if (data.valid == true){
            let modal = document.getElementById(modalID)
            modal.style.display = "block"

            let ulParent = document.getElementById(listID)
            while (ulParent.childElementCount > 0)
                ulParent.removeChild(ulParent.firstChild)
            for (let i = 0; i < data.teams.length; i++){
                let node = document.createElement("li")
                node.innerText = `${data.teams[i]}`
                node.setAttribute(`onClick`, `colorizeTeam('${data.teams[i]}', 'team-${i}')`)
                node.setAttribute('id', `team-${i}`)
                node.setAttribute("style", "padding: 12px 0px 12px 8px; margin-top: 3px;")
                node.setAttribute("class", "w3-large")
                ulParent.appendChild(node)
            }
        }
    }); 
}

function markTeamVisited(modalID){
    if (teamNameVoloAccept){
        console.log("Visited!")

        $.post("/markTeamVisited", {login: window.localStorage.getItem("login"),
                                     password: window.localStorage.getItem("pass"),
                                     type: questVolo,
                                     station: stationVolo,
                                     team: teamNameVoloAccept},
        (data) => {
            data = JSON.parse(data)
            console.log("Response from server markTeamVisited:", data)
            if (data.valid == true){
                teamNameVoloAccept = null
                stationVolo = -1

                document.getElementById(modalID).style.display='none'
                let rolledElem = document.getElementById("stationParent");
                rolledElem.className = rolledElem.className.replace(" w3-show", "");

                // let ulParent = document.getElementById(listID)
                // while (ulParent.childElementCount > 0)
                //     ulParent.removeChild(ulParent.firstChild)
                // for (let i = 0; i < data.teams.length; i++){
                //     let node = document.createElement("li")
                //     node.innerText = `${data.teams[i]}`
                //     node.setAttribute(`onClick`, `colorizeTeam('${data.teams[i]}', 'team-${i}')`)
                //     node.setAttribute('id', `team-${i}`)
                //     node.setAttribute("style", "padding: 12px 0px 12px 8px; margin-top: 3px;")
                //     node.setAttribute("class", "w3-large")
                //     ulParent.appendChild(node)
                // }
            }
        }); 
    }
}