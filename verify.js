"use_strict"; // project compiled in nodejs v6.1.0 or higher

const TOKEN = 'TOKEN HERE'; // OAuth2 Bot Token
const GUILD = 'GUILD ID'; // guild ID
const ROLE = 'ROLE ID'; // role to assign once verified
const VERIFY_MESSAGE = 'I agree to the rules and my token is {token}'; // edit this accordingly, leaving {token} 

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
  member.send(`Welcome to the server. To verify your account and agree to our rules, type: **I agree to the rules and my token is** \`${token}\` This will verify your account. Thank you!`);  // edit this line to modify the bot's PM to the user with instructions when they first join
  member.user.token = token;
});

client.on('message', (message) => {
  if (message.author.bot || !message.author.token) return; // reverted requirement that the verify message must be a PM; to change add || message.channel.type !== 'dm'  
  if (message.content !== VERIFY_MESSAGE.replace('{token}', message.author.token)) return;
  message.channel.send('Thank you for verifying your account. Your roles have been updated and you can now view all user channels.'); // edit this to modify what the bot sends to the user when they verify their account 
  const role = client.guilds.get(GUILD).roles.get(ROLE);
  client.guilds.get(GUILD).member(message.author.id).addRole(role).catch(console.error);
});

client.login(TOKEN);
