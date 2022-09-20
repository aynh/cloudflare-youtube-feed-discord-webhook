export const youtubeChannelLinkFromChannelId = (channelId: string) =>
  `https://youtube.com/channel/${channelId}`

export const youtubeVideoLinkFromVideoId = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`

// https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
const timestampMap = {
  shortTime: 't',
  longTime: 'T',
  shortDate: 'd',
  longDate: 'D',
  shortDateTime: 'f',
  longDateTime: 'F',
  relativeTime: 'R',
}

// https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
export const discordUnixTimestamp = <T extends keyof typeof timestampMap>(
  n: number,
  style?: T
) => `<t:${n / 1000}:${timestampMap[style ?? 'shortDateTime']}>`

// https://discord.com/developers/docs/reference#message-formatting-formats
const mentionMap = {
  channel: '#',
  role: '@&',
  user: '@',
}

// https://discord.com/developers/docs/reference#message-formatting-formats
export const discordMention = <T extends keyof typeof mentionMap>(
  id: number | bigint,
  type: T
) => `<${mentionMap[type]}${id}>`
