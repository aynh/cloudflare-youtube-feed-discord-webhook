import { describe, expect, test } from '@jest/globals'

import type { FunctionResponse } from '~/shared'
import { discordUnixTimestamp } from '../helper'
import { DiscordEmbedBuilder } from './builder'
import {
  transformFresh,
  transformNotFresh,
  defaultTimestamp,
  rangeTimestamp,
} from './transformer'

describe('helpers', () => {
  test('defaultTimestamp', () => {
    const value = 1661176800000

    const absoluteTimestamp = discordUnixTimestamp(value, 'shortDateTime')
    const relativeTimestamp = discordUnixTimestamp(value, 'relativeTime')
    const expected = `**${absoluteTimestamp} | ${relativeTimestamp}**`

    const result = defaultTimestamp(value)
    expect(result).toBe(expected)
  })

  test('rangeTimestamp', () => {
    const to = 1661342981000,
      from = 1661342409000

    const fromAbsoluteTimestamp = discordUnixTimestamp(from, 'shortDateTime')
    const toAbsoluteTimestamp = discordUnixTimestamp(to, 'shortDateTime')
    const expected = `**${fromAbsoluteTimestamp} - ${toAbsoluteTimestamp}**`

    const result = rangeTimestamp(from, to)
    expect(result).toBe(expected)
  })
})

