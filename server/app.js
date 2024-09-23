import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
import cors from 'cors';

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Function to shorten the URL using TinyURL API
async function shortenUrl(longUrl) {
  try {
    console.log("Making request to TinyURL with:", longUrl); // Debugging
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    console.log("TinyURL Response:", response.data); // Debugging
    return response.data; // This will be the shortened URL
  } catch (error) {
    console.error('Error shortening URL:', error.message); // Show detailed error message
    return null;
  }
}

// Regular expression to detect a URL
const urlRegex = /(https?:\/\/[^\s]+)/;

// Listen for messages
client.on("messageCreate", async (message) => {
  console.log("Received message:", message.content); // Log the message content for debugging
  
  if (message.author.bot) {
    console.log("Message is from a bot, ignoring."); // Log when a bot message is ignored
    return; // Ignore bot messages
  }

  if (message.content.startsWith('!shorten')) {
    console.log("Shorten command detected."); // Log that the shorten command was detected

    // Extract URL using regex
    const match = message.content.match(urlRegex);
    const longUrl = match ? match[0] : null;  // Get the first match if found

    console.log("Extracted URL to shorten:", longUrl); // Debugging

    // Validate if URL was found
    if (!longUrl) {
      message.reply({ content: 'Please provide a valid URL after the !shorten command.' });
      return;
    }

    // Try shortening the URL
    const shortUrl = await shortenUrl(longUrl);

    if (shortUrl) {
      message.reply({
        content: `Here's your shortened URL: ${shortUrl}`
      });
    } else {
      message.reply({
        content: 'Failed to shorten the URL. Please try again later.'
      });
    }
  } else {
    // Log that the message didn't match the shorten command
    console.log("Message does not match !shorten command.");
    message.reply({
      content: "Hello, from bot"
    });
  }
});

client.on('interactionCreate', interaction => {
  console.log("Interaction received:", interaction); // Log interactions
  interaction.reply('Pongg...!');
});

client.login(process.env.BOT_TOKEN);

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
