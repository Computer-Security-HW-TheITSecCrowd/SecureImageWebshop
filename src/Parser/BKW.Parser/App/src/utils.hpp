
#ifndef PARSER_UTILS_HPP
#define PARSER_UTILS_HPP

#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <array>
#include <sstream>
#include <tuple>

// UTILS
struct ParsingException : public std::exception {
    explicit ParsingException(const char* message) {
        this->message = message;
    }

    [[nodiscard]] const char* what() const noexcept override {
        return this->message;
    }

private:
    const char* message;
};

std::vector<uint8_t> readFile(const char* filePath) {
    std::ifstream input(filePath, std::ios::binary);
    if (!input) {
        throw std::runtime_error("Could not find the given file!");
    }
    auto buffer = std::vector<uint8_t>((std::istreambuf_iterator<char>(input)), std::istreambuf_iterator<char>());

    input.close();
    return buffer;
}

template<typename T>
std::enable_if_t<std::is_arithmetic_v<T>, T>
convertUint8s(const std::vector<uint8_t>& chars) noexcept {
    T temp = 0;
    for (int i = sizeof(T) - 1; i >= 0; i--) {
        temp <<= 8;
        temp |= (T) chars[i];
    }
    return temp;
}

template<typename T>
std::enable_if_t<std::is_arithmetic_v<T>, T>
parseInteger(const std::vector<uint8_t>& data, size_t& index) {
    size_t size = sizeof(T);

    if (data.size() < size || data.size() - size < index) {
        throw ParsingException("Could not parse integer: Not enough space");
    }

    auto temp = std::vector<uint8_t>();
    std::copy_n(data.begin() + index, size, std::back_inserter(temp));
    index += size;

    return convertUint8s<T>(temp);
}

std::string parseString(const std::vector<uint8_t>& data, size_t length, size_t& index) {
    if (data.size() < length || data.size() - length < index) {
        throw std::logic_error("Could not parse string: Not enough space");
    }

    auto str = std::string();
    std::copy_n(data.begin() + index, length, std::back_inserter(str));
    index += length;

    return str;
}

std::string parseStringUntilChar(const std::vector<uint8_t>& data, size_t& index, char ch) {
    auto chIterator = std::find(data.begin() + index, data.end(), ch);
    if (chIterator == data.cend()) {
        throw ParsingException("Could not parse string: Ending character is not found");
    }
    auto length = std::distance(data.begin() + index, chIterator);

    auto result = parseString(data, length, index);
    index++;
    return result;
}

#endif //PARSER_UTILS_HPP
