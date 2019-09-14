class Station {
    constructor(questType, number, arrayText, arrayImg){
        this.questType = questType
        this.number = number
        this.arrayText = arrayText
        this.arrayImg = arrayImg
    }

    getType(){
        return this.questType
    }

    getNumber(){
        return this.number
    }

    getArrayText(){
        return this.arrayText
    }

    getArrayImg(){
        return this.arrayImg
    }
}

class StationsManager {
    constructor(){
        this.stations = []
        this.stations.push(new Station(0,0, ["1 station of adult quest", "descr"], []))
        this.stations.push(new Station(0,1, ["2 station of adult quest", "descr"], []))
        this.stations.push(new Station(0,2, ["3 station of adult quest", "descr"], []))
        this.stations.push(new Station(0,3, ["4 station of adult quest", "descr"], []))
        this.stations.push(new Station(0,4, ["5 station of adult quest", "descr"], []))
        this.stations.push(new Station(0,5, ["6 station of adult quest", "descr"], []))

        this.stations.push(new Station(1,0, ["1 station of super quest", "descr"], []))
        this.stations.push(new Station(1,1, ["2 station of super quest", "descr"], []))
        this.stations.push(new Station(1,2, ["3 station of super quest", "descr"], []))
        this.stations.push(new Station(1,3, ["4 station of super quest", "descr"], []))
        this.stations.push(new Station(1,4, ["5 station of super quest", "descr"], []))
        console.log("Station Manager created!")
    }

    getStation(questType, stationNumber){
        for (const station of this.stations)
            if (station.getType() == questType && station.getNumber() == stationNumber)
                return station
        throw "incorrect parametres"
    }

    getNumOfStationsByQuestType(questType){
        let count = 0
        for (const station of this.stations)
            if (station.getType() == questType)
                count++
        return count
    }
}

const manager = new StationsManager()

module.exports = manager;
// module.exports = Station;