describe('transformFresh transformation', () => {
  test('isUpcoming is true', () => {
    const value: FunctionResponse = {
      videoId: 'Ncxyfw6ncEg',
      avatar:
        'https://yt3.ggpht.com/ytc/AMLnZu8E816PaMNwF8oO2mz9NZuUxca7X8nIlSd2DWKH=s800-c-k-c0x00ffffff-no-rj',
      author: '琥珀ねね / Kohaku Nene',
      channelId: 'UC3uoOH4N2F4T9FyAGDwM6Ow',
      title: 'てすと',
      published: 1661162072000,
      thumbnail: 'https://i.ytimg.com/vi/Ncxyfw6ncEg/maxresdefault_live.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1667901300000,
      },
      isUpcoming: true,
    }

    const builder = new DiscordEmbedBuilder({ value })

    builder.transform(transformFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(builder.body.footer?.text).toBe('UPCOMING')
  })

  test('liveNow is true', () => {
    const value: FunctionResponse = {
      videoId: 'BUQRmz3iJpU',
      avatar:
        'https://yt3.ggpht.com/O7m_5HMY_O8yxR3Jhn9cEO1fLNL_GifMERExnAmfY7JrdTRsTjNijTcNYTPN97Llj3zGn8Susw=s800-c-k-c0x00ffffff-no-rj',
      author: 'Luna Ch. 姫森ルーナ',
      channelId: 'UCa9Y57gfeY0Zro_noHRVrnw',
      title:
        '【 モンハンサンブレイク 】MR70緊急クエストやるのら！(・o・🍬)【姫森ルーナ/ホロライブ】',
      published: 1661172944000,
      thumbnail: 'https://i.ytimg.com/vi/BUQRmz3iJpU/maxresdefault_live.jpg',
      liveNow: true,
      liveTime: {
        actualStart: 1661176807000,
        scheduledStart: 1661176800000,
      },
      isUpcoming: false,
    }

    const builder = new DiscordEmbedBuilder({ value })

    builder.transform(transformFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(builder.body.footer?.text).toBe('LIVE NOW')
  })

  test('isUpcoming and liveNow is false', () => {
    const value: FunctionResponse = {
      videoId: 'ln5z8H8LGYs',
      avatar:
        'https://yt3.ggpht.com/ytc/AMLnZu964JdsIo_bQUYiSok7-4RzPzXz84GL5b9V5k3k=s800-c-k-c0x00ffffff-no-rj-mo',
      author: 'ナナヲアカリ OFFICIAL',
      channelId: 'UCrrNHoXQ1uTYsR6v41pDalQ',
      title: 'ナナヲアカリ ワンマンライブツアー「NNNN」Trailer',
      published: 1661256028000,
      thumbnail: 'https://i.ytimg.com/vi/ln5z8H8LGYs/maxresdefault.jpg',
      liveNow: false,
      isUpcoming: false,
    }

    const builder = new DiscordEmbedBuilder({ value })

    builder.transform(transformFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(builder.body.footer?.text).toBe('NEW UPLOAD')
  })
})

describe('transformNotFresh transformation', () => {
  test('liveNow becomes true from false', () => {
    const oldValue: FunctionResponse = {
      videoId: 'tquGIPXpnEA',
      avatar:
        'https://yt3.ggpht.com/meRnxbRUm5yPSwq8Q5QpI5maFApm5QTGQV_LGblQFsoO0yAV4LI-nSZ70GYwMZ_tbfSa_O8MTCU=s800-c-k-c0x00ffffff-no-rj',
      author: 'Towa Ch. 常闇トワ',
      channelId: 'UC1uv2Oq6kNxgATlCiez59hw',
      title:
        '【member限定】みんなでオフショットとかみていこ～！【常闇トワ/ホロライブ】',
      published: 1661249040000,
      thumbnail: 'https://i.ytimg.com/vi/tquGIPXpnEA/maxresdefault_live.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1661259600000,
      },
      isUpcoming: true,
    }

    const value: FunctionResponse = {
      videoId: 'tquGIPXpnEA',
      avatar:
        'https://yt3.ggpht.com/meRnxbRUm5yPSwq8Q5QpI5maFApm5QTGQV_LGblQFsoO0yAV4LI-nSZ70GYwMZ_tbfSa_O8MTCU=s800-c-k-c0x00ffffff-no-rj',
      author: 'Towa Ch. 常闇トワ',
      channelId: 'UC1uv2Oq6kNxgATlCiez59hw',
      title:
        '【member限定】みんなでオフショットとかみていこ～！【常闇トワ/ホロライブ】',
      published: 1661249040000,
      thumbnail: 'https://i.ytimg.com/vi/tquGIPXpnEA/maxresdefault_live.jpg',
      liveNow: true,
      liveTime: {
        actualStart: 1661260100000,
        scheduledStart: 1661259600000,
      },
      isUpcoming: false,
    }

    const builder = new DiscordEmbedBuilder({ value, oldValue })

    builder.transform(transformNotFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(builder.body.footer?.text).toBe('LIVE NOW')
  })

  test('liveFrom becomes false from true', () => {
    const oldValue: FunctionResponse = {
      videoId: '9xQKU2ardbQ',
      avatar:
        'https://yt3.ggpht.com/ytc/AMLnZu964JdsIo_bQUYiSok7-4RzPzXz84GL5b9V5k3k=s48-c-k-c0x00ffffff-no-rj',
      author: 'ナナヲアカリ OFFICIAL',
      channelId: 'UCrrNHoXQ1uTYsR6v41pDalQ',
      title: '陽傘 / ナナヲアカリ',
      published: 1661342409000,
      thumbnail: 'https://i.ytimg.com/vi/9xQKU2ardbQ/maxresdefault_live.jpg',
      liveNow: true,
      liveTime: {
        scheduledStart: 1661342400000,
      },
      isUpcoming: true,
    }

    const value: FunctionResponse = {
      videoId: '9xQKU2ardbQ',
      avatar:
        'https://yt3.ggpht.com/ytc/AMLnZu964JdsIo_bQUYiSok7-4RzPzXz84GL5b9V5k3k=s48-c-k-c0x00ffffff-no-rj',
      author: 'ナナヲアカリ OFFICIAL',
      channelId: 'UCrrNHoXQ1uTYsR6v41pDalQ',
      title: '陽傘 / ナナヲアカリ',
      published: 1661342409000,
      thumbnail: 'https://i.ytimg.com/vi/9xQKU2ardbQ/maxresdefault.jpg',
      liveNow: false,
      liveTime: {
        actualEnd: 1661342981000,
        actualStart: 1661342409000,
        scheduledStart: 1661342400000,
      },
      isUpcoming: false,
    }

    const builder = new DiscordEmbedBuilder({ value, oldValue })

    builder.transform(transformNotFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(builder.body.footer?.text).toBe('WAS LIVE')
  })

  test('short-lasted premiere', () => {
    const oldValue: FunctionResponse = {
      videoId: '9xQKU2ardbQ',
      avatar:
        'https://yt3.ggpht.com/ytc/AMLnZu964JdsIo_bQUYiSok7-4RzPzXz84GL5b9V5k3k=s48-c-k-c0x00ffffff-no-rj',
      author: 'ナナヲアカリ OFFICIAL',
      channelId: 'UCrrNHoXQ1uTYsR6v41pDalQ',
      title: '陽傘 / ナナヲアカリ',
      published: 1661342409000,
      thumbnail: 'https://i.ytimg.com/vi/9xQKU2ardbQ/maxresdefault_live.jpg',
      liveNow: false,
      liveTime: {
        scheduledStart: 1661342400000,
      },
      isUpcoming: true,
    }

    const value: FunctionResponse = {
      videoId: '9xQKU2ardbQ',
      avatar:
        'https://yt3.ggpht.com/ytc/AMLnZu964JdsIo_bQUYiSok7-4RzPzXz84GL5b9V5k3k=s48-c-k-c0x00ffffff-no-rj',
      author: 'ナナヲアカリ OFFICIAL',
      channelId: 'UCrrNHoXQ1uTYsR6v41pDalQ',
      title: '陽傘 / ナナヲアカリ',
      published: 1661342409000,
      thumbnail: 'https://i.ytimg.com/vi/9xQKU2ardbQ/maxresdefault.jpg',
      liveNow: false,
      liveTime: {
        actualEnd: 1661342981000,
        actualStart: 1661342409000,
        scheduledStart: 1661342400000,
      },
      isUpcoming: false,
    }

    const builder = new DiscordEmbedBuilder({ value, oldValue })

    builder.transform(transformNotFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(builder.body.footer?.text).toBe('WAS LIVE')
  })

  test('updated title', () => {
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
    expect(builder.modified).toBe(true)
    expect(
      builder.body.fields?.find(
        (field) =>
          field.name === 'TITLE' &&
          field.value.includes(value.title) &&
          field.value.includes(oldValue.title)
      )
    ).toBeDefined()
    expect(builder.body.footer?.text).toBe('UPDATED')
  })

  test('updated title + liveNow becomes true', () => {
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
      liveNow: true,
      liveTime: {
        actualStart: 1662553757000,
        scheduledStart: 1662553800000,
      },
      isUpcoming: false,
    }

    const builder = new DiscordEmbedBuilder({ value, oldValue })

    builder.transform(transformNotFresh)
    expect(builder.modified).toBe(true)
    expect(builder.body.description).toBeDefined()
    expect(
      builder.body.fields?.find(
        (field) =>
          field.name === 'TITLE' &&
          field.value.includes(value.title) &&
          field.value.includes(oldValue.title)
      )
    ).toBeDefined()
    expect(builder.body.footer?.text).toBe('LIVE NOW')
  })
})
