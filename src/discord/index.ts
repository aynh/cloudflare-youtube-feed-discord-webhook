import {
  FunctionResponseMap,
  YoutubeFeedDiscordWebhookOptions,
  chunked,
} from '~/shared'
import { buildDiscordEmbed } from './embed-builder/builder'
import { DiscordWebhookMessage } from './types'

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

  // discord only allows a maximum of 10 embeds/webhook
  return chunked(embeds, 10)
    .map((embeds_) => ({
      avatar_url: options.discord?.webhookAvatar,
      username: options.discord?.webhookUsername,
      embeds: embeds_,
    }))
    .map(
      (message) => options.hooks?.mapDiscordWebhookMessage?.(message) ?? message
    )
}

export const sendDiscordWebhooks = async (
  messages: DiscordWebhookMessage[],
  { webhookUrl }: Pick<YoutubeFeedDiscordWebhookOptions, 'webhookUrl'>
) => {
  for (const message of messages) {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
    })

    if (!response.ok) {
      const text = await response.text()
      throw text
    }
  }
}
