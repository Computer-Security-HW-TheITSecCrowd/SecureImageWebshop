CXX = g++
CPPFLAGS += `pkg-config --cflags protobuf grpc`
CXXFLAGS += -std=c++17 -DSERVER
LDFLAGS += -L/usr/local/lib `pkg-config --libs protobuf grpc++ grpc`\
           -Wl,--no-as-needed -lgrpc++_reflection -Wl,--as-needed\
           -ldl

# compiler flags:
# -m64                  Compile for 64-bit to take max advantage of address space (important for ASLR; more virtual address space to chose from when randomising layout).
# -fPIE                 Enable ASLR (Required to obtain the full security benefits of ASLR).
# -fstack-protector-all Enable Stack Smashing Protection (the -all is for: to guarantee guards are applied to all functions).
# -DFORTIFY_SOURCE=2    Buffer ovverflow checks. Also adds checks at run-time (detected buffer overflow terminates the program).
# -mmitigate-rop        Attempt to compile code without unintended return addresses, making ROP just a little harder.
# -z noexecstack        Enable NX bit (This option marks the stack non-executable).
CFLAGS = -m64 -fPIE -fstack-protector-all -DFORTIFY_SOURCE=2 -z noexecstack -I./include

PROTOC = protoc
GRPC_CPP_PLUGIN = grpc_cpp_plugin
GRPC_CPP_PLUGIN_PATH ?= `which $(GRPC_CPP_PLUGIN)`

PROTOS_PATH = ./protos

vpath %.proto $(PROTOS_PATH)

all: parser_server

parser_server: animation.pb.o animation.grpc.pb.o main.o
	$(CXX) $^ $(LDFLAGS) $(CFLAGS) -o $@

.PRECIOUS: %.grpc.pb.cc
%.grpc.pb.cc: %.proto
	$(PROTOC) -I $(PROTOS_PATH) --grpc_out=. --plugin=protoc-gen-grpc=$(GRPC_CPP_PLUGIN_PATH) $<

.PRECIOUS: %.pb.cc
%.pb.cc: %.proto
	$(PROTOC) -I $(PROTOS_PATH) --cpp_out=. $<

clean:
	rm -f *.o *.pb.cc *.pb.h parser_server
