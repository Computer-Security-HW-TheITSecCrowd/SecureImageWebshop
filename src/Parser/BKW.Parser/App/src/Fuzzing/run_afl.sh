./AFL/AFL/afl-g++ -std=c++17 ../main.cpp -o parser

echo core | sudo tee -a /proc/sys/kernel/core_pattern

./AFL/AFL/afl-fuzz -i inputs -o out ./parser @@