module.exports = {
    name: "skip",
    aliases: ["skipmusic", "sk"],
    desc: "skip a song!",
    run: async(client, message, args, prefix) => {
        //comprobaciones previas
        const queue = client.distube.getQueue(message);
        if(!message.member.voice?.channel) return message.reply(`❌ **no songs active in the moment!** ❌`);
        if(message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(`❌ **Please join my same voice channel to be able to execute the command!** ❌`)
        client.distube.skip(message);
        message.reply(`⏭️ **Skipped!** ⏭️`)
    }
}