module.exports = {
    name: "help",
    aliases: ["h"],
    desc: "All the commands here!",
    run: async(client, message, args, prefix) => {
        message.reply(`Hi! here is the Aviable Commands: \`${prefix}queue, ${prefix}prefix, ${prefix}play, ${prefix}queue, ${prefix}skip and ${prefix}stop.\``)
    }
}