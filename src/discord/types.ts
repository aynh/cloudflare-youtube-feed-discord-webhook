export interface DiscordEmbedFooter {
  /** Footer text */
  text: string

  /** Url of footer icon */
  icon_url?: string
}

export interface DiscordEmbedImage {
  /** Source url of image */
  url: string

  /** Height of image */
  height?: number

  /** Width of image */
  width?: number
}

export interface DiscordEmbedAuthor {
  /** Name of author */
  name: string

  /** Url of author */
  url?: string

  /** Url of author icon */
  icon_url?: string
}

export interface DiscordEmbedField {
  /** Name of the field */
  name: string

  /** Value of the field */
  value: string

  /** Whether or not this field should display inline */
  inline?: boolean
}

export interface DiscordEmbed {
  /** Title of embed */
  title?: string

  /** Description of embed */
  description?: string

  /** Url of embed */
  url?: string

  /** Timestamp of embed */
  timestamp?: Date

  /** Color code of embed */
  color?: number

  /** Footer information */
  footer?: DiscordEmbedFooter

  /** Image information */
  image?: DiscordEmbedImage

  /** Thumbnail information */
  thumbnail?: DiscordEmbedImage

  /** Author information */
  author?: DiscordEmbedAuthor

  /** Fields information */
  fields?: DiscordEmbedField[]
}

export interface DiscordWebhookMessage {
  /** The message contents (up to 2000 characters) */
  content?: string

  /** Override the default username of the webhook */
  username?: string

  /** Override the default avatar of the webhook */
  avatar_url?: string

  /** Embedded `rich` content (up to 10 embeds) */
  embeds?: DiscordEmbed[]
}
