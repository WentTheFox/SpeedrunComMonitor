# SpeedrunComMonitor

Automatically post new verified Speedrun.com runs in a Discord channel of your choice. Not affiliated with Speedrun.com.

This project uses webhooks to save system resources by only pushing data when necessary.

Each run of the script will store the messages it already sent in a PostgreSQL database to prevent duplicate messages.

## Basic usage

1. Copy `.env.example` to `.env` (the latter is ignored from version control intentionally)
2. Fill out the necessary values
    - `DISCORD_WEBHOOK_URL` must be a full webhook URL (see [Intro to Webhooks])
    - `DATABASE_URL` must be a PostgreSQL database connection string (including all necessary connection parameters)
    - `USER_AGENT` is a free-text identifier for all requests going to Speedrun.com (they [ask very nicely] to make it descriptive)
3. `npm ci`
4. `npm run migrate up`
5. Import `setup/seed.sql` (tweak as necessary)
6. `npm run start`

[Intro to Webhooks]: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

[ask very nicely]: https://github.com/speedruncomorg/api?tab=readme-ov-file#basics

This will send the found runs as messages to the provided webhook and save them in the database simultaneously.

It does NOT detect existing messages in the channel. If you clear the DB any existing messages WILL be reposted.

## Advanced usage

### Creating subscriptions

Subscriptions can only be added manually via DB editing at this time. Each subscription needs a `gameId` and it must also have the `active` column set to `true` in order to be checked by the script.

The rest of the fields can be left as their default values. `en-US` is the only `locale` that really makes sense right now, considering the lack of translations and message customizability, but this must be set to make sure time and ordinal number formatting doesn't break.

To find a game's ID, you can use the Speedrun.com API directly. Simply take the url below and substitute `split/second` for the name of the game you want to track:

https://www.speedrun.com/api/v1/games?name=split/second

Open this link in your browser and look for the `"id": "…"` part of the output, in this case `m1zg3360`.

If you want to have convenience scripts for any of this, open an issue to request it.
The tool works for my needs, and I don't want to add stuff that I personally don't need.

### Migrations

Database structure changes are handled via [node-pg-migrate]

```
$ npm run migrate create migration-name
$ npm run migrate up
$ npm run migrate down
```

[node-pg-migrate]: https://www.npmjs.com/package/node-pg-migrate

Migrations should be run after each new migration added to the project to keep the database in sync with the code.

### Persistent process

The project comes with a `pm2.json` file which can be run through [pm2] which will re-run the script every hour by default.

[pm2]: https://www.npmjs.com/package/pm2
