module.exports = {
  aliases: [],
  category: "admin",
  permissions: ["MANAGE_MESSAGES"],
  execute(client, message, args) {
    message.channel.send(args.join(" "));
  }
}