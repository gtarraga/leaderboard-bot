const Discord = require('discord.js');
const overwatch = require('overwatch-api');
const owjs = require('overwatch-js');
const fs = require('fs');
const client = new Discord.Client({autoReconnect:true});
const tokens = require('./tokens.json');

client.login(tokens.key);

global.leaderboard;
global.leaderboardString = "";
global.mainMessageID = "";
global.mainChannel

fs.readFile('./leaderboard.json', 'utf8', function (err, data) {
	if (err) {
       console.log(err)
   	}
	else {
		leaderboard = JSON.parse(data);
	}
});


client.on('ready', () => {
	//client.user.setUsername('The Black Knight');
	console.log(`Logged in as ${client.user.tag}!`);
	// mainChannel = client.channels.find(n => n.id == "443052872729624579");
	//
	//
	// mainChannel.fetchMessage(mainMessageID)
	// .then(message => {
	// 	mainMessage = message;
	// })
	// .catch(console.error());
});

const prefix = "!";

client.on('message', message => {
	var botMaster = message.guild.roles.find("name", "Bot Master");


	//Command arguments
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

//Message creation
// 	if (command === 'r') {
// 		//csgo, fortnite, pubg, overwatch
// 		roleMessage.react(message.guild.emojis.get(emoteCSGO));
// 		roleMessage.react(message.guild.emojis.get(emoteFortnite));
// 		roleMessage.react(message.guild.emojis.get(emotePUBG));
// 		roleMessage.react(message.guild.emojis.get(emoteOW));
// 	}
// 	if (command === 's') {
//
// 		message.channel.sendMessage("Hello everyone and welcome to the server. We have a few different roles available here that give you access to various areas of the server, such as different game roles that enable access to the voice channels and text channels, some opt-in channels and the Events role so you can get alerted when we have something new for you to take part in.\n\nTo get the roles, all you need to do is click the emote below.");
//
// 		message.channel.send({"embed": {
// 				"color": 3404990,
// 				"fields": [
// 					{
// 					"name": "Game role assignment",
// 					"value": "React/click the emoji with each game you play by clicking the corresponding icons below to gain access to that game's channels."
//       				}
//     			]
//   			}
// 		})
// 		.then(message => {
// 			message.react(message.guild.emojis.get(emoteCSGO));
// 			message.react(message.guild.emojis.get(emoteFortnite));
// 			message.react(message.guild.emojis.get(emotePUBG));
// 			message.react(message.guild.emojis.get(emoteOW));
// 			roleMessage = message;
// 		})
//
//
// 		message.channel.send({"embed": {
// 				"color": 3404990,
// 				"fields": [
// 					{
// 					"name": "Want to get notified for discord events?",
// 					"value": "React/click the emoji below to **opt-in** to recieving alerts for discord events like PUGs or tournaments."
//       				}
//     			]
//   			}
// 		})
// 		.then(message => {
// 			message.react("✅");
// 			message = eventsMessage;
//
// 		})
//
// 		message.channel.send({"embed": {
// 				"color": 3404990,
// 				"fields": [
// 					{
// 					"name": "Want to get access to an anime discussion channel?",
// 					"value": "React/click the emoji below to enable access to the Anime Channel."
//       				}
//     			]
//   			}
// 		})
// 		.then(message => {
// 			message.react("✅");
// 			animeMessage = message;
// 		})
// 	}
//

	if (command === 'add') {
		var limit;
		leaderboardString = "";

		owjs.getAll('pc', args[1], args[0].replace(/#/g, '-')).then((data) => {
			var profile = {
				"id":message.author.id,
				"flag": "",
				"region": args[1],
				"btag": args[0].replace(/#/g, '-'),
				"overwatch": {
					"username": data.profile.nick,
					"rank": data.profile.rank
				}
			}
			console.log(data.profile);

			leaderboard.push(profile);
			leaderboard.sort(function (a, b) {
				return b.overwatch.rank - a.overwatch.rank;
			});
			// console.log(leaderboard);

			if(leaderboard.length < 100) limit = leaderboard.length;
			else limit = 100;

			for(let i = 0; i < limit; i++) {

				var user = message.guild.members.get(leaderboard[i].id);


				leaderboardString += pad(i+1) + ". **" + leaderboard[i].flag + " " + user.displayName + "** (*" + leaderboard[i].overwatch.username + "*) [" + leaderboard[i].overwatch.rank + "]\n";
			}

			message.channel.send({"embed": {
    			"title": "**LEADERBOARDS**",
    			"description": "\n" + leaderboardString,
				"color": 356976
			}});

			fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 4), 'utf8', function(err){
				if(err){
					console.log(err);
				}
			});

		});

		// overwatch.getProfile('pc', args[1], args[0].replace(/#/g, '-'), (json) => {
		// 	var profile = {
		// 		"id":message.author.id,
		// 		"flag": "",
		// 		"region": args[1],
		// 		"btag": args[0].replace(/#/g, '-'),
		// 		"overwatch": {
		// 			"username": json.username,
		// 			"rank": json.competitive.rank
		// 		}
		// 	}
		//
  		// 	leaderboard.push(profile);
		// 	leaderboard.sort(function (a, b) {
		// 		return b.overwatch.rank - a.overwatch.rank;
		// 	});
		// 	console.log(leaderboard);
		//
		// 	if(leaderboard.length < 100) limit = leaderboard.length;
		// 	else limit = 100;
		//
		// 	for(let i = 0; i < limit; i++) {
		//
		// 		var user = message.guild.members.get(leaderboard[i].id);
		//
		//
		// 		leaderboardString += pad(i+1) + ". **" + leaderboard[i].flag + " " + user.displayName + "** (*" + leaderboard[i].overwatch.username + "*) [" + leaderboard[i].overwatch.rank + "]\n";
		// 	}
		//
		// 	message.channel.send({"embed": {
    	// 		"title": "**LEADERBOARDS**",
    	// 		"description": "\n" + leaderboardString,
		// 		"color": 356976
		// 	}});
		//
		// 	fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 4), 'utf8', function(err){
		// 		if(err){
		// 			console.log(err);
		// 		}
		// 	});
		// });
	}

	if(command === "log") console.log(leaderboard);

	if(command === "write") write(leaderboard);

	if(command === "update") update(message);

	if(command === "send") sendLeaderboard(message, leaderboard);
	//if(command === "update") console.log(updateLeaderboards());
});




