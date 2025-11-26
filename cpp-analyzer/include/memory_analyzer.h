#ifndef MEMORY_ANALYZER_H
#define MEMORY_ANALYZER_H

#include <string>
#include <vector>

struct MemoryIssue {
    std::string type;
    std::string location;
    std::string severity;
    std::string description;
};

class MemoryAnalyzer {
public:
    MemoryAnalyzer();
    ~MemoryAnalyzer();

    std::vector<MemoryIssue> analyzeFile(const std::string& filePath);
    std::vector<MemoryIssue> analyzeBuffer(const char* buffer, size_t size);

private:
    std::vector<MemoryIssue> detectLeaks(const char* buffer, size_t size);
    std::vector<MemoryIssue> detectCorruption(const char* buffer, size_t size);
    std::vector<MemoryIssue> detectUseAfterFree(const char* buffer, size_t size);
};

#endif // MEMORY_ANALYZER_H
