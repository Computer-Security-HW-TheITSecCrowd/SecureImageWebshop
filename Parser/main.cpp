#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <type_traits>
#include <array>
#include <sstream>

using std::cout;
using std::endl;

// UTILS
struct ParsingException : public std::exception
{
    ParsingException(const char* message) {
        this->message = message;
    }

    const char * what () const throw ()
    {
        return this->message;
    }

private:
    const char* message;
};

std::vector<uint8_t> readFile(const char* filePath) {
    std::ifstream input(filePath, std::ios::binary);
    if (!input) {
        throw ParsingException("Could not find the given file!");
    }
    std::vector<uint8_t> buffer(
            (std::istreambuf_iterator<char>(input)), std::istreambuf_iterator<char>() /* {} */);

    input.close();
    return buffer;
}

template<typename T>
typename std::enable_if<std::is_arithmetic<T>::value, T>::type
convertUint8s(const std::vector<uint8_t>& chars)
{
    T temp = 0;
    for(int i = sizeof(T) - 1; i >= 0; i--)
    {
        temp <<= 8;
        temp |= (T)chars[i];
    }
    return temp;
}

template<typename T>
typename std::enable_if<std::is_arithmetic<T>::value, T>::type
parseInteger(const std::vector<uint8_t>& data, int& index)
{
    int size = sizeof(T);

    if (data.size() - size < index) {
        throw ParsingException("Could not parse integer: Not enough space");
    }

    std::vector<uint8_t> temp;
    std::copy_n(data.begin() + index, size, std::back_inserter(temp));
    index += size;

    return convertUint8s<T>(temp);
}

std::string parseString(const std::vector<uint8_t>& data, int length, int& index) {
    if (data.size() - length < index) {
        throw ParsingException("Could not parse string: Not enough space");
    }

    std::string str;
    std::copy_n(data.begin() + index, length, std::back_inserter(str));
    index += length;

    return str;
}

std::string parseStringUntilChar(const std::vector<uint8_t>& data, int& index, char ch) {
    int length = 0;
    int i = index;
    if (data.size() < i) {
        throw ParsingException("Could not parse string: Not enough space");
    }

    while (data[i++] != ch)
    {
        length++;

        if (data.size() < i) {
            throw ParsingException("Could not parse string: Not enough space");
        }
    }


    auto result = parseString(data, length, index);
    index++;
    return result;
}

// TLV

enum class TlvType : uint8_t {
    Header = 0x1,
    Credits = 0x2,
    Animation = 0x3,
};

constexpr auto tlvTypes = std::array<TlvType, 3>{ TlvType::Header, TlvType::Credits, TlvType::Animation };
auto isTlvType(uint8_t n) -> bool {
    return std::find(std::begin(tlvTypes), std::end(tlvTypes), (TlvType)n) != std::end(tlvTypes);
}

struct Tlv {
    TlvType type = TlvType::Header;
    uint64_t length = 0;
    std::vector<uint8_t> value;

    static Tlv parse(const std::vector<uint8_t>& content, int& startIndex) {
        int index = startIndex;

        Tlv result;

        // Type
        if (!isEnoughSpace(content, index, sizeof(result.type))) {
            throw ParsingException("Not enough space");
        }

        auto type = content[index];
        if (!isTlvType(type)) {
            throw ParsingException("The given TLV identifier is not valid");
        }
        result.type = static_cast<TlvType>(type);
        index++;

        // Length
        if (!isEnoughSpace(content, index, sizeof(result.length))) {
            throw ParsingException("Not enough space");
        }
        result.length = parseInteger<uint64_t>(content, index);

        // Value
        if (!isEnoughSpace(content, index, result.length)) {
            throw ParsingException("Not enough space");
        }

        std::copy_n(content.begin() + index, result.length, std::back_inserter(result.value));
        index += result.length;

        startIndex = index;
        return result;
    }

    private:

    static bool isEnoughSpace(const std::vector<uint8_t>& content, int currentIndex, int requiredSpace) {
        return content.size() - currentIndex >= requiredSpace;
    }
};

// Blocks

struct Header {
    std::string magic;
    uint64_t length = 0;
    uint64_t numberOfAnimations = 0;

    static Header parse(const Tlv& tlv) {
        int magicLength = 4;
        if (tlv.length != magicLength + sizeof(length) + sizeof(numberOfAnimations)) {
            throw ParsingException("The TLV's length is not equal to the header's size");
        }

        Header header;
        int index = 0;

        header.magic = parseString(tlv.value, magicLength, index);
        header.length = parseInteger<uint64_t>(tlv.value, index);
        header.numberOfAnimations = parseInteger<uint64_t>(tlv.value, index);

        // Validation
        if (tlv.length != header.length) {
            throw ParsingException("Header.length is not equal to the TLV's length");
        }
        if (header.magic != "CAFF") {
            throw ParsingException("The header's magic is not equal to \"CAFF\"");
        }

        return header;
    }
};

struct DateTime {
    uint16_t year = 0;
    uint8_t month = 0;
    uint8_t day = 0;
    uint8_t hour = 0;
    uint8_t minute = 0;

    static DateTime parse(const std::vector<uint8_t>& data) {
        int index = 0;
        DateTime dateTime;

        dateTime.year = parseInteger<uint16_t>(data, index);
        dateTime.month = parseInteger<uint8_t>(data, index);
        dateTime.day = parseInteger<uint8_t>(data, index);
        dateTime.hour = parseInteger<uint8_t>(data, index);
        dateTime.minute = parseInteger<uint8_t>(data, index);

        return dateTime;
    }
};

