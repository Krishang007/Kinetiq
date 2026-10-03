# Kinetiq
## storm Hacks

Two micro:bits communicate using built-in radio on group 42. The shoe senses
and classifies obstacles; the bracelet receives states and produces feedback.

- [Shoe sender](shoe/ultrasonic/main.cpp)
- [Bracelet receiver](watch/microbit/main.cpp)
- [Radio protocol and integration test](ble/protocol.md)

The sender currently transmits test state `1` every 250 ms. Ultrasonic sensing
and a firmware build configuration still need to be added.