function updateLeaderboards() {
	leaderboard.forEach(function(user) {
		owjs.getAll('pc', user.region, user.btag).then((data) => {
			user["overwatch"] = {
				"username": data.profile.nick,
				"rank": data.profile.rank
			};
			console.log(data.profile.rank);
		});
		// overwatch.getProfile('pc', user.region, user.btag, (json) => {
		// 	user["overwatch"] = {
		// 		"username": json.username,
		// 		"rank": json.competitive.rank
		// 	};
		// 	console.log(json.competitive.rank);
		// })
	});

	// leaderboard.sort(function (a, b) {
	// 	return b.overwatch.rank - a.overwatch.rank;
	// });
	// return console.log(leaderboard);
}

async function update(message) {
	await updateLeaderboards();
	sendLeaderboard(message);
	return write();

	// updateLeaderboards(function() {
	// 	console.log("updated leaderboard");
	// 	sortRank(leaderboard, function() {
	// 		console.log("sorted");
	// 		sendLeaderboard(message, function() {
	// 			write();
	// 		})
	// 	})
	// });
}

function sortRank(leaderboard) {
	leaderboard.sort(function (a, b) {
		return b.overwatch.rank - a.overwatch.rank;
	});
}

function sendLeaderboard(message) {
	leaderboardString = "";

	if(leaderboard.length < 100) limit = leaderboard.length;
	else limit = 100;

	for(let i = 0; i < limit; i++) {

		var user = message.guild.members.get(leaderboard[i].id);


		leaderboardString += pad(i+1) + ". **" + leaderboard[i].flag + " " + user.displayName + "** (*" + leaderboard[i].overwatch.username + "*) [" + leaderboard[i].overwatch.rank + "]\n";
	}

	message.channel.send({"embed": {
		"title": "**LEADERBOARDS**",
		"description": "\n" + leaderboardString,
		"color": 356976
	}});
}

function write() {
	fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 4), 'utf8', function(err){
		if(err){
			console.log(err);
		}
	});
}

function pad(number) {
   return (number < 10 ? '0' : '') + number;
}
