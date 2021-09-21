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
const getTimeDiffFromTimestamp = (timeString) => {
  const date = new Date(timeString)
  const today = new Date()
  let mins = Math.abs(today - date) / (60 * 1000)
  mins = parseInt(mins)
  if (mins < 60) {
    return `${mins} phút trước`
  } else {
    let hours = Math.abs(today - date) / (60 * 60 * 1000)
    hours = parseInt(hours)
    if (hours < 12) {
      return `${hours} giờ trước`
    } else {
      return (
        ('0' + date.getDate()).slice(-2) +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        date.getFullYear() +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2)
      )
    }
  }
}
export { hhmmssToSeconds, msToTime, getTimeDiffFromTimestamp }
