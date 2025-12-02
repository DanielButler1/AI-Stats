// Build after generating the SDK: pnpm openapi:gen:cpp
#include "../index.cpp"
#include <iostream>
#include <pplx/pplxtasks.h>

int main() {
    const std::string apiKey = std::getenv("AI_STATS_API_KEY") ? std::getenv("AI_STATS_API_KEY") : "";
    if (apiKey.empty()) {
        std::cerr << "Set AI_STATS_API_KEY" << std::endl;
        return 1;
    }

    ai_stats_sdk_cpp::Client client(apiKey);
    auto task = client.getModels();
    auto resp = task.get();
    std::cout << "Models fetched" << std::endl;
    return 0;
}
