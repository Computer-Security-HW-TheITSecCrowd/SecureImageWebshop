# the compiler:
CC = g++
# Standard C++ version:
STANDARD = -std=c++17
# compiler flags:
# -m64                    Compile for 64-bit to take max advantage of address space (important for ASLR; more virtual address space to chose from when randomising layout).
# -fPIE                    Enable ASLR (Required to obtain the full security benefits of ASLR).
# -fstack-protector-all Enable Stack Smashing Protection (the -all is for: to guarantee guards are applied to all functions).
# -DFORTIFY_SOURCE=2    Buffer ovverflow checks. Also adds checks at run-time (detected buffer overflow terminates the program).
# -z noexecstack        Enable NX bit (This option marks the stack non-executable).
CFLAGS = -Wall -m64 -fPIE -fstack-protector-all -DFORTIFY_SOURCE=2 -z noexecstack
# The build target executable:
TARGET = parser

$(TARGET): main.cpp
	$(CC) $(CFLAGS) $(STANDARD) main.cpp -o $(TARGET)

clean:
	rm $(TARGET)
