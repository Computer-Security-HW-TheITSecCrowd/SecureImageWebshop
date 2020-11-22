
#ifndef PARSER_PARSER_HPP
#define PARSER_PARSER_HPP

#include "utils.hpp"

enum class TlvType : uint8_t {
    Header = 0x1,
    Credits = 0x2,
    Animation = 0x3,
};

auto isTlvType(uint8_t n) -> bool {
    return n >= 1 && n <= 3;
}

struct Tlv {
    TlvType type = TlvType::Header;
    uint64_t length = 0;
    std::vector<uint8_t> value;

    static Tlv parse(const std::vector<uint8_t>& content, size_t& startIndex) {
        size_t index = startIndex;

        auto result = Tlv();

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

    static bool isEnoughSpace(const std::vector<uint8_t>& content, size_t currentIndex, size_t requiredSpace) noexcept {
        return content.size() - currentIndex >= requiredSpace;
    }
};

// Blocks

struct Header {
    std::string magic;
    uint64_t length = 0;
    uint64_t numberOfAnimations = 0;

    static Header parse(const Tlv& tlv) {
        size_t magicLength = 4;
        if (tlv.length != magicLength + sizeof(length) + sizeof(numberOfAnimations)) {
            throw ParsingException("The TLV's length is not equal to the header's size");
        }

        Header header;
        size_t index = 0;

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
        size_t index = 0;
        auto dateTime = DateTime();

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
        auto creator = Creator();
        size_t index = 0;

        creator.length = parseInteger<uint64_t>(data, index);
        creator.name = parseString(data, creator.length, index);

        return creator;
    }
};

struct Credits {
    DateTime creationDateTime;
    Creator creator;

    static Credits parse(const Tlv& tlv) {
        auto credits = Credits();

        size_t datetimeLength = 6;
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

    static Pixel parse(const std::vector<uint8_t>& data, size_t& index) {
        auto pixel = Pixel();

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
        auto image = Image();
        size_t index = 0;

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

        for (size_t i = 0; i < image.contentSize / 3; i++) {
            image.pixels.push_back(Pixel::parse(data, index));
        }
        if (image.pixels.size() != image.width * image.height) {
            throw ParsingException("Invalid image size");
        }

        return image;
    }

    std::string toString() noexcept {
        auto stream = std::stringstream();
        stream << "[";
        for (size_t i = 0; i < height; i++) {
            stream << "[";
            for (size_t j = 0; j < width; j++) {
                auto pixel = pixels[i * width + j];
                stream << "[" << (size_t) pixel.r << ", " << (size_t) pixel.g << ", " << (size_t) pixel.b << "]";
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
    static std::vector<std::string> parseTags(const Image& image, const std::vector<uint8_t>& data, size_t& index) {
        auto tags = std::vector<std::string>();

        auto tagsLength = image.headerSize - (
                image.magic.size() +
                sizeof(image.headerSize) +
                sizeof(image.contentSize) +
                sizeof(image.width) +
                sizeof(image.height) +
                image.caption.length() + 1);

        size_t remaining = tagsLength;
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
        auto animation = AnimationImage();

        auto durationLength = sizeof(duration);
        animation.duration = convertUint8s<uint64_t>(tlv.value);

        std::vector<uint8_t> image;
        std::copy_n(tlv.value.begin() + durationLength, tlv.length - durationLength, std::back_inserter(image));
        animation.image = Image::parse(image, tlv.length - durationLength);

        return animation;
    }
};

struct Animation {
    Header header;
    Credits credits;
    std::vector<AnimationImage> animationImages;
};

using std::cout;
using std::endl;

struct Parser {
    static std::tuple<bool, Animation, std::string> parse(const std::vector<uint8_t>& content) {
        try {
            size_t index = 0;
            auto headerTlv = Tlv::parse(content, index);
            if (headerTlv.type != TlvType::Header) {
                throw ParsingException("The first block is not a header");
            }
            cout << "Parsing header block..." << endl;
            auto header = Header::parse(headerTlv);
            cout << "Header block parsed." << endl;

            auto credits = std::vector<Credits>();
            auto animationImages = std::vector<AnimationImage>();

            while (index < content.size()) {
                Tlv nextTlv = Tlv::parse(content, index);

                switch (nextTlv.type) {
                    case TlvType::Header:
                        cout << "Parsing header block..." << endl;
                        throw ParsingException("Multiple header blocks");
                    case TlvType::Credits:
                        cout << "Parsing credits block..." << endl;
                        if (credits.size() == 1) {
                            throw ParsingException("Only one credits block is allowed");
                        }
                        credits.push_back(Credits::parse(nextTlv));
                        cout << "Credits block parsed." << endl;
                        break;
                    case TlvType::Animation:
                        cout << "Parsing animation block..." << endl;
                        animationImages.push_back(AnimationImage::parse(nextTlv));
                        cout << "Animation block parsed." << endl;
                        break;
                }
            }

            Animation animation;
            animation.header = header;
            animation.credits = credits[0];
            animation.animationImages = animationImages;

            return std::make_tuple(true, animation, "");

        } catch (ParsingException& e) {
            return std::make_tuple(false, Animation(), e.what());
        }
    }
};

#endif //PARSER_PARSER_HPP
