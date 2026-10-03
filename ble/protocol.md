# Kinetiq Radio Protocol

Both micro:bits use built-in radio datagrams on group **42**. No separate radio
module is required. This prototype does not use BLE roles, services, or pairing.
This document remains in the existing `ble/` directory.

## Architecture

```text
Ultrasonic sensor → Shoe micro:bit → Classify distance (0 / 1 / 2)
                 → Built-in radio → Bracelet micro:bit → Vibration / Buzzer
```

The shoe handles sensing/classification. The bracelet only receives states and
produces feedback.

## Packet format

Each packet contains exactly one byte (`0`, `1`, or `2`, not ASCII). The shoe
transmits every 250 ms. The bracelet ignores other lengths and values.

| State | Planned distance (cm) | Display | Vibration (P0) | Buzzer (P1) |
|---|---|---|---|---|
| `0` | Greater than 100 | Clear | OFF | OFF |
| `1` | Greater than 40, up to 100 | `!` | ON | OFF |
| `2` | 40 or less | `X` | ON | ON |

## Initial integration test

1. Build `shoe/ultrasonic/main.cpp` and `watch/microbit/main.cpp` as separate
   C++ firmware projects using a compatible micro:bit `MicroBit.h` runtime.
2. Flash each firmware to its corresponding board and power both boards.
3. After startup labels, the shoe displays `1` and the bracelet displays `!`.
4. Change the sender's temporary state to `0` or `2`, rebuild and flash the shoe,
   and verify the corresponding display and outputs above.

The repository does not yet contain a firmware build configuration.

## Sensor integration

The sender currently transmits fixed test state `1`. Once the ultrasonic sensor
model and trigger/echo wiring are known, replace that assignment with a distance
measurement in centimetres and this classification:

```cpp
uint8_t state;
if (distance > 100)
    state = 0;
else if (distance > 40)
    state = 1;
else
    state = 2;
```

Define invalid-reading/measurement-timeout behavior when adding the sensor.
The receiver currently retains its last valid state if radio packets stop;
this initial test has no connection-loss timeout.

P0 and P1 are control signals. Use a suitable motor driver circuit. The steady
P1 output assumes an active buzzer or driver; a passive buzzer needs a tone.
