module.exports = {
  aliases: [],
  category: "music",
  permissions: [],
  async execute(client, message, args) {
    const channel = message.member.voice.channel;
    if(!channel) return message.channel.send(`Please join a voice channel first!`);
    if (!args.join(" ")) return message.channel.send(`Please enter a song url or query to search.`);
    
    try {
      client.distube.play(message, args.join(" "))
    } catch (e) {
      message.channel.send(`An error has occured.`)
    }
  }
}