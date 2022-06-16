module.exports = {
    name: "ping",
    aliases: ["ms"],
    desc: "see the bot ms!",
    run: async(client, message, args, prefix) => {
        message.reply(`Pong! The bot ping is: \`${client.ws.ping}ms!\``)
    }
}