const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { config } = require("dotenv");
const { prefix } = require("./cfg.json");
const fs = require("fs");
const path = require("path");
const db = require("./database.js");  // Importowanie pliku bazy danych

// Inicjalizacja dotenv
config({
    path: path.join(__dirname, "/.env")
});

// Tworzenie instancji klienta z odpowiednimi Intents i Partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Kolekcje komend i aliasów
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

// Ładowanie komend z folderu handlers
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// Ładowanie eventów z folderu events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    if (eventName === 'ready') {
        client.once(eventName, (...args) => event(client, ...args, db));
    } else {
        client.on(eventName, (...args) => event(client, ...args, db));
    }
}

// Logowanie bota
client.login(process.env.TOKEN);
