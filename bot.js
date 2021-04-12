const discord = require('discord.js');
const fs = require('fs');
var client = new discord.Client();
const token = ''; // Here goes your Bot token
var dict = new Object;


client.on('ready', () => {
    console.log("This Bot found a motivation to Live"); 
    load();
    setTimeout(updatePresence, 1000);
});

function load(){
    fs.readFile('output.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
    
        // parse JSON object
        const thingy = JSON.parse(data.toString());
        dict = thingy;
    });
}

function updatePresence(){
    client.user.setActivity(`${dict["compNW"]} N-Words`, {
        type: "STREAMING",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    });
}

function save(){
    var jsonContent = JSON.stringify(dict);
    
    fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
}

client.on("message", (msg) => {

    if(msg.content.startsWith('°')){
        var args = msg.content.split(' ');
        switch(args[0]){
            case("°count"):
                var user = null;
                if(args[1].startsWith("<")){
                    var s = args[1].split('!')[1];
                    s = s.substring(0, s.length - 1);
                    user = msg.guild.members.cache.get(s);
                }
                else{
                    msg.channel.send("Please use the @ / Ping feature so the bot can get the user");
                    return;
                }
                
                if(user == null){
                    msg.channel.send("This user does not exist");
                    return;
                }

                if(dict[user.user.id] == null){
                    dict[user.user.id] = 0;
                }

                msg.channel.send(user.displayName + ` has said the N-Word ${dict[user.user.id]} times and is responsible for ${((dict[user.user.id] / dict["compNW"]) * 100).toString().substring(0,5)}% of N-Words`);
            break;
            case("°update"):
                updatePresence();
            break;
        }
        return;
    }

    if(msg.content.toUpperCase().includes("NIGGA")){
        dict["compNW"] += 1;
        if(dict[msg.member.user.id] == null){
            dict[msg.member.user.id] = 0;
        }
        dict[msg.member.user.id] += 1;
        updatePresence();
        save();
    }
});

client.login(token);