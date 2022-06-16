const schema = require(`${process.cwd()}/modelos/servidor.js`)

module.exports = {
    name: "prefix",
    aliases: ["changeprefix"],
    desc: "change the bot prefix in the server!",
    owner: true,
    run: async(client, message, args, prefix) => {
        if(!args[0]) return message.reply(`❌Please type a new prefix❌`)
        await schema.findOneAndUpdate({guildID: message.guild.id}, {
            prefijo: args[0]
        })
        return message.reply(`The prefix has been successfully changed from:\`${prefix}\` to:\`${args[0]}\``)
    }
}