const Discord = require('discord.js');
const config = require('./config/config.json')
require('colors')
const client = new Discord.Client({
    restTimeOffset: 0,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.color = config.color;

function requerirhandlers(){
    ["command", "events", "distube", "reaccion_roles"].forEach(handler => {
        try {
            require(`./handlers/${handler}`)(client, Discord)
        } catch(e){
            console.warn(e)
        }
    })
}
requerirhandlers();

client.login(config.token)

// OTgxMTU4MjM3MTU4MTE3NDA2.GIeuBE.0mGBpjTLa_8bcFE9UtueTgTxVtmgQSXKyGhC2g
// OTgzNDgwMTY3NzAxODA3MTQ0.GEbWbZ.KHWOFnZySBIWhAkZsJl0J_kUjerb_yEo1BD8L4