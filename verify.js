const TOKEN = 'TOKEN HERE';
const GUILD = 'GUILD ID'; // 
const ROLE = 'ROLE ID'; // 
const VERIFY_MESSAGE = 'I agree to the rules and my token is {token}'; //

const Discord = require('discord.js');
const shortcode = (n) => {
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789';
  let text = '';
  for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`[CLIENT] Ready as ${client.user.username}#${client.user.discriminator} ${client.user.id}`);
});

client.on('guildMemberAdd', (member) => {
  if (member.user.bot || member.guild.id !== GUILD) return;
  const token = shortcode(7);
  console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`);
  member.send(`TOKEN: \`${token}\``);
  member.user.token = token;
});

client.on('message', (message) => {
  if (message.author.bot || message.channel.type !== 'dm' || !message.author.token) return;
  if (message.content !== VERIFY_MESSAGE.replace('{token}', message.author.token)) return;
  message.channel.send('CORRECT!');
  const role = client.guilds.get(GUILD).roles.get(ROLE);
  client.guilds.get(GUILD).member(message.author.id).addRole(role).catch(console.error);
});

client.login(TOKEN);
