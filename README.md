# SpeedrunComMonitor

Automatically post new verified Speedrun.com runs in a Discord channel of your choice. Not affiliated with Speedrun.com.

This project uses webhooks to save system resources by only pushing data when necessary.

Each run of the script will store the messages it already sent in a PostgreSQL database to prevent duplicate messages.

## Basic usage

1. Copy `.env.example` to `.env` (ignored from version control)
2. Fill out the necessary values
3. `npm ci`
4. `npm run migrate up`
5. `npm run start`

This will list the most recent runs for the (currently hard-coded) game with the relevant data.

## Advanced usage

### Migrations

Database migrations are handled via [node-pg-migrate]

```
$ npm run migrate create migration-name
$ npm run migrate up
$ npm run migrate down
```

[node-pg-migrate]: https://www.npmjs.com/package/node-pg-migrate
