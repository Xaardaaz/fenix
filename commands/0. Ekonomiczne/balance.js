const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "balance",
    aliases: ["bal", "saldo"],
    category: "0. Ekonomiczne", // Będziesz mógł uzupełnić
    description: "Wyświetla saldo użytkownika",
    usage: "!balance",

    run: async (client, message, args, db) => {
        const userId = message.author.id;

        // Usunięcie wiadomości użytkownika po 3 sekundach
        setTimeout(() => message.delete().catch(console.error), 3000);

        // Pobieranie salda użytkownika z bazy danych
        db.get(`SELECT balance FROM users WHERE user_id = ?`, [userId], (err, row) => {
            if (err) {
                console.error("Błąd przy pobieraniu salda:", err);
                const errorEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Błąd")
                    .setDescription("Wystąpił błąd przy pobieraniu salda.");
                return message.channel.send({ embeds: [errorEmbed] });
            }

            if (row) {
                const successEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Saldo Użytkownika")
                    .setDescription(`${message.author.username}, Twoje saldo wynosi: ${row.balance} punktów.`);
                message.channel.send({ embeds: [successEmbed] });
            } else {
                // Dodanie użytkownika do bazy danych, jeśli nie istnieje
                db.run(`INSERT INTO users (user_id, balance) VALUES (?, ?)`, [userId, 0], (err) => {
                    if (err) {
                        console.error("Błąd przy dodawaniu użytkownika do bazy:", err);
                        const errorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("Błąd")
                            .setDescription("Wystąpił błąd przy dodawaniu użytkownika do bazy.");
                        return message.channel.send({ embeds: [errorEmbed] });
                    }
                    const successEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("Saldo Użytkownika")
                        .setDescription(`${message.author.username}, Twoje saldo wynosi: 0 punktów.`);
                    message.channel.send({ embeds: [successEmbed] });
                });
            }
        });
    }
};
