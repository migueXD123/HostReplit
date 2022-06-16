const {inspect} = require('util');
const Discord = require('discord.js');
module.exports = {
    name: "eval",
    aliases: [],
    desc: "XD",
    owner: true,
    run: async(client, message, args, prefix) => {
        if(!args.length) return message.reply(`❌ **Type a JS code to eval!** ❌`);

        try {
            const evaluado = await eval(args.join(" "));
            const truncado = truncar(inspect(evaluado), 2045)
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Eval`)
                    .setDescription(`\`\`\`js\n${truncado}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                
                ]
            })
        } catch (e){
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Eval`)
                    .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                    .setColor("FF0000")
                    .setTimestamp()
                
                ]
            })
        }
    }
}

function truncar(texto, n){
    if(texto.length > n){
        return texto.substring(0, n) + "..."
    } else {
        return texto;
    }
}