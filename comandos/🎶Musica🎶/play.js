module.exports = {
    name: "play",
    aliases: ["playmusic", "pm"],
    desc: "play a song!",
    run: async(client, message, args, prefix) => {
        //comprobaciones previas
        if(!args.length) return message.reply(`❌ **Please type a song to play it!** ❌`);
        if(!message.member.voice?.channel) return message.reply(`❌ **Please join a voice channel to listen to the song!** ❌`);
        if(message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(`❌ **Please join my same voice channel to be able to execute the command!** ❌`)
        client.distube.play(message.member.voice?.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        });
        message.reply(`🔎**Searching \`${args.join(" ")}\`...**🔎`);
    }
}