const { EmbedBuilder } =require('discord.js');
module.exports = {
    name: "ping",
    aliases: ["ms", "pong", "latency"],
    category: "1.Podstawowe",
    description: "Pozwala sprawdzić ping bota.",
    usage: "[komenda | alias]",
    run: async (client, message, args) => {

        const msg = await message.channel.send('Sprawdzam ping...');

        // Obliczamy latencję
        const latency = Date.now() - message.createdTimestamp; // Poprawione z 'createdTimestap' na 'createdTimestamp'
        const apiLatency = Math.round(client.ws.ping); // Ping do API Discorda

        // Tworzymy embed z losowym kolorem
        const embed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215)) // Losowy kolor w formacie szesnastkowym
            .setTitle('🏓 Pong!')
            .setDescription(`Latency is ${latency}ms\nAPI Latency is ${apiLatency}ms`);

        // Edytujemy wiadomość z embedem
        await msg.edit({ content: null, embeds: [embed] });
},
};
