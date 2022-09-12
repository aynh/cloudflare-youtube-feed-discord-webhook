import { FunctionResponse } from '~/shared'
import { DiscordEmbedBuilder } from './builder'
import { discordUnixTimestamp } from '../helper'

const timestampDescription = (n?: number) => {
  if (n !== undefined) {
    const timestamp = discordUnixTimestamp(n, 'longDateTime')
    const relativeTimestamp = discordUnixTimestamp(n, 'relativeTime')
    return `**${timestamp} ; ${relativeTimestamp}**`
  }
}

export const transformFresh = (builder: DiscordEmbedBuilder) => {
  const { value } = builder.context

  if (value.isUpcoming) {
    builder.setValue(
      'description',
      timestampDescription(value.liveTime?.scheduledStart)
    )
    builder.setValue('footer', { text: 'UPCOMING' })
  } else if (value.liveNow) {
    builder.setValue(
      'description',
      timestampDescription(value.liveTime?.actualStart)
    )
    builder.setValue('footer', { text: 'LIVE NOW' })
  } else {
    builder.setValue('description', timestampDescription(value.published))
    builder.setValue('footer', { text: 'NEW UPLOAD' })
  }
}

export const transformNotFresh = (builder: DiscordEmbedBuilder) => {
  const { value, oldValue } = builder.context

  if (oldValue !== undefined) {
    const getValues = <T extends keyof FunctionResponse>(key: T) => ({
      current: value[key],
      previous: oldValue[key],
    })

    for (const k in value) {
      const key = k as keyof FunctionResponse

      switch (key) {
        case 'liveNow': {
          const { current, previous } = getValues(key)

          if (current && !previous) {
            builder.setValue(
              'description',
              timestampDescription(value.liveTime?.actualStart)
            )
            builder.setValue('footer', { text: 'LIVE NOW' })
          }

          break
        }

        case 'liveTime': {
          const { current, previous } = getValues(key)

          if (
            previous?.actualStart === undefined &&
            current?.actualStart !== undefined &&
            current?.actualEnd !== undefined
          ) {
            builder.setValue(
              'description',
              timestampDescription(current.actualEnd)
            )
            builder.setValue('footer', { text: 'WAS LIVE' })
          }

          break
        }

        case 'title': {
          const { current, previous } = getValues(key)

          if (previous !== current) {
            builder.pushFields({
              name: key.toUpperCase(),
              value: `~~${previous}~~\n${current}`,
            })
            builder.setValueIf(
              'footer',
              { text: 'UPDATED' },
              builder.body.footer === undefined
            )
          }

          break
        }

        default:
          break
      }
    }
  }
}
