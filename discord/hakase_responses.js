const Logger = require("../logger/logger");
const request = require('request');
const Discord = require("discord.js");

module.exports.interpretHakaseQuery = async (client, message) => {
    if (message.cleanContent == "meow" || message.cleanContent.includes("nya")) {
        Logger.log("info", "Received meow request");
        await message.channel.send("https://tinyurl.com/y2mlo33q");
    } else if (message.cleanContent == "dance") {
        Logger.log("info", "Received dance request");
        await message.channel.send("https://tinyurl.com/yyulqpeg");
    } else if (message.cleanContent == "shark") {
        Logger.log("info", "Received shark request");
        await message.channel.send("https://tinyurl.com/yybbw6au");
    } else if (message.cleanContent.toLowerCase().includes("sleep")) {
        Logger.log("info", "Received sleep request");
        await message.channel.send("But I don't wanna!\nhttps://tinyurl.com/y5xmjyuo");
    } else if (message.cleanContent.toLowerCase() == "have a roll cake") {
        Logger.log("info", "Received roll cake request");
        await message.channel.send("Thank you!\nhttps://tinyurl.com/y8h4docz");
    } else if (message.cleanContent.toLowerCase().match(/(G|g)ood bot.?/)) {
        return;
    } else if (message.cleanContent.toLowerCase().match(/(B|b)ad bot.?/)) {
        return;
    } else if (message.cleanContent.startsWith("Hakase is")) {
        if (containsPraiseWords(message.cleanContent) && !containsBlameWords(message.cleanContent) ||
            containsPraisePhrases(message.cleanContent)) {
            await message.channel.send("Ehehehe~ your praise making me blush.\nhttps://tinyurl.com/w6zoctl");
        } else {
            await message.channel.send("https://tinyurl.com/y2qev36j");
        }
    } else if (message.cleanContent.toLowerCase() == "jankenpon") {
        let clips = [
            "https://gfycat.com/saltyunfoldedechidna",
            "https://gfycat.com/sarcasticconsciousivorybilledwoodpecker",
            "https://gfycat.com/heartysolidanchovy",
            "https://gfycat.com/livetenseelephantseal",
            "https://gfycat.com/pinkcheapgermanshorthairedpointer",
            "https://gfycat.com/presentdefiantbantamrooster",
        ];
        let random = Math.floor(Math.random() * clips.length);
        let outcome = clips[random];
        await message.channel.send(outcome);
    } else if (message.cleanContent.toLowerCase() == "play that funky music") {
        await message.channel.send("https://youtu.be/WP6DJfhPQTg");
    } else if (message.cleanContent.toLowerCase().match(/(Will|Is) (\w+ ?)+\?/i)) {
        await message.channel.send(yesNoResponses[Math.floor(Math.random() * yesNoResponses.length)]);
    } else if (message.cleanContent.toLowerCase() == "help") {
        const embedHelp = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Hakase help commands')
        .setDescription('List of available commands for Hakase. Arguments of the form <arg> are mandatory and to be replaced with appropriate text. Arguments of the form [arg] are optional.')
        .addFields(
            { name: '!whois <discord username or nickname>', value: 'Return real name of discord user. Only works if their name has been added to the database. Also accepts @ mentions.' },
            { name: '!whois <full real name>', value: 'Returns the discord username that corresponds to their full real name. Only if their name has been added to the database.' },
            { name: '!insertuser <discord username>, <full real name>', value: 'See !insert_user' },
            { name: '!insert_user  <discord username>, <full real name>', value: 'Adds someone to the name database. On successful insert, the user will be granted member role.' },
            { name: '!list_users', value: 'Returns name database entries in a JSON formatted string. Requires permissions to invoke.' },
            { name: '!delete_user <discord username>', value: 'Deletes an entry from the name database. Requires permissions to invoke.' },
            { name: '!register <full real name>, [identification]', value: 'Sends a message to admin channel so that admins can verify user.' },
            { name: '!fetch_users_json', value: 'Sends the name database as a JSON file. Requires permissions to invoke.' },
            { name: '!HAKASE', value: 'Call upon Hakase.' },
        )
        .attachFiles("images/Hakase_avatar.png")
        .setThumbnail("attachment://Hakase_avatar.png")
        .setTimestamp();
        await message.channel.send(embedHelp);
    } else {
        Logger.log("info", "Received unknown request. Searching Gfycat...");
        let urlQuery = encodeURI(message);
        request('https://api.gfycat.com/v1/gfycats/search?search_text=' + urlQuery, { json: true }, async (err, res, body) => {
            if (err) {
                Logger.warn(err);
                await message.channel.send("Sorry Hakase is busy right now. Go ask Nano instead.");
                return;
            }
            let gifs = body["gfycats"];
            if (gifs == undefined) {
                return;
            }
            gifs.sort(gfycatSearchResultCompare);
            for (let gif of gifs) {
                if (gif["nsfw"] == "0") {
                    await message.channel.send(gif["max5mbGif"]);
                    return;
                }
            }
        });

    }
}

function gfycatSearchResultCompare(a, b) {
    let aRank = parseInt(a["likes"]) + parseInt(a["views"])
    let bRank = parseInt(b["likes"]) + parseInt(b["views"])
    if (aRank > bRank) {
        return -1;
    } else if (aRank < bRank) {
        return 1;
    } else {
        return 0;
    }

}

function containsPraisePhrases(message) {
    const praisePhrases = ["the best", "best girl", "best waifu"];
    let messageWords = message.toLowerCase().split(" ");
    let desc = messageWords.slice(2).join(" ");
    for (praisePhrase of praisePhrases) {
        if (desc.match(new RegExp(praisePhrase + "!\?"))) {
            return true;
        }
    }
    return false;
}

function containsPraiseWords(message) {
    const praiseWords = ["cute", "kawaii", "good", "great", "amazing", "excellent"];
    return containsWordsWithNoNegation(message, praiseWords);
}

function containsBlameWords(message) {
    const blameWords = ["bad", "crap", "shit", "broken"];
    return containsWordsWithNoNegation(message, blameWords)
}

function containsWordsWithNoNegation(message, words) {
    let messageWords = message.toLowerCase().split(" ");
    let prevWord = "";
    for (messageWord of messageWords) {
        for (word of words) {
            if (messageWord.toLowerCase().includes(word) && prevWord != "not" && prevWord != "no") {
                return true;
            }
        }
        prevWord = messageWord;
    }
    return false;
}

let yesNoResponses = [
    "As I see it, yes!",
    "Ask again later. Hakase is busy right now",
    "Huhuhu. Better not tell you now.",
    "Cannot predict right now. Hakase needs milk first!",
    "Hakase can't understand such hard questions! Concentrate and ask again!",
    "Hpmh! Don’t count on it.",
    "It is certain. Hakase believes!",
    "It is decidedly so desu.",
    "Most likely desu.",
    "My reply is no.",
    "I asked Sakamoto and he says no.",
    "Outlook not so good!",
    "Outlook good!",
    "Reply hazy, try again later!",
    "All signs point to yes.",
    "Very doubtful.",
    "Without a doubt!",
    "Yes!",
    "Yes – definitely!",
    "You may rely on it.",
]