const fs = require('fs');
const Discord = require('discord.js');
const sheets = require('./google_sheets.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    console.log('Ready!');
    
});

client.on('message', msg => {
    if (msg.channel.type === 'dm' && !msg.author.bot) { //&& msg.content === 'YES') { 
        //console.log('Received a DM');
        //msg.channel.send(`You typed ${msg}`);

        if (msg.content.toLowerCase() === "egd" && checkUser(msg.member) == false) { 
            msg.channel.send('Please type in your name, e-mail and affiliation in this format: **first name / last name / email / affiliation**');
            let messageFilter = m => !m.author.bot;
            let collector = new Discord.MessageCollector(msg.channel, messageFilter, {max: 1});
            collector.on('collect', (msg, col) =>  { 
                //console.log("Collected message: " + msg.content);
                //console.log("Collector is off!");
                var arr = msg.content.split("/").map(function(item) {
                    return item.trim();
                });
                msg.channel.send("**Name:**\n\t" + arr[0] + " " + arr[1] +
                                "\n**Email:**\n\t" + arr[2] +
                                "\n**Affiliation:**\n\t" + arr[3]);
                sheets.insert(msg.author.id, arr[0], arr[1], arr[2], arr[3]) 
                console.log(`Inserted ${arr[0]} ${arr[1]} into Database`);
            });
        }
    }
});

client.on('guildMemberAdd', member => {
    if (member.bot) { 
        return;
    }

    const memberID = member.id;
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    welcomeChannel.send(`Welcome ${member} to the server! \n\n **Please check your DM's :eyes:**`);

    directMessage(member);
});

async function directMessage(member) {
    if (await checkUser(member)) {
        console.log('bot true')
        console.log(`${member.id} has returned!`);
        member.send("Welcome back to the EGD Discord server! :crown: :crown:")
    }
    else { 
        console.log('bot not true');
        member.send("Welcome to the EGD Discord server! :crown: :crown:\nIf you're new, please reply with EGD!");
    }
}

async function checkUser(member) { 
    if(await sheets.checkReturningUser(member.id) == true) { 
        return true;
    }
    else { 
        return false;
    }
}


client.login(token);