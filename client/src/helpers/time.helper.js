const hhmmssToSeconds = (timeString) => {
  const hms = timeString // your input string
  const a = hms.split(':') // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
  return seconds
}

export { hhmmssToSeconds }
