import { describe, expect, test } from '@jest/globals'

import type { FunctionResponse } from '~/types'
import { youtubeChannelLinkFromChannelId } from '../helper'
import { buildDiscordEmbed, DiscordEmbedBuilder } from './builder'
import { transformFresh, transformNotFresh } from './transformer'

describe('DiscordEmbedBuilder methods', () => {
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

  test('getValue', () => {
    const builder = new DiscordEmbedBuilder({ value })
    expect(builder.getValue('author')).toStrictEqual({
      name: value.author,
      icon_url: value.avatar,
      url: youtubeChannelLinkFromChannelId(value.channelId),
    })
  })

  test('setValue', () => {
    const builder = new DiscordEmbedBuilder({ value })
    expect(builder.body.title).toBe(value.title)
    expect(builder.modified).toBe(false)

    builder.setValue('title', 'changed')
    expect(builder.body.title).toBe('changed')
    expect(builder.modified).toBe(true)
  })

  test('setValueIf', () => {
    const builder = new DiscordEmbedBuilder({ value })
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
    const builder = new DiscordEmbedBuilder({ value })
    expect(builder.modified).toBe(false)

    builder.pushFields({ name: '1', value: '' }, { name: '2', value: '' })
    expect(builder.body.fields).toStrictEqual([
      { name: '1', value: '' },
      { name: '2', value: '' },
    ])
    expect(builder.modified).toBe(true)

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
    const builder = new DiscordEmbedBuilder({ value })
    expect(builder.modified).toBe(false)

    builder.unshiftFields({ name: '1', value: '' }, { name: '2', value: '' })
    expect(builder.body.fields).toStrictEqual([
      { name: '1', value: '' },
      { name: '2', value: '' },
    ])
    expect(builder.modified).toBe(true)

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

describe('buildDiscordEmbed behavior', () => {
  test('same value and oldValue', () => {
    const value: FunctionResponse = {
      videoId: '8m1Y-brrqds',
      avatar:
        'https://yt3.ggpht.com/roGS60A8a_lDbVakIg1JU3u3hbtjHSTilMGHMizuPKh7tuoY2nl46raxuW2f_83IKFGMjL6Z=s48-c-k-c0x00ffffff-no-rj',
      author: 'Laplus ch. ラプラス・ダークネス - holoX -',
      channelId: 'UCENwRMx5Yh42zWpzURebzTw',
      title:
        '【JUMP KING】おしとやかにJUMP KING耐久│おしとやかじゃなくなったら即終了！【ラプラス・ダークネス/ホロライブ】',
      published: 1662554943000,
      thumbnail: 'https://i.ytimg.com/vi/8m1Y-brrqds/hqdefault.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1662553800000,
      },
      isUpcoming: true,
    }

    expect(buildDiscordEmbed({ value, oldValue: value })).toBeUndefined()
  })

  test('without oldValue', () => {
    const value = {
      videoId: '8m1Y-brrqds',
      avatar:
        'https://yt3.ggpht.com/roGS60A8a_lDbVakIg1JU3u3hbtjHSTilMGHMizuPKh7tuoY2nl46raxuW2f_83IKFGMjL6Z=s48-c-k-c0x00ffffff-no-rj',
      author: 'Laplus ch. ラプラス・ダークネス - holoX -',
      channelId: 'UCENwRMx5Yh42zWpzURebzTw',
      title:
        '【JUMP KING】おしとやかにJUMP KING耐久│おしとやかじゃなくなったら即終了！【ラプラス・ダークネス/ホロライブ】',
      published: 1662554943000,
      thumbnail: 'https://i.ytimg.com/vi/8m1Y-brrqds/hqdefault.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1662553800000,
      },
      isUpcoming: true,
    }

    const builder = new DiscordEmbedBuilder({ value })
    builder.transform(transformFresh)

    const result = buildDiscordEmbed({ value })
    builder.setValue('color', result?.color)

    expect(result).toStrictEqual(builder.body)
  })

  test('with oldValue', () => {
    const oldValue: FunctionResponse = {
      videoId: '8m1Y-brrqds',
      avatar:
        'https://yt3.ggpht.com/roGS60A8a_lDbVakIg1JU3u3hbtjHSTilMGHMizuPKh7tuoY2nl46raxuW2f_83IKFGMjL6Z=s48-c-k-c0x00ffffff-no-rj',
      author: 'Laplus ch. ラプラス・ダークネス - holoX -',
      channelId: 'UCENwRMx5Yh42zWpzURebzTw',
      title:
        '【JUMP KING】おしとやかにJUMP KING耐久│おしとやかじゃなくなったら即終了！【ラプラス・ダークネス/ホロライブ】',
      published: 1662554943000,
      thumbnail: 'https://i.ytimg.com/vi/8m1Y-brrqds/hqdefault.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1662553800000,
      },
      isUpcoming: true,
    }

    const value: FunctionResponse = {
      videoId: '8m1Y-brrqds',
      avatar:
        'https://yt3.ggpht.com/roGS60A8a_lDbVakIg1JU3u3hbtjHSTilMGHMizuPKh7tuoY2nl46raxuW2f_83IKFGMjL6Z=s48-c-k-c0x00ffffff-no-rj',
      author: 'Laplus ch. ラプラス・ダークネス - holoX -',
      channelId: 'UCENwRMx5Yh42zWpzURebzTw',
      title:
        '【JUMP KING】おしとやかに頂点を目指します💜│おしとやかじゃなくなったら即終了！【ラプラス・ダークネス/ホロライブ】',
      published: 1662554943000,
      thumbnail: 'https://i.ytimg.com/vi/8m1Y-brrqds/hqdefault.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1662553800000,
      },
      isUpcoming: true,
    }

    const builder = new DiscordEmbedBuilder({ value, oldValue })
    builder.transform(transformNotFresh)

    const result = buildDiscordEmbed({ value, oldValue })
    builder.setValue('color', result?.color)

    expect(result).toStrictEqual(builder.body)
  })
})
