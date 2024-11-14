export function phpSerializeAndEncode(data) {
  function phpSerialize(obj) {
    let serialized = ''
    const type = typeof obj

    if (obj === null) {
      return 'N;'
    }

    if (Array.isArray(obj)) {
      serialized += `a:${obj.length}:{`
      obj.forEach((value, index) => {
        serialized += phpSerialize(index) + phpSerialize(value)
      })
      serialized += '}'
    } else if (type === 'object') {
      const keys = Object.keys(obj)
      serialized += `a:${keys.length}:{`
      keys.forEach((key) => {
        serialized += phpSerialize(key) + phpSerialize(obj[key])
      })
      serialized += '}'
    } else if (type === 'number') {
      serialized += Number.isInteger(obj) ? `i:${obj};` : `d:${obj};`
    } else if (type === 'string') {
      serialized += `s:${obj.length}:"${obj}";`
    } else if (type === 'boolean') {
      serialized += `b:${obj ? 1 : 0};`
    }

    return serialized
  }

  const serializedData = phpSerialize(data)
  const base64 = btoa(serializedData) // Base64 encode
  console.log({ base64 })
  return encodeURIComponent(base64)
}