import { DiscordEmbed, DiscordWebhookMessage } from '~/discord/types'

export interface YoutubeFeedDiscordWebhookOptions {
  channelIds: string[]
  webhookUrl: string
  store: KVNamespace
  storeKey: string
  discord?: {
    webhookAvatar?: string
    webhookUsername?: string
  }
  hooks?: {
    filterResponse?: (response: FunctionResponse) => boolean
    filterResponseArchive?: (response: FunctionResponse) => boolean
    mapDiscordEmbed?: (
      embed: DiscordEmbed,
      { value, oldValue }: FunctionResponseMap
    ) => DiscordEmbed
    mapDiscordWebhookMessage?: (
      message: DiscordWebhookMessage
    ) => DiscordWebhookMessage
  }
}

export interface FunctionResponse {
  avatar: string
  author: string
  channelId: string
  videoId: string
  thumbnail: string
  title: string
  published: number
  liveNow: boolean
  isUpcoming: boolean
  liveTime?: {
    actualStart?: number
    scheduledStart?: number
    actualEnd?: number
    scheduledEnd?: number
  }
}

export interface FunctionResponseMap {
  value: FunctionResponse
  oldValue?: FunctionResponse
}

export type FunctionResponseArchive = Record<string, FunctionResponse>

export const chunked = <T>(array: T[], step: number) => {
  const chunks: T[][] = []
  for (let index = 0; index < array.length; index += step) {
    chunks.push(array.slice(index, index + step))
  }

  return chunks
}

export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}
