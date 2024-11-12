module.exports = client => {
    console.log(`Hi, ${client.user.username} is now online!`);
    client.user.setPresence({
        activities: [{ name: "!!help - Pełna lista komend", type: 3 }],
        status: "online"
    });
};
