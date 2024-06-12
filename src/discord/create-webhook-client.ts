import { WebhookClient } from 'discord.js';
import { getEnvVar } from '../utils/get-env-var.js';

export const createWebhookClient = (userAgentAppendix: string): WebhookClient => {
  const webhookUrl = getEnvVar('DISCORD_WEBHOOK_URL');

  return new WebhookClient({ url: webhookUrl }, { rest: { userAgentAppendix } });
};
