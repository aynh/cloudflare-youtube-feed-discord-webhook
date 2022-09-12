export const youtubeChannelLinkFromChannelId = (channelId: string) =>
  `https://youtube.com/channel/${channelId}`

export const youtubeVideoLinkFromVideoId = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`

const timestampMap = {
  shortTime: 't',
  longTime: 'T',
  shortDate: 'd',
  longDate: 'D',
  shortDateTime: 'f',
  longDateTime: 'F',
  relativeTime: 'R',
}

export const discordUnixTimestamp = <T extends keyof typeof timestampMap>(
  n: number,
  style?: T
) => `<t:${n / 1000}:${timestampMap[style ?? 'shortDateTime']}>`

const mentionMap = {
  user: '@',
  channel: '#',
  role: '@&',
}

export const discordMention = <T extends keyof typeof mentionMap>(
  id: number,
  type: T
) => `<${mentionMap[type]}${id}>`
