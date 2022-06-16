const {DisTube, Song} = require('distube')
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DiscordAPIError } = require('discord.js');

module.exports = (client, Discord) => {
    console.log(`Modulo de musica cargado!`.red)

    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        searchSongs: 0,
        nsfw: false,
        emptyCooldown: 25,
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 64,
        },
        youtubeDL: false,
        plugins: [
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,
            }),
            new SoundCloudPlugin()

        ],
    });

    //escuchamos los eventos del distube xDxD

    client.distube.on("playSong", (queue, song) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`Playing: \`${song.name}\` - \`${song.formattedDuration}\`!`)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)
            .setColor("#0040ff")
            .setFooter({text: `Added By: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({dynamic: true})})

            ]
        })
    })

    client.distube.on("addSong", (queue, song) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`✅ Added: \`${song.name}\` - \`${song.formattedDuration}\``)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)
            .setColor("#0040ff")
            .setFooter({text: `Added By: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({dynamic: true})})

            ]
        })
    })

    client.distube.on("initQueue", (queue) => {
        queue.autoplay = true;
    })
};