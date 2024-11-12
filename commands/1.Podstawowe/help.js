const { EmbedBuilder } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "1.Podstawowe",
    description: "Wyświetla listę dostępnych komend lub szczegóły dotyczące konkretnej komendy.",
    usage: "[komenda | alias]",
    run: async (client, message, args) => {
        await message.delete().catch(err => console.error('Nie udało się usunąć wiadomości:', err));
        // Rozpoznawanie prefiksu
        const prefix = '!!'; // Ustaw swój preferowany prefix
        
        // Sprawdzanie, czy wiadomość zaczyna się od prefiksu
        if (!message.content.startsWith(prefix)) return;

        // Obsługa argumentów
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Dostępne komendy')
        .setDescription('Oto lista dostępnych komend:')
        .setTimestamp()
        .setFooter({ text: 'Aby uzyskać więcej informacji o konkretnej komendzie, użyj !!help <nazwa komendy>' });

    // Funkcja do dodawania komend do embedu
    client.categories.forEach(category => {
        const commandsList = client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => ({
                name: `\`${cmd.name}\``, 
                value: cmd.description || 'Brak opisu.',
                inline: false // Ustalamy inline na false, aby opisy były pod nazwami komend
            }));

        if (commandsList.length) {
            embed.addFields({
                name: `**${category[0].toUpperCase() + category.slice(1)}**`,
                value: '\u200B', // Pusty znak, aby mieć odstęp
                inline: false
            });
            embed.addFields(commandsList);
        }
    });

    return message.channel.send({ embeds: [embed] });
}

function getCMD(client, message, input) {
    const embed = new EmbedBuilder();
    
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `Nie znaleziono informacji dla komendy **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send({ embeds: [embed.setColor(0xff0000).setDescription(info)] });
    }

    info = `**Nazwa komendy**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliasy**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Opis**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Użycie**: ${cmd.usage}`;
        embed.setFooter({ text: `Składnia: <> = wymagane, [] = opcjonalne` });
    }

    return message.channel.send({ embeds: [embed.setColor(0x00ff00).setDescription(info)] });
}
