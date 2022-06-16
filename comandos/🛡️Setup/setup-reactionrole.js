const Discord = require("discord.js");
const setupSchema = require(`${process.cwd()}/modelos/setups.js`)

module.exports = {
    name: "setup-reactionrole",
    aliases: ["srl", "srls", "setup-reactionroles"],
    desc: "The Roles setup",
    owner: true,
    run: async(client, message, args, prefix) => {
        var contador = 0;
        var finalizado = false;
        
        var objeto = {
            ID_MENSAJE: "",
            ID_CANAL: "",
            Parametros: []
        }

        emoji()
        async function emoji(){
            contador++;
            if(contador === 23) return finalizar()
            var parametros = {
                Emoji: "",
                Emojimsg: "",
                Rol: "",
                msg: "",
            };

            let preguntar = await message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`What Emoji dou you want to use for the \`${contador}° role?\``)
                .setDescription(`*React to **__this message__** with the emoji!*\n\nType \`finish\` To finish the setup!`)
                .setColor(client.color)
            ]
            });
            preguntar.awaitReactions({
                filter: (reaction, user) => {
                    return user.id === message.author.id && !finalizado;
                },
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().emoji.id && collected.first().emoji.id.length > 2){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.id;
                    if(collected.first().emoji.animated){
                        parametros.Emoji = `<a:${collected.first().emoji.id}>`
                    } else {
                        parametros.Emoji = `<:${collected.first().emoji.id}>`
                    }
                    return rol()
                } else if(collected.first().emoji.name){
                    preguntar.delete();
                    parametros.Emoji = collected.first().emoji.name;
                    parametros.Emojimsg = collected.first().emoji.name;
                    return rol()
                } else {
                    message.reply('Cancelled and Finishing setup...')
                    return finalizar();
                }
            }).catch(() => {
                return finalizar();
            });

            preguntar.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3
            }).then(collected => {
                if(collected.first().content.toLowerCase() === "finish" && !finalizado){
                    finalizado = true;
                    return finalizar();

                }
            }).catch(() => {
                return finalizar();
            });

            async function rol(){
                let querol = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                    .setTitle("What Role do you want to use for this emoji?")
                    .setDescription("*Type the ID or mention the role!*")                    
                    .setColor(client.color)
                    ]
                });
                await querol.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const rol = message.guild.roles.cache.get(message.content) || message.mentions.roles.first();
                    if(rol) {
                        parametros.Rol = rol.id;
                        objeto.Parametros.push(parametros);

                        querol.delete().catch(() => {});

                        return emoji();
                    } else {
                        return message.reply(`❌ **The role does not exist!**\nSetup Cancelled! ❌`)
                    }
                }).catch(() => {
                    return finalizar();
                })
            }
        }

        async function finalizar() {
            if(contador === 1 && !objeto.Parametros.length) return message.reply(`❌ **Add at least one emoji with a role!**\nSetup Cancelled! ❌`);
            let msg = await message.reply({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`Specify Channel`)
                .setDescription(`⬇️ Type the channel Id or mention the channel! ⬇️`)
                .setColor(client.color)
                ]
            })
            await msg.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                errors: ["time"],
                time: 180e3,
            }).then(async collected => {
                var message = collected.first();
                var canal = message.guild.channels.cache.get(message.content) || message.mentions.channels.first();
                if(canal) {
                    objeto.ID_CANAL = canal.id

                    var idmensaje = await message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`Specify message`)
                            .setDescription(`⬇️ Type the message ID to add the reactions! ⬇️`)
                            .setColor(client.color)
                        ]
                    });
                    await idmensaje.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        errors: ["time"],
                        time: 180e3,
                    }).then(async collected => {
                        var message = collected.first();
                        const encontrado = await message.guild.channels.cache.get(objeto.ID_CANAL).messages.fetch(message.content);
                        if(encontrado){
                            for(var i = 0; i < objeto.Parametros.length; i++){
                                encontrado.react(objeto.Parametros[i].Emoji).catch(() => {console.log("No se pudo añadir la reaccion")})
                            }
                            objeto.ID_MENSAJE = message.content;
                            let setupdatos = await setupSchema.findOne({guildID: message.guild.id});
                            setupdatos.reaccion_roles.push(objeto);
                            setupdatos.save();
                            return message.reply(`✅ Reaction Roles Setup Created ✅\nYou Can Create another setup with the command: \`${prefix}setup-reactionroles\` `)
                        } else {
                            return message.reply(`❌ **The message you specified was not found!** ❌\nSetup Cancelled!`)
                        }
                    }).catch(() => {
                        return message.reply(`❌ **Your time finished. please type: \`${prefix}setup-reactionroles\` to continue** ❌`)
                    })
                } else {
                    return message.reply(`❌ **The channel you specified was not found!** ❌\nSetup Cancelled!`)
                }
            }).catch(() => {
                return message.reply(`❌ **Your time finished. please type: \`${prefix}setup-reactionroles\` to continue** ❌`)
            })
        }
    }
}