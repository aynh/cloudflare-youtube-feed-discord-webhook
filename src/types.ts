import type { DiscordEmbed, DiscordWebhookMessage } from '~/discord/types'

export interface YoutubeFeedDiscordWebhookOptions {
  /**
   * Array of channel id you wish to get notified to.
   *
   * @example [
   * "UCXTpFs_3PqI41qX2d9tL2Rw", // Shion Ch. 紫咲シオン
   * "UCENwRMx5Yh42zWpzURebzTw", // Laplus ch. ラプラス・ダークネス - holoX -
   * "UC_fYA9QRK-aJnFTgvR_4zug", // ななひら / Nanahira
   * ]
   */
  channelIds: string[]

  /**
   * Discord webhook url(s) to send the webhooks to.
   *
   * @see https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
   * @example
   * - "https://discord.com/api/webhooks/123412347732897802/_abcde123456789-ABCDEFGHIJKLMNOP12345678-abcdefghijklmnopABCDEFGHIJK"
   * - "https://ptb.discord.com/api/webhooks/123412347732897802/_abcde123456789-ABCDEFGHIJKLMNOP12345678-abcdefghijklmnopABCDEFGHIJK"
   * - "https://canary.discord.com/api/webhooks/123412347732897802/_abcde123456789-ABCDEFGHIJKLMNOP12345678-abcdefghijklmnopABCDEFGHIJK"
   */
  webhookUrl: string | string[]

  /**
   * Cloudflare workers KV binding.
   *
   * @see https://developers.cloudflare.com/workers/runtime-apis/kv/#kv-bindings
   * @see https://github.com/cloudflare/workers-types#using-bindings
   */
  store: KVNamespace

  /**
   * Key to be used to store this handle responses archive on KV store.
   * Make sure to use different key for different handles to avoid conflicts.
   *
   * @example
   * - "mykey"
   * - "my another key"
   */
  storeKey: string

  /** Overrides for Discord webhooks configuration. */
  discord?: {
    /** Override Discord webhooks avatar.*/
    webhookAvatar?: string

    /** Override Discord webhooks username.*/
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
  /**
   * The uploader's profile picture (or avatar) url.
   *
   * @example "https://yt3.ggpht.com/Bk1EuS2NcX3dUyHOsnjwimjH3Fh91pN8uJ_Ku-pyhWAd-nXDx8fy7CsK90uVXak3gVNYh87BjQ=s800-c-k-c0x00ffffff-no-rj"
   */
  avatar: string

  /**
   * The uploader's name (or title).
   *
   * @example "みけねこch"
   */
  author: string

  /**
   * The uploader's id.
   *
   * @example "UC54JqsuIbMw_d1Ieb4hjKoQ"
   */
  channelId: string

  /**
   * The video's id.
   *
   * @example "YUXdr9EWwqw"
   */
  videoId: string

  /**
   * The video's thumbnail.
   *
   * @example "https://i.ytimg.com/vi/YUXdr9EWwqw/maxresdefault_live.jpg"
   */
  thumbnail: string

  /**
   * The video's title.
   *
   * @example "てすと配信　あーかいぶなし"
   */
  title: string

  /**
   * The video's uploaded time (miliseconds unix timestamp format).
   *
   * @example 1646569376000
   */
  published: number

  /**
   * Whether it's live (or premiere) currently.
   */
  liveNow: boolean

  /**
   * Whether it's an upcoming live (or premiere) currently.
   */
  isUpcoming: boolean

  /**
   * Live times (start and end).
   */
  liveTime?: {
    /**
     * The live's actual start time (miliseconds unix timestamp format).
     */
    actualStart?: number

    /**
     * The live's scheduled time to begin (miliseconds unix timestamp format).
     */
    scheduledStart?: number

    /**
     * The live's actual end time (miliseconds unix timestamp format).
     */
    actualEnd?: number

    /**
     * The live's scheduled time to end (miliseconds unix timestamp format).
     */
    scheduledEnd?: number
  }
}

export interface FunctionResponseMap {
  value: FunctionResponse
  oldValue?: FunctionResponse
}

export type FunctionResponseArchive = Record<string, FunctionResponse>
