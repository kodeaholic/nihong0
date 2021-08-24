const hhmmssToSeconds = (timeString) => {
  const hms = timeString // your input string
  const a = hms.split(':') // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
  return seconds
}
const msToTime = (duration) => {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return hours + ':' + minutes + ':' + seconds
}
export { hhmmssToSeconds, msToTime }
