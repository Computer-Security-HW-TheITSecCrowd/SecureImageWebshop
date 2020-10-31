#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <type_traits>

using std::cout;
using std::endl;

std::vector<uint8_t> readFile(const char* filePath) {
    std::ifstream input(filePath, std::ios::binary);
    if (!input) {
        std::cout << "Could not find the given file!" << endl;
    }
    std::vector<uint8_t> buffer(
            (std::istreambuf_iterator<char>(input)), std::istreambuf_iterator<char>() /* {} */);

    input.close();
    return buffer;
}

using byte = char;

struct Tlv {
    byte type;
    uint64_t length;
    std::vector<unsigned char> value;
};

uint64_t charsToUint64(std::vector<uint8_t>& chars) {
    uint64_t temp = 0;
    for(int i = 7; i >= 0; i--)
    {
        temp <<= 8;
        temp |= (uint64_t)chars[i];
    }
    return temp;
}

template<typename T>
typename std::enable_if<std::is_arithmetic<T>::value, T>::type
convertChars(const std::vector<uint8_t>& chars)
{
    T temp = 0;
    for(int i = sizeof(T) - 1; i >= 0; i--)
    {
        temp <<= 8;
        temp |= (T)chars[i];
    }
    return temp;
}

Tlv parseTlv(std::vector<uint8_t>& content, int& startIndex) {
    int index = startIndex;

    Tlv tlv;
    tlv.type = content[index];
    index++;

    std::vector<uint8_t> length;
    std::copy_n(content.begin() + index, 8, std::back_inserter(length));
    tlv.length = charsToUint64(length);
    index += 8;

    std::copy_n(content.begin() + index, tlv.length, std::back_inserter(tlv.value));
    index += tlv.length;

    startIndex = index;

    return tlv;
}

struct Header {
    std::string magic;
    uint64_t length;
    uint64_t numberOfAnimations;
};

Header parseHeader(std::vector<uint8_t>& data) {
    Header header;
    int index = 0;

    int magicLength = 4;
    std::string magic;
    std::copy_n(data.begin(), magicLength, std::back_inserter(magic));
    index += magicLength;
    header.magic = magic;

    std::vector<uint8_t> length;
    std::copy_n(data.begin() + index, sizeof(header.length), std::back_inserter(length));
    header.length = charsToUint64(length);
    index += sizeof(header.length);

    std::vector<uint8_t> numberOfAnimations;
    std::copy_n(data.begin() + index, sizeof(header.numberOfAnimations), std::back_inserter(numberOfAnimations));
    header.numberOfAnimations = charsToUint64(numberOfAnimations);
    index += sizeof(header.numberOfAnimations);

    return header;
}

struct DateTime {
    uint16_t year;
    uint8_t month;
    uint8_t day;
    uint8_t hour;
    uint8_t minute;
};

struct Creator {
    uint64_t length;
    std::string name;
};

struct Credits {
    DateTime creationDateTime;
    Creator creator;
};

DateTime parseDateTime(std::vector<uint8_t>& data) {
    int index = 0;
    DateTime dateTime{};

    std::vector<uint8_t> year;
    std::copy_n(data.begin() + index, 2, std::back_inserter(year));
    dateTime.year = convertChars<uint16_t>(year);
    index += 2;

    dateTime.month = data[index++];
    dateTime.day = data[index++];
    dateTime.hour = data[index++];
    dateTime.minute = data[index++];

    return dateTime;
}

Creator parseCreator(std::vector<uint8_t>& data) {
    Creator creator;
    int index = 0;

    std::vector<uint8_t> length;
    std::copy_n(data.begin() + index, 8, std::back_inserter(length));
    creator.length = convertChars<uint64_t>(length);
    index += 8;

    std::copy_n(data.begin() + index, creator.length, std::back_inserter(creator.name));

    return creator;
}

Credits parseCredits(std::vector<uint8_t>& data, int blockLength) {
    Credits credits;
    int index = 0;

    std::vector<uint8_t> dateTime;
    std::copy_n(data.begin(), 6, std::back_inserter(dateTime));
    credits.creationDateTime = parseDateTime(dateTime);
    index += 6;

    std::vector<uint8_t> creator;
    std::copy_n(data.begin() + index, blockLength - index, std::back_inserter(creator));
    credits.creator = parseCreator(creator);

    return credits;
}

