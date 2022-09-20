import type { FunctionResponse } from '~/types'
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
    // it's an upcoming live or premiere.
    builder.setValue(
      'description',
      defaultTimestamp(value.liveTime!.scheduledStart!)
    )
    builder.setValue('footer', { text: 'UPCOMING' })
  } else if (value.liveNow) {
    // it's live or premiere now.
    builder.setValue(
      'description',
      defaultTimestamp(value.liveTime!.actualStart!)
    )
    builder.setValue('footer', { text: 'LIVE NOW' })
  } else {
    // it's just a normal video upload.
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
            // it was an upcoming live but it's live now.
            builder.setValue(
              'description',
              // liveTime.actualStart is guaranteed to be defined
              // if liveNow is or was true
              defaultTimestamp(value.liveTime!.actualStart!)
            )
            builder.setValue('footer', { text: 'LIVE NOW' })
          } else if (!current && previous) {
            // it was live before but it ends now.
            builder.setValue(
              'description',
              rangeTimestamp(
                // both of these is guaranteed to be defined
                // if liveNow was true and it becomes false.
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
            // checks for short-lasted live or premiere
            // if actualStart was undefined and actualEnd is defined
            // on this check that means it was live for a short period.
            previous?.actualStart === undefined &&
            current?.actualEnd !== undefined
          ) {
            builder.setValue(
              'description',
              // actualStart is guaranteed to be defined
              // if actualEnd is defined.
              rangeTimestamp(current.actualStart!, current.actualEnd)
            )
            builder.setValue('footer', { text: 'WAS LIVE' })
          }

          break
        }

        case 'title': {
          const { current, previous } = getValues(key)

          if (previous !== current) {
            // check for string equality
            builder.pushFields({
              name: key.toUpperCase(),
              // show the old (previous) value as strikethrough text
              // and show the new (current) value as normal text.
              // ~~ here is a markdown syntax for strikethrough text.
              value: `~~${previous}~~\n${current}`,
            })
            builder.setValueIf(
              'footer',
              { text: 'UPDATED' },
              // only change the footer text if it's undefined
              // this footer (UPDATED) takes the lowest priority.
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
