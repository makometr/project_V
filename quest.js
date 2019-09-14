module.exports = class Quest {
    constructor(type){
        type = typeof b !== 'undefined' ? type : 0
        let stationsNumber = 0
        switch (type){
            case 1:
                stationsNumber = 6
                break
            case 2:
                stationsNumber = 6
                break
            case 3:
                stationsNumber = 5
                break
            default:
                console.log("Error: incorrect type of quest in constructor!")
        }
        this.type = type
        this.stations = []
        for (let i = 0; i < stationsNumber; i++)
            this.stations.push({"number": i, "isVisited": false, "time": "", "text": [], "img": []})
    }

    getName(){
        switch (this.type){
            case 0:
                return "Квест не выбран"
                break
            case 1:
                return "Детский квест"
                break
            case 2:
                return "Взрослый квест"
                break
            case 3:
                return "Супер-квест"
                break
        }
    }
};