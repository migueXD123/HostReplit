const Discord = require('discord.js')

module.exports = {
    name: "queue",
    aliases: ["q"],
    desc: "see the queue of the songs!",
    run: async(client, message, args, prefix) => {
        //comprobaciones previas
        const queue = client.distube.getQueue(message);
        if(!message.member.voice?.channel) return message.reply(`❌ **no songs active in the moment!** ❌`);
        if(message.guild.me.voice?.channel && message.member.voice?.channel.id != message.guild.me.voice?.channel.id) return message.reply(`❌ **Please join my same voice channel to be able to execute the command!** ❌`)
        
        let listaqueue = [];
        var maximascanciones = 10;
        for(let i = 0; i < queue.songs.length; i += maximascanciones){
            let canciones = queue.songs.slice(i, i + maximascanciones);
            listaqueue.push(canciones.map((cancion, index) => `**\`${i+ ++index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n"))
        }

        var limite = listaqueue.length
        var embeds = [];
        //loop en canciones hasta el limite
        for(let i = 0; i< limite; i++){
            let desc = String(listaqueue[i].substring(0, 2048))
            //crear embed por 10 canciones
            let embed = new Discord.MessageEmbed()
            .setTitle(`🎶 Queue of: ${message.guild.name} - \`[${queue.songs.length > 1 ? "Songs" : "Song"}]\`🎶`)
            .setColor("#0040ff")
            .setDescription(desc)
            //si la cantidad de canciones es mayor a 1 then especificar en el ember la cancion de la reproduccion
            if(queue.songs.length > 1) embed.addField(`💿Current song`, `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**` )
            await embeds.push(embed)
        }
        return paginacion();

        //definir funcion paginacion
        async function paginacion(){
            let paginaActual = 0;
            // si la cantidad de embeds es 1 enviar sin botones
            if(embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(() => {});
            //si la cantidad de embeds es mayor a 1, hacemos el resto
            let boton_atras = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Back').setEmoji('⬅️').setLabel('Back')
            let boton_inicio = new Discord.MessageButton().setStyle('DANGER').setCustomId('Start').setEmoji('🏠').setLabel('Start')
            let boton_avanzar = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Next').setEmoji('➡️').setLabel('Next')
            //enviar mensaje con botones
            let embedpaginas = await message.channel.send({
                content: `**Click in the _buttons_ to change the page!**`,
                embeds: [embeds[0].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})],
                components: [new Discord.MessageActionRow().addComponents([boton_atras, boton_inicio, boton_avanzar])]
            });
            //creamos colectoy y filtramos el click del usu, y que sea el mismo del comando y q el autor sea el cliente
            const collector = embedpaginas.createMessageComponentCollector({filter: i => i?.isButton() && i?.user && i?.user.id == message.author.id && i?.message.author.id == client.user.id, time: 180e3});
            //Escuchamos eventos del colector
            collector.on("collect", async b => {
                if(b?.user.id !== message.author.id) return b?.reply(`❌ Only the person who wrote the message can change pages. ❌`);

                switch (b?.customId) {
                    case "Back":{
                        collector.resetTimer();
                        if(paginaActual !== 0){
                            paginaActual -= 1
                            await embedpaginas.edit({embeds: [embeds[paginaActual].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();
                        } else {
                            paginaActual = embeds.length-1
                            //editar wea
                            await embedpaginas.edit({embeds: [embeds[paginaActual].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();
                        }
                    }
                        break;


                        case "Start": {
                            collector.resetTimer();
                            paginaActual = 0;
                            await embedpaginas.edit({embeds: [embeds[paginaActual].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                            await b?.deferUpdate();
                            }
                            break;

                        case "Next":{
                            collector.resetTimer();
                            if(paginaActual < embeds.length -1){
                                paginaActual++
                                await embedpaginas.edit({embeds: [embeds[paginaActual].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                                await b?.deferUpdate();
                            } else {
                                paginaActual = 0
                                //editar wea
                                await embedpaginas.edit({embeds: [embeds[paginaActual].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});
                                await b?.deferUpdate();
                            }
                        }
                            break;

                    default:
                        break;
                    
                }
                    
            });
            collector.on("end", () => {
                embedpaginas.components[0].components.map(boton => botondisabled = true)
                embedpaginas.edit({content: `Time has expired! type \`${prefix}queue again to see the list again.\``, embeds: [embeds[paginaActual].setFooter({text: `Page: ${paginaActual+1} / ${embeds.length}`})], components: [embedpaginas.components[0]]}).catch(() => {});

            })
        }
    }
}