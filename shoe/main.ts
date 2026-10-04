radio.setGroup(7)
input.setAccelerometerRange(AcceleratorRange.EightG)

// ======  Variables and initial values ======
let STEP_HIGH = 1400    
let STEP_LOW = 1100
let IMPACT = 2200        
let FREEFALL = 500       
let FREEFALL_MS = 80     
let COOLDOWN = 4000     


let steps = 0
let stepArmed = true
let lastStep = 0
let lastFall = -COOLDOWN
let lowSince = 0
// ======  Functions ======
function sendFall() {
    lastFall = input.runningTime()
    radio.sendString("FALL")
    basic.showIcon(IconNames.Sad)
    basic.pause(1500)
    basic.clearScreen()
}

input.onButtonPressed(Button.A, function () {
    sendFall()
})

input.onButtonPressed(Button.B, function () {
    radio.sendString("SOS")
    basic.showIcon(IconNames.Heart)
    basic.pause(1500)
    basic.clearScreen()
})

//continuously send steps count to the receiver
control.inBackground(function () {
    while (true) {
        radio.sendValue("steps", steps)
        basic.pause(1000)
    }
})

basic.showIcon(IconNames.Yes)
basic.pause(1000)
basic.clearScreen()

basic.forever(function () {
    let f = input.acceleration(Dimension.Strength)
    let now = input.runningTime()

  //control the step count based on the acceleration values
    if (f > STEP_HIGH && stepArmed && now - lastStep > 350) {
        steps += 1// increment the step count
        stepArmed = false// disarm the step detection until the acceleration drops below STEP_LOW
        lastStep = now// update the last step time
    }
    if (f < STEP_LOW) {
        stepArmed = true
    }

//detect falls based on the acceleration values
    if (now - lastFall > COOLDOWN) {
        if (f > IMPACT) {
            sendFall()
        } else if (f < FREEFALL) {
            if (lowSince == 0) {
                lowSince = now
            } else if (now - lowSince > FREEFALL_MS) {
                lowSince = 0
                sendFall()
            }
        } else {
            lowSince = 0
        }
    }
    basic.pause(10)
})
