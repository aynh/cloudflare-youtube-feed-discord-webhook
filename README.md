# Youtube > Cloudflare Workers > Discord Webhook

![npm](https://img.shields.io/npm/v/cloudflare-youtube-feed-discord-webhook?style=for-the-badge) ![npm](https://img.shields.io/npm/dw/cloudflare-youtube-feed-discord-webhook?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/Aynh/cloudflare-youtube-feed-discord-webhook?style=for-the-badge) ![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/Aynh/cloudflare-youtube-feed-discord-webhook/Tests/main?label=tests&style=for-the-badge) ![GitHub last commit](https://img.shields.io/github/last-commit/Aynh/cloudflare-youtube-feed-discord-webhook?style=for-the-badge)

Send a Discord webhook ([demo](#demo)) whenever ~~your oshi~~ a certain channel creates/schedules/modify a video/stream using Cloudflare Workers.

Before proceeding, you need a Cloudflare account ([sign up here](https://dash.cloudflare.com/sign-up)).

## Setup (wrangler)

1. [Install](https://developers.cloudflare.com/workers/wrangler/get-started/#install) and [authenticate](https://developers.cloudflare.com/workers/wrangler/get-started/#authenticate) Wrangler if you haven't.

```bash
# install wrangler
npm install --global wrangler

# authenticate wrangler
wrangler login
```

2. Initialize a module worker.

```bash
# cd my-worker
wrangler init -y
```

3. Create a [KV Namespace](https://developers.cloudflare.com/workers/wrangler/workers-kv/#create-a-kv-namespace-with-wrangler).

KV Namespace is used to store the API responses on successful webhook message, so we won't unnecessarily send a webhook more than once (unless it's modified).

Also add the binding into the `Env` interface. For example if you created a KV Namespace with the name `YOUTUBE_RECORD`, then your `Env` would be:

```typescript
export interface Env {
  YOUTUBE_RECORD: KVNamespace
}
```

4. Install the package.

I'm bad at naming something, please open an issue if you have suggestion.

```bash
npm install cloudflare-youtube-feed-discord-webhook
```

5. Create and await the handle(s).

Put the `handle` in your worker handlers depending on your needs (I recommend scheduled handler), it will send the webhooks whenever the `handle` gets executed. See [Options](#options) for a list of available options.

For example If you use scheduled handler.

```typescript
// src/index.ts
import { handle } from 'cloudflare-youtube-feed-discord-webhook'

export interface Env {
  YOUTUBE_RECORD: KVNamespace
}

export default {
  async scheduled(_, env) {
    await handle({
      channelIds: ['UC-hM6YJuNYVAmUWxeIr9FeA', 'UC54JqsuIbMw_d1Ieb4hjKoQ'],
      store: env.YOUTUBE_RECORD,
      storeKey: 't-key',
      webhookUrl: 'https://discord.com/api/webhooks/~~',
    })
  },
} as ExportedHandler<Env>
```

Multiple `handle` also works, simply create multiple `handle`s and `await` them all.

Don't forget to add [`cron-triggers`](https://developers.cloudflare.com/workers/platform/cron-triggers) to `wrangler.toml` if you use a scheduled handler.

```toml
[triggers]
# executes every 5 minutes
crons = ["*/5 * * * *"]
```

## Options

- `channelIds`\*: Array of Youtube channel's id (e.g. UC-hM6YJuNYVAmUWxeIr9FeA).

- `webhookUrl`\*: Discord Webhook URL, see [Intro to Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

- `store`\*: KV Namespace to store the responses.

- `storeKey`\*: Key to be used to store the responses to `store`. It's recommended to have different `storeKey` between different `handle` to avoid conflicts.

- `discord.webhookAvatar`: Avatar to be used when sending webhooks.

- `discord.webhookUsername`: Username to be used when sending webhooks.

- `hooks`: [Hooks](#hooks).

## Hooks

TBD

## Demo

Here's some demo, yes I'm a [light mode user](https://www.youtube.com/watch?v=7YXPEnHX0po).

![New Upload Demo](demo/new_upload.png 'New Upload Demo')

![Upcoming Demo](demo/upcoming.png 'Upcoming Demo')
