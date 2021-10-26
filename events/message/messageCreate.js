module.exports = async (client, message) => {
  const { Permissions } = require("discord.js");
  let available;
  const prefix = "!";
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  const args = message.content
    .slice(prefix.length)
    .split(/ +/)
    .slice(1);
    let commandfile =
    client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    
    if(commandfile) {
      if(message.member.permissions.has(commandfile.permissions) || commandfile.permissions == []) {
        available = 0;
      } else {
        available = 1;
      }
    }

    if(available == 1) {
      return message.channel.send("You do not have permission to use this command.");
    }

    if(available == 0) {
      try {
        commandfile.execute(client, message, args);
      } catch(err) {
        return message.channel.send(`Uh oh. Something went wrong: ${err}`);
      }
    }
    console.log(available)
  }