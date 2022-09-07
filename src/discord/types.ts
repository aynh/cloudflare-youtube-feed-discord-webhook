export interface DiscordEmbedFooter {
  text: string
  icon_url?: string
}

export interface DiscordEmbedImage {
  url: string
  height?: number
  width?: number
}

export interface DiscordEmbedAuthor {
  name: string
  url?: string
  icon_url?: string
}

export interface DiscordEmbedField {
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
