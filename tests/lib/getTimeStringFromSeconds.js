export default function (secondsRemaining) {
  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining - minutes * 60

  return `${minutes}:${seconds}`
}
