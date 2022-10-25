#include <string>
#include "testlib.h"

using namespace std;

int main(int argc, char* argv[]) {
    // inf - stream with the testdata.
    // ouf - stream with the contestant output.
    // ans - stream with the jury answer.

    // This command initializes checker environment.
    registerTestlibCmd(argc, argv);

    while (!ans.seekEof()) {
        string ansToken = ans.readLine();
        string oufToken = ouf.readLine();

        if (ansToken != oufToken) {
            quitf(_wa, "Expected '%s', but found '%s'", ansToken.c_str(),
                  oufToken.c_str());
        }
    }
    if (!ouf.seekEof()) {
        quitf(_wa, "Expected EOF, but found '%s'", ouf.readLine().c_str());
    }

    quitf(_ok, "OK");
}