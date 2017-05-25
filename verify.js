'use_strict'; // tested for node v7.0 or higher

const Discord = require('discord.js');
const config = require('./config.json');

const shortcode = (n) => {
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789';
  let text = '';
  for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const client = new Discord.Client();

client.on('ready', () => {
  client.user.setGame(config.playing);
  console.log(`[VERIFYBOT] Connected as ${client.user.username}#${client.user.discriminator} ${client.user.id}`);
});

client.on('guildMemberAdd', (member) => {
  if (member.user.bot || member.guild.id !== config.guild) return;
  const token = shortcode(9); // we choose a 9 digit token here. can be any integer number. 
  console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`);
  member.send(config.welcomemsg);
  member.user.token = token;
});

client.on('message', (message) => {
  if (message.author.bot || !message.author.token || message.channel.type !== 'dm') return;
  if (message.content !== config.verifymsg.replace('{token}', message.author.token)) return;
  message.channel.send(config.completemsg);
  const role = client.guilds.get(config.guild).roles.get(config.role);
  client.guilds.get(config.guild).member(message.author.id).addRole(role).catch(console.error);
});

client.on('disconnect', () => {
  setTimeout(() => client.destroy().then(() => client.login(config.token)), 15000)
  console.log(`[DISCONNECT] Notice: Disconnected from gateway. Attempting reconnect.`);
});

client.on('error', console.error);
client.on('warn', console.warn);

client.login(config.token);
