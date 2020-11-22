# the compiler:
CC = g++

# Standard C++ version:
STANDARD = -std=c++17

# compiler flags:
# -m64                    Compile for 64-bit to take max advantage of address space (important for ASLR; more virtual address space to chose from when randomising layout).
# -fPIE                    Enable ASLR (Required to obtain the full security benefits of ASLR).
# -fstack-protector-all Enable Stack Smashing Protection (the -all is for: to guarantee guards are applied to all functions).
# -DFORTIFY_SOURCE=2    Buffer ovverflow checks. Also adds checks at run-time (detected buffer overflow terminates the program).
# -mmitigate-rop        Attempt to compile code without unintended return addresses, making ROP just a little harder.
# -z noexecstack        Enable NX bit (This option marks the stack non-executable).
CFLAGS = -m64 -fPIE -fstack-protector-all -DFORTIFY_SOURCE=2 -z noexecstack -I./include

# The build target executable:
TARGET = parser

# $(wildcard *.cpp /xxx/xxx/*.cpp): get all .cpp files from the current directory and dir "/xxx/xxx/"
SRCS := $(wildcard *.cpp)

# $(patsubst %.cpp,%.o,$(SRCS)): substitute all ".cpp" file name strings to ".o" file name strings
OBJS := $(patsubst %.cpp,%.o,$(SRCS))

%.o: %.cpp
	$(CC) $(STANDARD) $(CFLAGS) -c $<

all: $(TARGET)
$(TARGET): $(OBJS)
	$(CC) -o $@ $^

clean:
	rm -rf $(TARGET) *.o