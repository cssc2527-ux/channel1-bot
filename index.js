const { Client, GatewayIntentBits, Events } = require('discord.js');

const N8N_URL = "https://cssc2527.app.n8n.cloud/webhook/661e6a80-839b-44ab-b18b-8ae7c7eee5e6";
const SECRET = "commando"; // change this
const ALLOWED_CHANNEL_ID = "1477565221592633385"; // your #asc channel ID

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channelId !== ALLOWED_CHANNEL_ID) return;

  try {
    const res = await fetch(N8N_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-asc-secret": SECRET
      },
      body: JSON.stringify({
        content: message.content,
        author: message.author.username,
        channelId: message.channelId,
        guildId: message.guildId,
        messageId: message.id,
        timestamp: message.createdTimestamp
      })
    });

    console.log("n8n status:", res.status, "| Sent:", message.content);
  } catch (err) {
    console.error("Failed to send:", err);
  }
});


client.login(process.env.DISCORD_TOKEN);