#include <iostream>
#include <vector>
#include "parser.hpp"

using std::cout;
using std::endl;

int main(int argc, char** argv) {
    if (argc != 2) {
        cout << "Invalid argument number" << endl;
        return EXIT_FAILURE;
    } else {
        try {
            auto content = readFile(argv[1]);
            auto result = Parser::parse(content);
            cout << std::get<0>(result) << " " << std::get<2>(result) << endl;
        } catch (std::exception& e) {
            cout << e.what() << endl;
            return EXIT_FAILURE;
        }
    }

    return EXIT_SUCCESS;
}
