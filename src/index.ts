import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import { SpeedrunComApiClient } from './speedrun-com-api/speedrun-com-api-client.js';
import { Subscription } from './entity/subscription.entity.js';
import { createWebhookClient } from './discord/create-webhook-client.js';
import { fetchRuns } from './utils/fetch-runs.js';
import { Message } from './entity/message.entity.js';
import { formatRunMessage } from './utils/format-run-message.js';
import { In } from 'typeorm';
import { createAppDataSource } from './data-source.js';

dotenvConfig();

const userAgent = process.env.USER_AGENT || 'SpeedrunComMonitor';
const apiClient = new SpeedrunComApiClient(userAgent);
const webhookClient = createWebhookClient(userAgent);
const AppDataSource = createAppDataSource();

const localeSort = (a: string, b: string) => a.localeCompare(b);

AppDataSource.initialize().then(async () => {
  console.log('Loading subscriptions…');
  const subscriptions = await AppDataSource.manager.findBy(Subscription, { active: true });
  console.log(`Found ${subscriptions.length} subscription(s)`);

  for (const sub of subscriptions) {
    console.log(`Started processing subscription ${sub.id}.`);
    console.log(`Fetching runs for game ${sub.gameId}…`);
    const runData = await fetchRuns(apiClient, sub.gameId);
    console.log(`Fetched ${runData.length} run(s) successfully.`);
    const runIdsSet = new Set(runData.map(run => run.runId));
    const uniqueRunIdsArray = Array.from(runIdsSet);
    console.log(`Received run IDs: ${uniqueRunIdsArray.sort(localeSort).join(', ')}`);

    console.log(`Looking for existing messages with matching run IDs…`);
    const existingMessages = await AppDataSource.manager.find(Message, {
      where: { runId: In(uniqueRunIdsArray), subscriptionId: sub.id },
      select: ['runId'],
    });
    const runIdsWithMessageSet = new Set(existingMessages.map(message => message.runId));
    console.log(`Messages found in DB with run IDs: ${Array.from(runIdsWithMessageSet).sort(localeSort).join(', ')}`);

    const newRunData = runData.filter(run => !runIdsWithMessageSet.has(run.runId)).sort((a, b) => a.verifiedAt - b.verifiedAt);
    if (newRunData.length === 0) {
      console.log(`No new run IDs to process.`);
    } else {
      const newRunIds = newRunData.map(run => run.runId);
      console.log(`New run IDs to process: ${newRunIds.join(', ')}`);
      for (const run of newRunData) {
        await AppDataSource.manager.transaction(async () => {
          console.log(`Sending message for run ${run.runId} to webhook…`);
          const content = formatRunMessage(run, sub.locale);
          const sentMessage = await webhookClient.send({ content });

          console.log(`Message ${sentMessage.id} sent successfully, persisting in database…`);
          const messageRecord = new Message();
          messageRecord.id = sentMessage.id;
          messageRecord.runId = run.runId;
          messageRecord.subscriptionId = sub.id;
          await AppDataSource.manager.save(messageRecord);

          console.log(`Message ${sentMessage.id} persisted successfully.`);
        });
      }
    }

    console.log(`Finished processing subscription ${sub.id}.`);
  }

  // Force exit even if we have rate limits remaining
  process.exit(0);
}).catch(error => console.log(error));
