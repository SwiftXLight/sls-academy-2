// tg bot username: @my_weather_bucha_bot

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6208887298:AAGTyibd8GL2vPWcjImZLxJCuqkWElnBF8A';
const weatherAPIKey = '8393c3e0b20110fa8df8286528855f7e';

const bot = new TelegramBot(token, { polling: true });

function convertKelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

async function getWeatherForecast(city, interval) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}`;
    const response = await axios.get(url);
    const forecasts = response.data.list;

    let message = `Weather forecast for ${city}:\n\n`;

    switch (interval) {
      case 3:
        message += 'Forecast every 3 hours:\n\n';
        break;
      case 6:
        message += 'Forecast every 6 hours:\n\n';
        break;
      default:
        throw new Error('Invalid interval');
    }

    forecasts.forEach((forecast) => {
      const dateTime = new Date(forecast.dt * 1000);
      const weatherDescription = forecast.weather[0].description;
      const temperature = forecast.main.temp;

      if (interval === 3 || interval === 6) {
        if (dateTime.getHours() % interval === 0) {
          const temperatureCelsius = convertKelvinToCelsius(temperature);
          message += `Date/Time: ${dateTime}\n`;
          message += `Weather: ${weatherDescription}\n`;
          message += `Temperature: ${temperatureCelsius.toFixed(2)}°C\n\n`;
        }
      }
    });

    return message;
  } catch (error) {
    throw new Error('Error fetching weather forecast');
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = 'Welcome to the Weather Forecast Bot!';

  bot.sendMessage(chatId, text, {
    reply_markup: {
      keyboard: [['Forecast in Nice']],
      one_time_keyboard: true,
    },
  });
});

bot.onText(/Forecast in Nice/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      keyboard: [
        [{ text: 'at intervals of 3 hours' }],
        [{ text: 'at intervals of 6 hours' }],
      ],
      one_time_keyboard: true,
    },
  };

  bot.sendMessage(chatId, 'Choose forecast interval:', options);
});

function splitMessage(message, chunkSize) {
  const chunks = [];

  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.substring(i, i + chunkSize));
  }

  return chunks;
}

bot.onText(/at intervals of (\d+) hours/, async (msg, match) => {
  const chatId = msg.chat.id;
  const interval = parseInt(match[1], 10);

  try {
    const forecast = await getWeatherForecast('Bucha', interval);
    const messageChunks = splitMessage(forecast, 4000);

    for (const chunk of messageChunks) {
      await bot.sendMessage(chatId, chunk);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    bot.sendMessage(chatId, 'Error fetching weather forecast');
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const text = 'This bot provides weather forecasts for the city of Bucha. To get started, type /start or use the "Forecast in Nice" command.';

  bot.sendMessage(chatId, text);
});
