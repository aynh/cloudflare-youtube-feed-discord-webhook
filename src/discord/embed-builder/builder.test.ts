import { describe, expect, test } from '@jest/globals'

import type { FunctionResponse } from '@/shared'
import { youtubeChannelLinkFromChannelId } from '../helper'
import { DiscordEmbedBuilder } from './builder'

const value: FunctionResponse = {
  videoId: 'CWjhbVmYrw8',
  avatar:
    'https://yt3.ggpht.com/ytc/AMLnZu-4v9u0XW29ThJHrutfQzTDSun8xJbi_d3HT12New=s48-c-k-c0x00ffffff-no-rj',
  author: 'Okayu Ch. 猫又おかゆ',
  channelId: 'UCvaTdHTWBGv3MKj3KVqJVCw',
  title:
    '【ファイアーエムブレム 蒼炎の軌跡】急にスッと出てくる漆黒さん #12【猫又おかゆ/ホロライブ】',
  published: 1662544770000,
  thumbnail: 'https://i.ytimg.com/vi/CWjhbVmYrw8/maxresdefault_live.jpg',
  liveNow: false,
  liveTime: { scheduledStart: 1662555600000 },
  isUpcoming: true,
}

describe('DiscordEmbedBuilder methods', () => {
  const createBuilder = () => new DiscordEmbedBuilder({ value })

  test('getValue', () => {
    const builder = createBuilder()
    expect(builder.getValue('author')).toStrictEqual({
      name: value.author,
      icon_url: value.avatar,
      url: youtubeChannelLinkFromChannelId(value.channelId),
    })
  })

  test('setValue', () => {
    const builder = createBuilder()
    expect(builder.body.title).toBe(value.title)
    expect(builder.modified).toBe(false)

    builder.setValue('title', 'changed')
    expect(builder.body.title).toBe('changed')
    expect(builder.modified).toBe(true)
  })

  test('setValueIf', () => {
    const builder = createBuilder()
    expect(builder.body.title).toBe(value.title)
    expect(builder.modified).toBe(false)

    builder.setValueIf('title', 'not changed', false)
    expect(builder.body.title).toBe(value.title)
    expect(builder.modified).toBe(false)

    builder.setValueIf('title', 'changed', true)
    expect(builder.body.title).toBe('changed')
    expect(builder.modified).toBe(true)
  })

  test('pushFields', () => {
    const builder = createBuilder()
    expect(builder.modified).toBe(false)

    builder.body.fields = [
      { name: '1', value: '' },
      { name: '2', value: '' },
    ]
    builder.pushFields({ name: '3', value: '' }, { name: '4', value: '' })
    expect(builder.body.fields).toStrictEqual([
      { name: '1', value: '' },
      { name: '2', value: '' },
      { name: '3', value: '' },
      { name: '4', value: '' },
    ])
    expect(builder.modified).toBe(true)
  })

  test('unshiftFields', () => {
    const builder = createBuilder()
    expect(builder.modified).toBe(false)

    builder.body.fields = [
      { name: '1', value: '' },
      { name: '2', value: '' },
    ]
    builder.unshiftFields({ name: '-1', value: '' }, { name: '0', value: '' })
    expect(builder.body.fields).toStrictEqual([
      { name: '-1', value: '' },
      { name: '0', value: '' },
      { name: '1', value: '' },
      { name: '2', value: '' },
    ])
    expect(builder.modified).toBe(true)
  })
})
