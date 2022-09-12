import { buildDiscordWebhookMessages, sendDiscordWebhooks } from '@/discord'
import {
  FunctionResponse,
  FunctionResponseArchive,
  FunctionResponseMap,
  YoutubeFeedDiscordWebhookOptions,
} from '@/shared'

export const handle = async (options: YoutubeFeedDiscordWebhookOptions) => {
  const url = new URL('https://youtube-feed-fn.netlify.app')
  for (const channel of options.channelIds)
    url.searchParams.append('channels', channel)

  const responses = await fetch(url.href).then((raw) => {
    return raw.json<FunctionResponse[]>()
  })

  const filteredResponses = responses.filter(
    (value) => options.hooks?.filterResponse?.(value) ?? true
  )

  const { store, storeKey } = options
  const responsesArchive: FunctionResponseArchive = await store
    .get(storeKey)
    .then((value) => JSON.parse(value ?? '{}'))

  const data: FunctionResponseMap[] = filteredResponses.map((value) => ({
    value,
    oldValue: responsesArchive[value.videoId],
  }))

  const webhookMessages = buildDiscordWebhookMessages(data, options)

  if (webhookMessages.length > 0) {
    await sendDiscordWebhooks(webhookMessages, options)

    for (const { value } of data) {
      responsesArchive[value.videoId] = value
    }

    const archive: FunctionResponseArchive = Object.fromEntries(
      Object.entries(responsesArchive).filter(
        ([_, value]) => options.hooks?.filterResponseArchive?.(value) ?? true
      )
    )
    await store.put(storeKey, JSON.stringify(archive))
  }
}

export * from '@/discord/helper'
export * from '@/shared'