struct Creator {
    uint64_t length = 0;
    std::string name;

    static Creator parse(const std::vector<uint8_t>& data) {
        Creator creator;
        int index = 0;

        creator.length = parseInteger<uint64_t>(data, index);
        creator.name = parseString(data, creator.length, index);

        return creator;
    }
};

struct Credits {
    DateTime creationDateTime;
    Creator creator;

    static Credits parse(const Tlv& tlv) {
        Credits credits;

        int datetimeLength = 6;
        credits.creationDateTime = DateTime::parse(tlv.value);

        std::vector<uint8_t> creator;
        std::copy_n(tlv.value.begin() + datetimeLength, tlv.length - datetimeLength, std::back_inserter(creator));
        credits.creator = Creator::parse(creator);

        return credits;
    }
};

struct Pixel {
    uint8_t r = 0;
    uint8_t g = 0;
    uint8_t b = 0;

    static Pixel parse(const std::vector<uint8_t>& data, int& index) {
        Pixel pixel;

        pixel.r = parseInteger<uint8_t>(data, index);
        pixel.g = parseInteger<uint8_t>(data, index);
        pixel.b = parseInteger<uint8_t>(data, index);

        return pixel;
    }
};

struct Image {
    std::string magic;
    uint64_t headerSize = 0;
    uint64_t contentSize = 0;
    uint64_t width = 0;
    uint64_t height = 0;
    std::string caption;
    std::vector<std::string> tags;
    std::vector<Pixel> pixels;

    static Image parse(const std::vector<uint8_t>& data, uint64_t imageSize) {
        Image image;
        int index = 0;

        image.magic = parseString(data, 4, index);
        if (image.magic != "CIFF") {
            throw ParsingException("The image's magic is not equal to \"CIFF\"");
        }

        image.headerSize = parseInteger<uint64_t>(data, index);
        image.contentSize = parseInteger<uint64_t>(data, index);
        if (image.headerSize + image.contentSize != imageSize) {
            throw ParsingException("Invalid image size");
        }
        if (image.contentSize % 3 != 0) {
            throw ParsingException("Invalid image size");
        }

        image.width = parseInteger<uint64_t>(data, index);
        image.height = parseInteger<uint64_t>(data, index);
        image.caption = parseStringUntilChar(data, index, '\n');
        image.tags = parseTags(image, data, index);

        for (int i = 0; i < image.contentSize / 3; i++) {
            image.pixels.push_back(Pixel::parse(data, index));
        }
        if (image.pixels.size() != image.width * image.height) {
            throw ParsingException("Invalid image size");
        }

        return image;
    }

    std::string toString() {
        std::stringstream stream;
        stream << "[";
        for (int i = 0; i < height; i++) {
            stream << "[";
            for (int j = 0; j < width; j++) {
                auto pixel = pixels[i * width + j];
                stream << "[" << (int)pixel.r << ", " << (int)pixel.g << ", " << (int)pixel.b  << "]";
                if (j != width - 1) {
                    stream << ", ";
                }
            }
            stream << "]";
            if (i != height - 1) {
                stream << ", ";
            }
        }
        stream << "]";
        auto result = stream.str();
        stream.clear();

        return result;
    }

private:
    static std::vector<std::string> parseTags(const Image& image, const std::vector<uint8_t>& data, int& index) {
        std::vector<std::string> tags;

        auto tagsLength = image.headerSize - (
                image.magic.size() +
                sizeof(image.headerSize) +
                sizeof(image.contentSize) +
                sizeof(image.width) +
                sizeof(image.height) +
                image.caption.length() + 1);

        int remaining = tagsLength;
        while (remaining > 0) {
            auto tag = parseStringUntilChar(data, index, '\0');
            tags.push_back(tag);
            remaining -= tag.length() + 1;
        }

        return tags;
    }
};

struct AnimationImage {
    uint64_t duration = 0;
    Image image;

    static AnimationImage parse(const Tlv& tlv) {
        AnimationImage animation;

        auto durationLength = sizeof(duration);
        animation.duration = convertUint8s<uint64_t>(tlv.value);

        std::vector<uint8_t> image;
        std::copy_n(tlv.value.begin() + durationLength, tlv.length - durationLength, std::back_inserter(image));
        animation.image = Image::parse(image, tlv.length - durationLength);

        return animation;
    }
};


void parse() {
    auto content = readFile("./test_files/1.caff");
    cout << content.size() << endl;

    int index = 0;
    auto headerTlv = Tlv::parse(content, index);
    auto header = Header::parse(headerTlv);

    std::vector<Credits> credits;
    std::vector<AnimationImage> animationImages;

    while (index < content.size()) {
        Tlv nextTlv = Tlv::parse(content, index);

        switch (nextTlv.type) {
            case TlvType::Header:
                cout << "header" << endl;
                throw ParsingException("Multiple header blocks");
            case TlvType::Credits:
                cout << "credits" << endl;
                credits.push_back(Credits::parse(nextTlv));
                break;
            case TlvType::Animation:
                cout << "animation" << endl;
                animationImages.push_back(AnimationImage::parse(nextTlv));
                break;
            default:
                cout << "default" << endl;
                break;
        }
    }
}

int main() {
    try {
        parse();
    } catch (ParsingException& exception) {
        cout << "Sad :(";
        return 1;
    }

    return 0;
}