import type { FunctionResponse } from '~/shared'
import type { DiscordEmbedBuilder } from './builder'
import { discordUnixTimestamp } from '../helper'

export const defaultTimestamp = (n: number) => {
  const absoluteTimestamp = discordUnixTimestamp(n, 'shortDateTime')
  const relativeTimestamp = discordUnixTimestamp(n, 'relativeTime')
  return `**${absoluteTimestamp} | ${relativeTimestamp}**`
}

export const rangeTimestamp = (from: number, to: number) => {
  const fromAbsoluteTimestamp = discordUnixTimestamp(from, 'shortDateTime')
  const toAbsoluteTimestamp = discordUnixTimestamp(to, 'shortDateTime')
  return `**${fromAbsoluteTimestamp} - ${toAbsoluteTimestamp}**`
}

export const transformFresh = (builder: DiscordEmbedBuilder) => {
  const { value } = builder.context

  if (value.isUpcoming) {
    builder.setValue(
      'description',
      defaultTimestamp(value.liveTime!.scheduledStart!)
    )
    builder.setValue('footer', { text: 'UPCOMING' })
  } else if (value.liveNow) {
    builder.setValue(
      'description',
      defaultTimestamp(value.liveTime!.actualStart!)
    )
    builder.setValue('footer', { text: 'LIVE NOW' })
  } else {
    builder.setValue('description', defaultTimestamp(value.published))
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
              defaultTimestamp(value.liveTime!.actualStart!)
            )
            builder.setValue('footer', { text: 'LIVE NOW' })
          } else if (!current && previous) {
            builder.setValue(
              'description',
              rangeTimestamp(
                value.liveTime!.actualStart!,
                value.liveTime!.actualEnd!
              )
            )
            builder.setValue('footer', { text: 'WAS LIVE' })
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
              rangeTimestamp(current.actualStart, current.actualEnd)
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
