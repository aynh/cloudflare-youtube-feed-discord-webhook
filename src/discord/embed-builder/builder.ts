import { FunctionResponseMap, randomInt } from '../../shared'
import {
  youtubeChannelLinkFromChannelId,
  youtubeVideoLinkFromVideoId,
} from '../helper'
import { DiscordEmbed, DiscordEmbedField } from '../types'
import { transformFresh, transformNotFresh } from './transformer'

export class DiscordEmbedBuilder {
  modified: boolean
  body: DiscordEmbed
  context: FunctionResponseMap

  constructor(context: FunctionResponseMap) {
    const { author, avatar, channelId, published, thumbnail, title, videoId } =
      context.value

    this.body = {
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
    }

    this.context = context
    this.modified = false
  }

  transform(transformer: (builder: DiscordEmbedBuilder) => void) {
    transformer(this)
  }

  getValue<T extends keyof DiscordEmbed>(key: T) {
    return this.body[key]
  }

  setValue<T extends keyof DiscordEmbed>(key: T, value: DiscordEmbed[T]) {
    this.body[key] = value
    this.modified = true
  }

  setValueIf<T extends keyof DiscordEmbed>(
    key: T,
    value: DiscordEmbed[T],
    condition: boolean
  ) {
    if (condition) this.setValue(key, value)
  }

  pushFields(...values: DiscordEmbedField[]) {
    this.modified = true
    if (this.body.fields !== undefined) this.body.fields.push(...values)
    else this.body.fields = values
  }

  unshiftFields(...values: DiscordEmbedField[]) {
    this.modified = true
    if (this.body.fields !== undefined) this.body.fields.unshift(...values)
    else this.body.fields = values
  }
}

export const buildDiscordEmbed = ({ value, oldValue }: FunctionResponseMap) => {
  const builder = new DiscordEmbedBuilder({ value, oldValue })
  builder.transform(oldValue === undefined ? transformFresh : transformNotFresh)

  if (builder.modified) return builder.body
}
