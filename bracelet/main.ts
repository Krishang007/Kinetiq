radio.setGroup(7)
music.setVolume(255)

// ====== Variables and initial values ======
let LOST_MS = 6000       // time without receiving a signal from the shoe before alerting (ms)
// =====================

let lastBeat = input.runningTime()
let silenced = false
let farAlerted = false
let pending = ""
let lastSteps = 0

function alarm(icon: IconNames, times: number) {
    silenced = false
    basic.showIcon(icon)
    for (let i = 0; i < times && !silenced; i++) {
        pins.digitalWritePin(DigitalPin.P1, 1)   // motor ON
        music.playTone(988, 300)                  // time (300 ms)
        pins.digitalWritePin(DigitalPin.P1, 0)   // motor OFF
        basic.pause(200)
    }
    pins.digitalWritePin(DigitalPin.P1, 0)
    basic.clearScreen()
}

radio.onReceivedString(function (msg) {
    lastBeat = input.runningTime()
    if (msg == "FALL" || msg == "SOS") {
        pending = msg
    }
})

radio.onReceivedValue(function (name, value) {
    if (name == "steps") {
        lastBeat = input.runningTime()
        lastSteps = value
        farAlerted = false
    }
})

// A = silence the alarm
// B = show the last step count
input.onButtonPressed(Button.A, function () {
    silenced = true
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(lastSteps)
    basic.clearScreen()
})

basic.showIcon(IconNames.Yes)
basic.pause(1000)
basic.clearScreen()

basic.forever(function () {
    if (pending != "") {
        let p = pending
        pending = ""
        if (p == "FALL") {
            alarm(IconNames.No, 8)
        } else {
            alarm(IconNames.Heart, 8)
        }
    }
    // If the shoe has not sent a signal for LOST_MS milliseconds, alert the user
    if (input.runningTime() - lastBeat > LOST_MS && !farAlerted) {
        farAlerted = true
        alarm(IconNames.Ghost, 5)
    }
    basic.pause(100)
})
