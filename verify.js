/**

The following strings can all be edited very easily. 
Specifically, lines 37-45 contains our implementation of the messages.
These are fully flexible and can be edited to whatever you wish to accomplish with the bot. :-)
The use case here is just an example and can act as a boilerplate for some.

**/

'use_strict'; // tested for node v7.0 or higher

const TOKEN = ''; // Bot users only. Your OAuth2 bot token will go here (not client ID). 
const GUILD = '';  // The ID of the guild this bot will be in. Must be the guild ID, not the guild name.
const ROLE = '';  // The role ID that the bot will set upon successful verification below. The role ID must be given, not the role name. 
const VERIFY_MESSAGE = 'I agree to the rules and my token is {token}'; // leave {token} but edit the message accordingly if you wish, this is the string the members must paste to gain access 
const GAME_PLAYING = 'Playing...'; // Edit this to the game you want shown that the bot will have as its playing status

const Discord = require('discord.js');
const shortcode = (n) => {
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789';
  let text = '';
  for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const client = new Discord.Client();

client.on('ready', () => {
  client.user.setGame(GAME_PLAYING);
  console.log(`[VERIFYBOT] Connected as ${client.user.username}#${client.user.discriminator} ${client.user.id}`);
});

client.on('guildMemberAdd', (member) => {
  if (member.user.bot || member.guild.id !== GUILD) return;
  const token = shortcode(9); // we choose a 9 digit token here. can be any integer number. 
  console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`);
  member.send(`Welcome to the server! **PLEASE TAKE A MOMENT TO READ OUR RULES HERE:** [website, rules, etc. can go here] - and once you have read and agree to the policies, send a reply here as a private DM message with the following single line: 
  
  
  I agree to the rules and my token is \`${token}\` 
  
  
  Once you copy and send this private message to me (please ensure the message is exactly as written above as it is case-sensitive), your role will automatically be updated to \`MEMBERS\` (edit this accordingly) and you will be able to view all the rooms & history (you may need to refresh your Discord client). This will be kept as your written verification of your understanding & acceptance of the server rules and ensures a smooth user experience for everybody. 
  
  *This process is fully automatic, but if you need any assistance feel free to please post in the main room.* As a final reminder: your usage of this server is contingent on understanding these rules and also the general Discord Terms of Service/Privacy Policies which are linked on our rules page (edit accordingly). Thank you for your understanding and stopping by :slight_smile: `);
  
  member.user.token = token;
});

client.on('message', (message) => {
  if (message.author.bot || !message.author.token || message.channel.type !== 'dm') return;
  if (message.content !== VERIFY_MESSAGE.replace('{token}', message.author.token)) return;
  message.channel.send('Thank you for accepting the rules and verifying your account. Your account has been automatically assigned the **[ROLE NAME: EDIT ACCORDINGLY]** role, allowing you to view our member rooms and history. Please refresh Discord if you cannot view the history in the main room and everything should appear. Thank you again for taking this brief step to verify your account with (server name - edit accordingly)! We hope you enjoy your time here!');
  const role = client.guilds.get(GUILD).roles.get(ROLE);
  client.guilds.get(GUILD).member(message.author.id).addRole(role).catch(console.error);
});

client.login(TOKEN);
