 
const Discord = require('discord.js');
const sheets = require('./google_sheets.js');
const parse = require('./parse_email.js');
const { prefix, token } = require('./config.json');
//const { parse } = require('path');

const client = new Discord.Client();

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    console.log('Ready!');
    
});

client.on('message', msg => {
    if (msg.channel.type === 'dm' && !msg.author.bot) { //&& msg.content === 'YES') { 
        egdPrompt(msg);
    }
});

client.on('guildMemberAdd', member => {
    if (member.bot) { 
        return;
    }

    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    welcomeChannel.send(`Welcome ${member} to the server! \n\n **Please check your DM's :eyes:**`);

    initialDirectMessage(member);
});

async function initialDirectMessage(member) {
    let check = await checkUserMember(member)
    if (check) {
        //console.log('bot true')
        console.log(`${member.id} has returned!`);
        member.send("Welcome back to the EGD Discord server! :crown: :crown:")
    }
    else { 
        //console.log('bot not true');
        member.send("Welcome to the EGD Discord server! :crown: :crown:\nIf you're new, please reply with EGD!");
    }
}

async function egdPrompt (msg) { 
    //console.log(msg.author.id);
    //console.log('out function');
    let check = await checkUserID(msg.author.id);
    if (msg.content.toLowerCase() === "egd" && check == false) { 
        //console.log('in function');
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
            //sheets.insert(msg.author.id, arr[0], arr[1], arr[2], arr[3], 0) 
            //console.log(`Inserted ${arr[0]} ${arr[1]} into Database`);
            const emailSheetNum = parse.check(parseEmail(arr[2]));

            if (emailSheetNum != 0) { 
                //console.log('trying to insert in to subsheet');
                sheets.insert(msg.author.id, arr[0], arr[1], arr[2], arr[3], emailSheetNum) 
                if(emailSheetNum == 1) { 
                    console.log(`Inserted ${arr[0]} ${arr[1]} into CUNY`);
                }
                else if(emailSheetNum == 2) { 
                    console.log(`Inserted ${arr[0]} ${arr[1]} into SUNY`);
                }
            }
            else { 
                sheets.insert(msg.author.id, arr[0], arr[1], arr[2], arr[3], 0) 
                console.log(`Inserted ${arr[0]} ${arr[1]} into Database`);
            }

        });
    }
    else if (msg.content.toLowerCase() === "egd" && check == true) {
        msg.channel.send("Already in the database! Enjoy your stay! :hugging:")
    }
}
async function checkUserMember(member) { 
    if(await sheets.checkReturningUser(member.id) == true) { 
        return true;
    }
    else { 
        return false;
    }
}

async function checkUserID(memberID) { 
    if(await sheets.checkReturningUser(memberID) == true) { 
        //console.log("bot true");
        return true;
    }
    else { 
        //console.log("bot false");
        return false;
    }
}

function parseEmail(email) { 
    var parsed = email.split("@");
    return parsed[1];
}

client.login(token);