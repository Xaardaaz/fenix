module.exports = {
    getMember: function (message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                       member.user.tag.toLowerCase().includes(toFind);
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    },

    formatDate: function (date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    },

    promptMessage: async function (message, author, time, validReactions) {
        // Konwersja czasu do milisekund
        time *= 1000;

        // Dodanie reakcji
        for (const reaction of validReactions) await message.react(reaction);

        // Ustawiamy filtr, aby reakcje były tylko od danego autora
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // Zbieranie reakcji
        const collected = await message.awaitReactions({ filter, max: 1, time: time });

        return collected.first() && collected.first().emoji.name;
    }
};
