import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Testing response on browser
app.get('/', (req, res) => {
  res.send(`
    <h1>Click Below Link To Continue</h1>
    <a href="https://discord.gg/ZrJrcvZdzk" target="_blank">Join Discord Bot</a>
  `);
});



const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Discord Bot: Listen for interactions
client.on('interactionCreate', interaction => {
  console.log("Interaction received:", interaction);
  interaction.reply('Pong from server....!');
});

client.login(process.env.BOT_TOKEN);



// Function to shorten a URL using the TinyURL API
async function shortenUrl(longUrl) {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error.message);
    return null;
  }
}

// Regular expression to detect a URL
const urlRegex = /(https?:\/\/[^\s]+)/;

// Listen for messages
client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the message contains a URL
  const match = message.content.match(urlRegex);
  const longUrl = match ? match[0] : null;

  if (longUrl) {
    console.log("Extracted URL to shorten:", longUrl); // Debugging

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
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
