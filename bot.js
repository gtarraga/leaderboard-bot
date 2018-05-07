const Discord = require('discord.js');
const overwatch = require('overwatch-api');
const fs = require('fs');
const client = new Discord.Client({autoReconnect:true});
const tokens = require('./tokens.json');

client.login(tokens.key);

global.leaderboard;
global.mainMessageID = "";

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
	mainChannel = client.channels.find(n => n.name == "leaderboard");


	mainChannel.fetchMessage(mainMessageID)
	.then(message => {
		mainMessage = message;
	})
	.catch(console.error());
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

		var profile = overwatch.getProfile('pc', 'eu', args[0].replace(/#/g, '-'), (json) => {

			var profile = {
				"id":message.author.id,
				"flag": "",
				"overwatch": json
			}
  			leaderboard.push(profile);
			console.log(profile);

			leaderboard.sort(function (a, b) {
				return b.overwatch.competitive.rank - a.overwatch.competitive.rank;
			});

			fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 4), 'utf8', function(err){
				if(err){
					console.log(err);
				}
			});
		});



	}

	if (command === 'flag') {

	}
});
