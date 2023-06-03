#!/usr/bin/env node

// tg bot username: @trepalochka_bot

const { program } = require('commander');
const TelegramBot = require('node-telegram-bot-api');

const token = '6134744575:AAEDGWG0KtTacURAut6WB1Osk-qjvOOt9ZU';

const bot = new TelegramBot(token, { polling: true });

program
  .command('send-message <message>')
  .alias('m')
  .description('Send a message to the Telegram bot')
  .action((message) => {
    bot.sendMessage('482370327', message)
      .then(() => {
        console.log('Message sent successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error sending message:', error.message);
        process.exit(1);
      });
  });

program
  .command('send-photo <path>')
  .alias('p')
  .description('Send a photo to the Telegram bot')
  .action((path) => {
    bot.sendPhoto('482370327', path)
      .then(() => {
        console.log('Photo sent successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error sending photo:', error.message);
        process.exit(1);
      });
  });

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ node index.js send-message "Hello, Telegram!"');
  console.log('  $ node index.js send-photo "/path/to/the/photo.png"');
});
  
program.parse(process.argv);
