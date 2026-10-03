#include "MicroBit.h"

MicroBit uBit;

void sendState(uint8_t state)
{
    PacketBuffer packet(1);
    packet[0] = state;
    uBit.radio.datagram.send(packet);
}

int main()
{
    uBit.init();
    uBit.radio.setGroup(42);
    uBit.radio.enable();
    uBit.display.scroll("SHOE");

    while (true)
    {
        // Temporary radio test; replace with ultrasonic sensing/classification.
        uint8_t state = 1;
        sendState(state);
        uBit.display.print(state);
        uBit.sleep(250);
    }

    release_fiber();
}