struct Pixel {
    uint8_t r;
    uint8_t g;
    uint8_t b;
};

struct Image {
    std::string magic;
    uint64_t headerSize;
    uint64_t contentSize;
    uint64_t width;
    uint64_t height;
    std::string caption;
    std::vector<std::string> tags;
    std::vector<Pixel> pixels;
};

template<typename T>
typename std::enable_if<std::is_arithmetic<T>::value, T>::type
parseInteger(const std::vector<uint8_t>& data, int& index)
{
    int size = sizeof(T);

    std::vector<uint8_t> temp;
    std::copy_n(data.begin() + index, size, std::back_inserter(temp));
    index += size;

    return convertChars<T>(temp);
}

std::string parseString(const std::vector<uint8_t>& data, int length, int& index) {
    std::string str;
    std::copy_n(data.begin() + index, length, std::back_inserter(str));
    index += length;

    return str;
}

std::string parseStringUntilChar(const std::vector<uint8_t>& data, int& index, char ch) {
    int length = 0;
    int i = index;
    while (data[i++] != ch)
        length++;

    auto result = parseString(data, length, index);
    index++;
    return result;
}

Pixel parsePixel(std::vector<uint8_t>& data, int& index) {
    Pixel pixel;

    pixel.r = parseInteger<uint8_t>(data, index);
    pixel.g = parseInteger<uint8_t>(data, index);
    pixel.b = parseInteger<uint8_t>(data, index);

    return pixel;
}

Image parseImage(std::vector<uint8_t>& data) {
    Image image;
    int index = 0;

    image.magic = parseString(data, 4, index);
    image.headerSize = parseInteger<uint64_t>(data, index);
    image.contentSize = parseInteger<uint64_t>(data, index);
    image.width = parseInteger<uint64_t>(data, index);
    image.height = parseInteger<uint64_t>(data, index);
    image.caption = parseStringUntilChar(data, index, '\n');

    int tagsLength = image.headerSize - (4 + 8 + 8 + 8 + 8 + image.caption.length() + 1);
    int remaining = tagsLength;
    while (remaining > 0) {
        auto tag = parseStringUntilChar(data, index, '\0');
        if (tag.length() > remaining) {
            break; // ToDo error, reset index
        }
        image.tags.push_back(tag);
        remaining -= tag.length() + 1;
    }

    for (int i = 0; i < image.contentSize / 3; i++) {
        image.pixels.push_back(parsePixel(data, index));
    }

    return image;
}

struct AnimationImage {
    uint64_t duration;
    Image image;
};

AnimationImage parseAnimationImage(std::vector<uint8_t>& data, int length) {
    AnimationImage animation;

    std::vector<uint8_t> duration;
    std::copy_n(data.begin(), 8, std::back_inserter(duration));
    animation.duration = convertChars<uint64_t>(duration);

    std::vector<uint8_t> image;
    std::copy_n(data.begin() + 8, length - 8, std::back_inserter(image));
    animation.image = parseImage(image);

    return animation;
};

void writeImage(const Image& image) {
    std::ofstream out("./image.txt");
    out << "[";
    for (int i = 0; i < image.height; i++) {
        out << "[";
        for (int j = 0; j < image.width; j++) {
            auto pixel = image.pixels[i * image.width + j];
            out << "[" << (int)pixel.r << ", " << (int)pixel.g << ", " << (int)pixel.b  << "]";
            if (j != image.width - 1) {
                out << ", ";
            }
        }
        out << "]";
        if (i != image.height - 1) {
            out << ", ";
        }
    }
    out << "]";

    out.close();
}

int main() {
    auto content = readFile("./test_files/1.caff");
    cout << content.size() << endl;

    int index = 0;
    auto headerTlv = parseTlv(content, index);
    auto header = parseHeader(headerTlv.value);

    auto creditsTlv = parseTlv(content, index);
    auto credits = parseCredits(creditsTlv.value, creditsTlv.length);

    auto animationTlv = parseTlv(content, index);
    auto animation = parseAnimationImage(animationTlv.value, animationTlv.length);

    writeImage(animation.image);

    switch (content[0]) {
        case 0x1:
            cout << "header" << endl;
            break;
        case 0x2:
            cout << "credits" << endl;
            break;
        case 0x3:
            cout << "animation" << endl;
            break;
    }

    return 0;
}