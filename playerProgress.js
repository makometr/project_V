const StationsManager = require("./stationsManager")

class TeamProgressManager {
	constructor(fileName){
		this.fileName = fileName;
    }
    
    load() {
		try {
            this.teamProgress = require(`./`+this.fileName)
			console.log("Loaded progress of teams:");
			console.log(this.teamProgress);
		} 
		catch(e){
			console.log(e.name, e.message);
			console.log("No Teams-progress file on server.");
			this.teamProgress = [];
            let fs = require("fs");
            // sync method
            fs.writeFileSync(this.fileName, JSON.stringify(this.teamProgress));
            // async variant
			// fs.writeFile(this.fileName, JSON.stringify(this.teamProgress), (err) => {
			// 	if (err)
			// 		console.log("Error in load(); when writing empty file: ", err);
			// 	else 
			// 		console.log("New TeamsProgress File was created!");
			// });
		}
    }
    
	save(){
        let fs = require("fs");
        // sync
        fs.writeFileSync(this.fileName, JSON.stringify(this.teamProgress))
        // async variant
        // fs.writeFile(this.fileName, JSON.stringify(this.teamProgress), (err) => {
        //     if (err)
        //         console.log("Error in save(); TeamProgress file was not saved!");
        //     else {
        //         console.log(`TeamProgress file ${this.fileName} was saved!`);
        //     }
        // });
    }
    
    addTeam(teamName){
        let obj = {
            teamName: teamName,
            currentQuestType: -1,
            progress: []
        }
    
        for (let i = 0; i < 2; i++){
            let stationsOnQuest = StationsManager.getNumOfStationsByQuestType(i)
            let stations = []
            for (let j = 0; j < stationsOnQuest; j++){
                stations.push({isVisited: false, comment: ""})
                console.log(`Create new station on quest ${i} station ${j}`)
            }
            obj.progress.push(stations);
        }
        this.teamProgress.push(obj)
		this.save()
    }

    chooseQuestType(teamName, questType){
        this.teamProgress.find(x => x.teamName === teamName).currentQuestType = questType;
        this.save()
    }
    
    markTeamStationVisited(teamName, questType, stationNumber, comment){
        comment = typeof comment !== 'undefined' ? comment : ""
        this.teamProgress.find(x => x.teamName === teamName).progress[questType][stationNumber].isVisited = true
        this.teamProgress.find(x => x.teamName === teamName).progress[questType][stationNumber].comment = comment
        this.save()
    }

    getCurrentQuestName(teamName){
        switch (parseInt(this.teamProgress.find(x => x.teamName === teamName).currentQuestType)){
            case -1:
                return "Квест не выбран"
            case 0:
                return "Взрослый квест"
            case 1:
                return "Супер-квест"
        }
    }
    
    getCurrentQuestType(teamName){
        return parseInt(this.teamProgress.find(x => x.teamName === teamName).currentQuestType)
    }

    getBoolArrayOfVisit(teamName){
        let ans = []
        const PlayerProgress = this.teamProgress.find(x => x.teamName === teamName)
        for (const station of PlayerProgress.progress[parseInt(PlayerProgress.currentQuestType)])
            ans.push(station.isVisited)
        return ans
    }

    getSuitableTeams(quest, station){
        let ans = this.teamProgress.filter(team => team.currentQuestType == parseInt(quest))
        ans = ans.filter(team => team.progress[quest][station].isVisited == false)
        ans = ans.map(team => team.teamName)
        return ans
    }
}


const progress = new TeamProgressManager("db/progressInfo.json");
module.exports = progress;
// module.exports = PlayerProgress;