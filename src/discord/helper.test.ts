import { describe, expect, test } from '@jest/globals'

import {
  discordMention,
  discordUnixTimestamp,
  youtubeChannelLinkFromChannelId,
  youtubeVideoLinkFromVideoId,
} from './helper'

describe('discord helpers', () => {
  test('discordMention', () => {
    const types = ['user', 'channel', 'role'] as const

    const value = 757307928012259419n
    for (const t of types) {
      const result = discordMention(value, t)

      switch (t) {
        case 'channel':
          expect(result).toBe(`<#${value}>`)
          break

        case 'role':
          expect(result).toBe(`<@&${value}>`)
          break

        case 'user':
          expect(result).toBe(`<@${value}>`)
          break

        default:
          throw 'unreachable'
      }
    }
  })

  test('discordUnixTimestamp', () => {
    const styles = [
      'shortTime',
      'longTime',
      'shortDate',
      'longDate',
      'shortDateTime',
      'longDateTime',
      'relativeTime',
      undefined,
    ] as const

    const value = 1662554943000
    const actualValue = value / 1000
    for (const style of styles) {
      const result = discordUnixTimestamp(value, style)

      switch (style) {
        case 'longDate':
          expect(result).toBe(`<t:${actualValue}:D>`)
          break

        case 'longDateTime':
          expect(result).toBe(`<t:${actualValue}:F>`)
          break

        case 'longTime':
          expect(result).toBe(`<t:${actualValue}:T>`)
          break

        case 'relativeTime':
          expect(result).toBe(`<t:${actualValue}:R>`)
          break

        case 'shortDate':
          expect(result).toBe(`<t:${actualValue}:d>`)
          break

        case 'shortDateTime':
        case undefined:
          expect(result).toBe(`<t:${actualValue}:f>`)
          break

        case 'shortTime':
          expect(result).toBe(`<t:${actualValue}:t>`)
          break

        default:
          throw 'unreachable'
      }
    }
  })
})

describe('youtube helpers', () => {
  test('youtubeChannelLinkFromChannelId', () => {
    const id = 'UCdn5BQ06XqgXoAxIhbqw5Rg'

    const expected = `https://youtube.com/channel/${id}`
    expect(youtubeChannelLinkFromChannelId(id)).toBe(expected)
  })

  test('youtubeVideoLinkFromVideoId', () => {
    const id = '8m1Y-brrqds'

    const expected = `https://www.youtube.com/watch?v=${id}`
    expect(youtubeVideoLinkFromVideoId(id)).toBe(expected)
  })
})
