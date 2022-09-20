import { chunked } from '~/shared'
import type {
  FunctionResponseMap,
  YoutubeFeedDiscordWebhookOptions,
} from '~/types'
import { buildDiscordEmbed } from './embed-builder/builder'
import type { DiscordWebhookMessage } from './types'

export const buildDiscordWebhookMessages = (
  data: FunctionResponseMap[],
  options: Pick<YoutubeFeedDiscordWebhookOptions, 'discord' | 'hooks'>
): DiscordWebhookMessage[] => {
  const embeds = data
    .map((it) => [buildDiscordEmbed(it), it] as const)
    .filter(([embed]) => embed !== undefined)
    .map(
      ([embed, it]) => options.hooks?.mapDiscordEmbed?.(embed!, it) ?? embed!
    )

  // discord only allows a maximum of 10 embeds/webhook message
  // so we split them into a chunk of 10 embeds
  return chunked(embeds, 10)
    .map((embedsChunk) => ({
      avatar_url: options.discord?.webhookAvatar,
      username: options.discord?.webhookUsername,
      embeds: embedsChunk,
    }))
    .map(
      (message) => options.hooks?.mapDiscordWebhookMessage?.(message) ?? message
    )
}

export const sendDiscordWebhooks = async (
  messages: DiscordWebhookMessage[],
  { webhookUrl }: Pick<YoutubeFeedDiscordWebhookOptions, 'webhookUrl'>
) => {
  const urls = Array.isArray(webhookUrl) ? webhookUrl : [webhookUrl]

  for (const message of messages) {
    for (const url of urls) {
      const response = await fetch(url, {
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        method: 'POST',
      })

      if (!response.ok) {
        const text = await response.text()
        throw `Error (${response.status}) while sending webhook to ${url}: ${text}`
      }
    }
  }
}
