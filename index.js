const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!imp';
const mongoose = require('mongoose');
require('dotenv').config();

// Modules
const postCode = require('./modules/postCode');
const getCode = require('./modules/getCode');
const setApiToken = require('./modules/setApiToken');
const help = require('./modules/help');

// Utilities
const throwError = require('./utils/throwError');

client.on('ready', () => {
  client.user.setActivity('!imp help | https://imperialb.in/', { type: 'PLAYING' });
  console.log('READY');
  mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@discordusers.hy2f3.mongodb.net/users?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err);
    console.log('CONNECTED DATABASE');
  })
})

client.on('message', async msg => {
  if (msg.channel.type == 'dm' && !msg.author.bot) setApiToken(msg, client);
  if (msg.author.bot) return;
  if (msg.content.indexOf(prefix) !== 0) return;
  const command = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g)
    .shift()
    .toLowerCase();
  switch (true) {
    case (command === 'help' || command === 'h'):
      help(msg);
      break;
    case (command === 'paste' || command === 'postcode' || command === 'post'):
      postCode(msg);
      break;
    case (command === 'getcode' || command === 'get' || command === 'code'):
      getCode(msg);
      break;
    case (command === 'setapi' || command === 'setapitoken' || command === 'api' || command === 'setup'):
      setApiToken(msg, client);
      break;
    default:
      throwError(msg, 'Unknown command!')
      break;
  }
})

client.login(process.env.BOT_TOKEN)