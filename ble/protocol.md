# Kinetiq BLE Protocol

This document defines the communication protocol between the two micro:bits used in Kinetiq.

## Devices

- **Shoe micro:bit**
  - Detects obstacles using the ultrasonic sensor.
  - Sends obstacle status over Bluetooth Low Energy (BLE).

- **Bracelet micro:bit**
  - Receives obstacle status over BLE.
  - Activates the vibration motor or other warning output.

## BLE Roles

- Shoe micro:bit: **BLE Peripheral / Server**
- Bracelet micro:bit: **BLE Central / Client**

## Obstacle Messages

The shoe sends a single integer representing the current obstacle state.

| Value | Meaning |
|---|---|
| `0` | Clear / no obstacle |
| `1` | Obstacle detected |
| `2` | Danger / obstacle very close |

## Example

If the ultrasonic sensor detects an obstacle:

```text
Shoe micro:bit
    |
    | BLE message: 1
    v
Bracelet micro:bit
    |
    v
Vibration ON
```

If the obstacle becomes very close:

```text
BLE message: 2
```

The bracelet should respond with a stronger or faster vibration.

If the path becomes clear:

```text
BLE message: 0
```

The bracelet should stop vibrating.

## Initial Integration Test

Before connecting the ultrasonic sensor and vibration motor, test only the BLE connection.

1. Press Button A on the shoe micro:bit.
2. Shoe micro:bit sends value `1`.
3. Bracelet micro:bit receives value `1`.
4. Bracelet micro:bit displays a check mark on its LED matrix.

Once this works, the sensor and vibration code can be integrated.