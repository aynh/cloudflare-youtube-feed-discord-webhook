import { buildDiscordWebhookMessages, sendDiscordWebhooks } from '~/discord'
import type {
  FunctionResponse,
  FunctionResponseArchive,
  FunctionResponseMap,
  YoutubeFeedDiscordWebhookOptions,
} from '~/types'

export const handle = async (options: YoutubeFeedDiscordWebhookOptions) => {
  // this url is my (currently closed source) `youtube-feed` service
  // I will open source it when I'm confident enough with the codes.
  const url = new URL('https://youtube-feed-fn.netlify.app')
  for (const channel of options.channelIds) {
    // basically it takes multiple `channels` (channel id) search query
    // and it will return the latest 3 videos each of those `channels`, sorted by the published date.
    url.searchParams.append('channels', channel)
  }

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

  // we create an object of the current value (the value we got from my `youtube-feed` service)
  // and the old value (the value from the responses archive in KV store).
  // we will compare them and decide afterwards what (webhook messages) to send.
  const data: FunctionResponseMap[] = filteredResponses.map((value) => ({
    value,
    oldValue: responsesArchive[value.videoId],
  }))

  const webhookMessages = buildDiscordWebhookMessages(data, options)

  // check for emptyness here or else it will unnecessary `put` a new archive
  if (webhookMessages.length > 0) {
    await sendDiscordWebhooks(webhookMessages, options)

    for (const { value } of data) {
      // always replace the old value (from KV store) with new value (from `youtube-feed` service)
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

export * from '~/discord/helper'
export * from '~/shared'

export * from '~/types'
export * from '~/discord/types'
