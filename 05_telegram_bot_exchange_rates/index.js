// tg bot username: @my_exchangeCurrency_bot

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require('node-cache');

const token = '5682973553:AAErfbNfvpFHyojvoUO1zPy13Xz_v1Ch0A4';

const bot = new TelegramBot(token, { polling: true });
const cache = new NodeCache({ stdTTL: 60 });

async function getPrivatBankExchangeRate() {
  const cacheKey = 'privatBankExchangeRate';
  let exchangeRate = cache.get(cacheKey);

  if (!exchangeRate) {
    const url = `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`;
    const response = await axios.get(url);
    exchangeRate = response.data.filter(item => item.ccy === 'USD' || item.ccy === 'EUR');
    cache.set(cacheKey, exchangeRate);
  }

  return exchangeRate;
}

async function getMonobankExchangeRate() {
  const cacheKey = 'monobankExchangeRate';
  let exchangeRate = cache.get(cacheKey);

  if (!exchangeRate) {
    const url = `https://api.monobank.ua/bank/currency`;
    const response = await axios.get(url);
    exchangeRate = response.data.filter(item => item.currencyCodeA === 840 || item.currencyCodeA === 978);
    cache.set(cacheKey, exchangeRate);
  }

  return exchangeRate;
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = 'Welcome to the Exchange Rate Bot!';

  bot.sendMessage(chatId, text, {
    reply_markup: {
      keyboard: [['USD Exchange Rate'], ['EUR Exchange Rate']],
      one_time_keyboard: true,
    },
  });
});

bot.onText(/USD Exchange Rate/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const privatBankExchangeRate = await getPrivatBankExchangeRate();
    const monobankExchangeRate = await getMonobankExchangeRate();

    const usdPrivatBankRate = privatBankExchangeRate.find(item => item.ccy === 'USD');
    const usdMonobankRate = monobankExchangeRate.find(item => item.currencyCodeA === 840);

    const privatBankBuyRate = parseFloat(usdPrivatBankRate.buy).toFixed(2);
    const privatBankSaleRate = parseFloat(usdPrivatBankRate.sale).toFixed(2);

    const monobankBuyRate = parseFloat(usdMonobankRate.rateBuy).toFixed(2);
    const monobankSaleRate = parseFloat(usdMonobankRate.rateSell).toFixed(2);

    const privatBankMessage = `PrivatBank USD Exchange Rate:\n\nBuy: ${privatBankBuyRate}\nSale: ${privatBankSaleRate}`;
    const monobankMessage = `Monobank USD Exchange Rate:\n\nBuy: ${monobankBuyRate}\nSale: ${monobankSaleRate}`;

    bot.sendMessage(chatId, privatBankMessage);
    bot.sendMessage(chatId, monobankMessage);
  } catch (error) {
    bot.sendMessage(chatId, 'Error fetching exchange rate');
  }
});

bot.onText(/EUR Exchange Rate/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const privatBankExchangeRate = await getPrivatBankExchangeRate();
    const monobankExchangeRate = await getMonobankExchangeRate();

    const eurPrivatBankRate = privatBankExchangeRate.find(item => item.ccy === 'EUR');
    const eurMonobankRate = monobankExchangeRate.find(item => item.currencyCodeA === 978);

    const privatBankBuyRate = parseFloat(eurPrivatBankRate.buy).toFixed(2);
    const privatBankSaleRate = parseFloat(eurPrivatBankRate.sale).toFixed(2);

    const monobankBuyRate = parseFloat(eurMonobankRate.rateBuy).toFixed(2);
    const monobankSaleRate = parseFloat(eurMonobankRate.rateSell).toFixed(2);

    const privatBankMessage = `PrivatBank EUR Exchange Rate:\n\nBuy: ${privatBankBuyRate}\nSale: ${privatBankSaleRate}`;
    const monobankMessage = `Monobank EUR Exchange Rate:\n\nBuy: ${monobankBuyRate}\nSale: ${monobankSaleRate}`;

    bot.sendMessage(chatId, privatBankMessage);
    bot.sendMessage(chatId, monobankMessage);
  } catch (error) {
    bot.sendMessage(chatId, 'Error fetching exchange rate');
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const text = 'This bot provides exchange rates for USD and EUR. To get started, type /start or use the respective command.';

  bot.sendMessage(chatId, text);
});
