const { Client, Collection, Intents } = require("discord.js");
const fs = require("fs");
const DisTube = require("distube");
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.commands = new Collection();
client.distube = new DisTube.default(client, {
	searchSongs: 1,
	searchCooldown: 30,
	leaveOnEmpty: true,
	emptyCooldown: 0,
	leaveOnFinish: true,
	leaveOnStop: true,
	plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
})

client.on("ready", () => {
  console.log("Hello World!");
  console.log(client.commands)
});

  const eventFolders = fs.readdirSync("./events");
  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(`./events/${folder}`)
      .filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
      const event = require(`./events/${folder}/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    }
  }

  const cmdFolders = fs.readdirSync("./commands");
  for(const folder of cmdFolders) {
    const cmdFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of cmdFiles) {
      const cmd = require(`./commands/${folder}/${file}`);
      let cmdName = file.split(".")[0];
      client.commands.set(cmdName, cmd);
    }
  }

const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
    .on("playSong", (queue, song) => queue.textChannel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (queue, song) => queue.textChannel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("addList", (queue, playlist) => queue.textChannel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (queue, result) => {
        let i = 0;
        queue.textChannel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (queue) => queue.textChannel.send(`Searching canceled`))
    .on("error", (channel, e) => {
        console.error(e)
        channel.send("An error encountered: " + e);
    });

client.login("ODc1MDg1ODI3NjQ5MjAwMTQ4.YRQZLw.4BoSEzSuLJkJ4sPqZIEevzXq2MM");