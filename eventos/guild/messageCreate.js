const config = require(`${process.cwd()}/config/config.json`)
const serverSchema =  require(`${process.cwd()}/modelos/servidor.js`)
const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`)
const Discord = require('discord.js');
module.exports = async (client, message) => {
    if(!message.guild || !message.channel || message.author.bot) return;
    await asegurar_todo(message.guild.id, message.author.id);
    let data = await serverSchema.findOne({guildID: message.guild.id})
    if(!message.content.startsWith(data.prefijo)) return;
    const args = message.content.slice(data.prefijo.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));

    if(command) {

        if(command.owner){
            if(!config.ownerIDS.includes(message.author.id)) return message.reply(`❌ **Only bot owners can run this command! **\n**Bot Owners:** ${config.ownerIDS.map(ownerid => `<@${ownerid}>`)}❌`)
        }
        

        if(command.permisos){
            if(!message.member.permissions.has(command.permisos)) return message.reply(`❌ **You Dont Have Permissions! **\n**Permissions:** ${command.permisos.map(permiso => `\`${permiso}\``)}❌`).join(", ")
        }

        command.run(client, message, args, data.prefijo)
    } else {
        const embederror = new Discord.MessageEmbed()
        .setDescription(`❌the command don't exist❌`)
        .setColor("RED")
        return message.reply({embeds: [embederror]})
    }

}