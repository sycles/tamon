const { Guild } = require("../../modules/Guild");

module.exports = class {
    async run(client, msg) {
        if (msg.channel.type == 1 | msg.author.bot) { return; };

        const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);
        const guild = await Guild.get(msg.guild);
        if (msg.content.match(mentionRegex)) msg.channel.send(`My prefix is \`${guild.getPrefix()}\`.`);
        const prefix = msg.content.match(mentionRegexPrefix) ? msg.content.match(mentionRegexPrefix)[0] : guild.getPrefix();
        if (!msg.content.startsWith(prefix)) return;
        if(prefix.match(mentionRegexPrefix)) {
            msg.mentions.splice(0,1);
        }

        const options = {
            prefix: guild.getPrefix()
        }

        const [cmd, ...args] = await msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
        if (command) {
            try {
                client.logger.command(`Command ${prefix}${cmd} ran by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`);
                command.run(client, msg, args, options);
            } catch (e) {
                msg.channel.send({
                    embed: {
                        color: client.colors.error,
                        title: `There was an error running ${command}.`,
                        description: `If this error presists please join our discord server [here](https://discord.gg/yJt6kgNmjg).`
                    }
                });
                client.logger.error(`Command ${prefix}${cmd} ran by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\n${e.message}\n${e.stack}`);
            }
        }
    }
}