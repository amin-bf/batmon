import { exec } from 'child_process'
import path from 'path'

console.log('working')

const lowSoundPath = path.join(__dirname, 'low.mp3')
const highSoundPath = path.join(__dirname, 'high.mp3')
let notifyHigh = true
let notifyLow = true
const max = 90
const min = 20

const init = async () => {
  // while (true) {
  setInterval(() => {
    exec(
      'cat /sys/class/power_supply/BAT0/capacity',
      (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          return
        }

        if (stderr) {
          console.log(stderr)
          return
        }

        const percentage = parseInt(stdout.trim())

        if (percentage >= max && notifyHigh) {
          notify(`Battery high: ${percentage}%`, highSoundPath)
        } else if (percentage <= min && notifyLow) {
          notify(`Battery low: ${percentage}%`, lowSoundPath)
        }

        if (percentage >= max) notifyHigh = false
        else if (percentage <= min) notifyLow = false
        else notifyHigh = notifyLow = true

        console.log(percentage, notifyHigh, notifyLow)
      }
    )
  }, 1000)

  // }
}

const notify = (message: string, soundPath: string) => {
  exec(
    `notify-send "Battery Monitor" "${message}" -u critical && play ${soundPath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        return
      }

      if (stderr) {
        console.log(stderr)
        return
      }
    }
  )
}
init()
