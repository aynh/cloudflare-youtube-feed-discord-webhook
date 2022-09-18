import { describe, expect, test } from '@jest/globals'

import { chunked, randomInt } from './shared'

const arr = (n: number) => Array.from({ length: n })

describe('chunked array generation', () => {
  test('chunked 5 of 50 items', () => {
    const result = chunked(arr(50), 5)
    expect(result.length).toBe(10)
    for (const chunk of result) expect(chunk.length).toBe(5)
  })

  test('chunked 30 of 99 items', () => {
    const result = chunked(arr(99), 30)
    expect(result.length).toBe(4)

    const last = result.at(-1)!
    expect(last.length).toBe(9)
    const rest = result.slice(0, -2)
    for (const chunk of rest) expect(chunk.length).toBe(30)
  })
})

test('randomInt random integer generation', () => {
  for (let _ of arr(100)) {
    const result = randomInt(-5, 5)
    expect(result).toBeGreaterThanOrEqual(-5)
    expect(result).toBeLessThanOrEqual(5)

    const noArgumentResult = randomInt()
    expect(noArgumentResult).toBeGreaterThanOrEqual(0)
    expect(noArgumentResult).toBeLessThanOrEqual(1)
  }
})
