const Quest = require("./quest.js")

class TeamManager {
	constructor(fileName){
		this.fileName = fileName;
		this.maxID = 0;
	}

	load() {
		try {
			this.teams = require(`./`+this.fileName);
			console.log("Loaded teams:");
			console.log(this.teams);

			// if (this.teams.length != 0)
			// 	this.maxID = this.teams[this.teams.length-1].id;
			// console.log("maxID:", this.maxID);
		} 
		catch(e){
			console.log(e.name, e.message);
			console.log("No Teams file on server.");
			this.teams = [];
			let fs = require("fs");
			fs.writeFile(this.fileName, JSON.stringify(this.teams), (err) => {
				if (err)
					console.log("Error in load(); when writing empty file: ", err);
				else 
					console.log("New TeamsInfo File was created!");
			});
		}
	}

	save(){
		let fs = require("fs");
		fs.writeFile(this.fileName, JSON.stringify(this.teams), (err) => {
			if (err)
				console.log("Error in save(); TeamInfo-file was not saved!");
			else
				console.log(`TeamInfo-file ${this.fileName} was saved!`);
		});	
	}

	findTeam(login, pass){
		for (const team of this.teams){
			if (team.login == login)
				return true;
		}
		return false
	}

	addTeam(login, pass){
		this.teams.push({
			login: login,
			password: pass,
		})
		this.save()
	}
}

const teams = new TeamManager("db/teamInfo.json");

module.exports = teams;