module.exports = {
  aliases: [],
  category: "music",
  permissions: [],  
  async execute(client, message, args) {
    const Genius = require("genius-lyrics");
    const Client = new Genius.Client("xENKV8kc6JXwBxUTJnGdtQ72hBS3xVpOZIRx6HBbowyRZCKA5aM3BMxoiXxVg-e6");
    const { MessageEmbed } = require('discord.js');

    if(args.join(" ") == "") {
      return message.channel.send("That is not a valid song.");
    }

    const searches = await Client.songs.search(args.join(" "));
    const firstSong = searches[0];
    const title = await firstSong.title;
    const lyrics = await firstSong.lyrics();
    const embed = new MessageEmbed()
    .setTitle(`${title}`)
    .setDescription(`${lyrics}`)

    if(lyrics.length >= 6000) {
      return message.channel.send("There are too many lyrics for me to send. Please try a different song.")
    } else {
      message.channel.send({embeds: [embed]});
    }
    console.log(lyrics);
  }
}