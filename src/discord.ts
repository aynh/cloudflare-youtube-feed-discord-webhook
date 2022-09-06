import {
  youtubeChannelLinkFromChannelId,
  discordUnixTimestamp,
  youtubeVideoLinkFromVideoId,
} from '@/helper'
import {
  FunctionResponse,
  FunctionResponseMap,
  YoutubeFeedDiscordWebhookOptions,
  chunked,
  randomInt,
} from '@/shared'

interface DiscordEmbedFooter {
  text: string
  icon_url?: string
}

interface DiscordEmbedImage {
  url: string
  height?: number
  width?: number
}

interface DiscordEmbedAuthor {
  name: string
  url?: string
  icon_url?: string
}

interface DiscordEmbedField {
  name: string
  value: string
  inline?: boolean
}

export interface DiscordEmbed {
  title?: string
  description?: string
  url?: string
  timestamp?: Date
  color?: number
  footer?: DiscordEmbedFooter
  image?: DiscordEmbedImage
  thumbnail?: DiscordEmbedImage
  author?: DiscordEmbedAuthor
  fields?: DiscordEmbedField[]
}

export interface DiscordWebhookMessage {
  content?: string
  username?: string
  avatar_url?: string
  embeds?: DiscordEmbed[]
}

const discordEmbedFromFunctionResponse = ({
  author,
  avatar,
  channelId,
  published,
  thumbnail,
  title,
  videoId,
}: FunctionResponse): DiscordEmbed => ({
  author: {
    name: author,
    icon_url: avatar,
    url: youtubeChannelLinkFromChannelId(channelId),
  },
  color: randomInt(0, 16_777_215),
  image: { url: thumbnail },
  timestamp: new Date(published),
  title,
  url: youtubeVideoLinkFromVideoId(videoId),
})

const buildDiscordEmbed = (
  item: FunctionResponseMap
): DiscordEmbed | undefined => {
  const { oldValue, value } = item

  const timestampAsDescription = (n?: number) => {
    if (n !== undefined) {
      const timestamp = discordUnixTimestamp(n, 'longDateTime')
      const relativeTimestamp = discordUnixTimestamp(n, 'relativeTime')
      return `**${timestamp} ; ${relativeTimestamp}**`
    }
  }

  const embed = discordEmbedFromFunctionResponse(value)
  if (oldValue === undefined) {
    if (value.isUpcoming) {
      const scheduledAt = value.liveTime?.scheduledStart
      embed.description = timestampAsDescription(scheduledAt)

      embed.footer = { text: 'UPCOMING' }
    } else if (value.liveNow) {
      const startsAt = value.liveTime?.actualStart
      embed.description = timestampAsDescription(startsAt)

      embed.footer = { text: 'LIVE NOW' }
    } else {
      embed.description = timestampAsDescription(value.published)
      embed.footer = { text: 'NEW UPLOAD' }
    }
  } else {
    const newValue = value

    let modified = false
    const descriptions: string[][] = []
    for (const k in oldValue) {
      const key = k as keyof typeof oldValue
      const oldValue_ = oldValue[key]
      const newValue_ = newValue[key]

      switch (key) {
        case 'isUpcoming': {
          if (!newValue_ && oldValue_ && newValue.liveNow) {
            const startsAt = newValue.liveTime?.actualStart
            descriptions.unshift([timestampAsDescription(startsAt)!])

            embed.footer = { text: 'LIVE NOW' }
            modified = true
          }

          break
        }

        case 'title': {
          if (oldValue_ !== newValue_) {
            descriptions.push([
              '**Title**',
              `~~${oldValue_}~~`,
              `**${newValue_}**`,
            ])

            if (embed.footer === undefined) embed.footer = { text: 'UPDATED' }
            modified = true
          }

          break
        }

        default:
          break
      }
    }

    if (!modified) return

    embed.description = descriptions
      .map((description) => description.join('\n'))
      .join('\n')
  }

  return embed
}

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
