const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Błąd przy tworzeniu bazy danych: ", err.message);
    } else {
        console.log("Połączenie z bazą danych SQLite zostało nawiązane.");
    }
});

// Tworzenie tabel, jeśli nie istnieją
db.run(`CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, balance INTEGER DEFAULT 0)`);
db.run(`CREATE TABLE IF NOT EXISTS warnings (user_id TEXT, warning_count INTEGER DEFAULT 0, UNIQUE(user_id))`);

module.exports = db;
