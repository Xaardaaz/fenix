const { prefix } = require("../cfg.json");

module.exports = async (client, message, db) => {
    if (message.mentions.has(client.user)) {
        return message.channel.send(`Mój prefix to \`${prefix}\``);
    }
    if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args, db);
};
