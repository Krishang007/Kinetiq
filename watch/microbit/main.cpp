#include "MicroBit.h"

MicroBit uBit;

void handleState(uint8_t state)
{
    switch (state)
    {
        case 0:
            uBit.display.clear();
            uBit.io.P0.setDigitalValue(0); // Vibration OFF
            uBit.io.P1.setDigitalValue(0); // Buzzer OFF
            break;
        case 1:
            uBit.display.print("!");
            uBit.io.P0.setDigitalValue(1); // Vibration ON
            uBit.io.P1.setDigitalValue(0); // Buzzer OFF
            break;
        case 2:
            uBit.display.print("X");
            uBit.io.P0.setDigitalValue(1); // Vibration ON
            uBit.io.P1.setDigitalValue(1); // Buzzer ON
            break;
        default:
            break;
    }
}

void onRadioPacket(MicroBitEvent)
{
    PacketBuffer packet = uBit.radio.datagram.recv();
    if (packet.length() == 1 && packet[0] <= 2)
    {
        handleState(packet[0]);
    }
}

int main()
{
    uBit.init();
    uBit.io.P0.setDigitalValue(0);
    uBit.io.P1.setDigitalValue(0);
    uBit.display.scroll("WATCH");

    uBit.radio.setGroup(42);
    uBit.messageBus.listen(
        MICROBIT_ID_RADIO,
        MICROBIT_RADIO_EVT_DATAGRAM,
        onRadioPacket
    );
    uBit.radio.enable();

    release_fiber();
}
