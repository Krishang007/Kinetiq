# Kinetiq

## StormHacks 2026

Kinetiq is a wearable fall-alert prototype designed to help caregivers stay connected to younger siblings, parents, grandparents, or others they care for.

The system uses **two BBC micro:bits** communicating wirelessly through their built-in radio.

## How It Works

The system consists of two devices:

### Shoe

The shoe micro:bit uses its built-in accelerometer to monitor the wearer's movement.

It can:

- Detect high-impact movements associated with potential falls
- Detect sustained low acceleration associated with free fall
- Count steps
- Send a manual SOS alert
- Send status and step-count updates to the bracelet

When a potential fall is detected, the shoe sends a `FALL` message wirelessly to the bracelet.

### Bracelet

The bracelet micro:bit acts as the caregiver's receiving device.

It can:

- Receive `FALL` alerts
- Receive `SOS` alerts
- Activate vibration feedback
- Produce an audible alert
- Display the wearer's step count
- Detect when communication with the shoe has been lost
- Silence an active alarm

## System Architecture

    Wearer's Movement
           |
           v
    Shoe micro:bit
    Built-in Accelerometer
           |
           v
    Fall Detection
           |
           v
    micro:bit Radio
           |
           v
    Bracelet micro:bit
           |
           v
    Vibration + Audible Alert
           |
           v
    Caregiver Notification

## Wireless Communication

Both micro:bits communicate using the built-in micro:bit radio on **group 7**.

The shoe sends:

- `FALL` - Potential fall detected
- `SOS` - Manual emergency alert
- `steps` - Current step count and heartbeat/status update

The bracelet listens for these messages and provides the appropriate feedback.

## Technology

Both micro:bits were programmed in **TypeScript using Microsoft MakeCode**.

Kinetiq uses:

- BBC micro:bit
- TypeScript
- Microsoft MakeCode
- Built-in accelerometer
- Built-in micro:bit radio
- Vibration motor
- Haptic feedback

## Repository

The repository contains the TypeScript code used in our StormHacks prototype.

    Kinetiq/
    ├── README.md
    ├── shoe/
    │   └── main.ts
    └── bracelet/
        └── main.ts

- `shoe/main.ts` - Fall detection, step counting, SOS, and radio transmission
- `bracelet/main.ts` - Radio reception, alerts, vibration, and connection monitoring

## Prototype Status

Kinetiq was developed as a proof of concept during **StormHacks 2026**.

The current prototype demonstrates accelerometer-based potential fall detection and wireless communication between the wearable and caregiver device.

