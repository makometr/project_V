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
                document.location.href = "/map?" + getBody();
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
        if (data == false){
            var divCont = document.createElement("div")
            divCont.className = "w3-panel w3-red w3-display-container w3-round"
            divCont.innerHTML = "<h3>Ошибка!</h3><p>Неверные данные!</p>"
            parent.append(divCont)
        }
        else {
            var divCont = document.createElement("div")
            divCont.className = "w3-panel w3-green w3-display-container w3-round"
            divCont.innerHTML = "<h3>Успех!</h3><p>Вход...</p>"
            parent.append(divCont)

            window.localStorage.setItem("login", login);
            window.localStorage.setItem("pass", password);

            setTimeout(() => {  
                document.location.href = "/map?" + getBody();
            }, 1500);
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
    if (elemsChoosen){
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
                    document.location.href = "/map?" + getBody();
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