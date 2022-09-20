export const chunked = <T>(array: T[], step: number) => {
  const chunks: T[][] = []
  for (let index = 0; index < array.length; index += step) {
    chunks.push(array.slice(index, index + step))
  }

  return chunks
}

export const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b))
  const upper = Math.floor(Math.max(a, b))
  return Math.floor(lower + Math.random() * (upper - lower + 1))
}
