import { WebhookClient } from 'discord.js';

export const createWebhookClient = (userAgentAppendix: string): WebhookClient => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (typeof webhookUrl !== 'string') {
    throw new Error('Missing webhook URL environment variable');
  }

  return new WebhookClient({ url: webhookUrl }, { rest: { userAgentAppendix } });
};
