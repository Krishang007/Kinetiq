# Kinetiq Radio Protocol

Kinetiq uses the **built-in micro:bit radio**, not Bluetooth Low Energy (BLE),
for wireless communication between the shoe and bracelet. No separate radio
module is required. The `ble/` folder name is legacy; the protocol is radio.

## Radio configuration

| Setting | Value |
|---|---|
| Transport | Built-in micro:bit radio datagrams |
| Radio group | `42` on both boards |
| Sender | Shoe micro:bit |
| Receiver | Bracelet micro:bit |
| Payload | One byte containing state `0`, `1`, or `2` |
| Send interval | 250 ms |

Both boards configure `uBit.radio.setGroup(42)` and enable the radio with
`uBit.radio.enable()`. The shoe sends with `uBit.radio.datagram.send(packet)`;
the bracelet receives with `uBit.radio.datagram.recv()` when a
`MICROBIT_RADIO_EVT_DATAGRAM` event arrives. No BLE pairing, central/peripheral
roles, or GATT services are used.

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
