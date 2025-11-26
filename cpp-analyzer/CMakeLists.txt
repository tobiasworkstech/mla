cmake_minimum_required(VERSION 3.15)
project(MemoryAnalyzer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Platform-specific settings
if(APPLE)
    set(CMAKE_SHARED_LIBRARY_SUFFIX ".dylib")
elseif(UNIX)
    set(CMAKE_SHARED_LIBRARY_SUFFIX ".so")
elseif(WIN32)
    set(CMAKE_SHARED_LIBRARY_SUFFIX ".dll")
endif()

# Add library
add_library(memory_analyzer SHARED
    src/analyzer.cpp
    src/memory_parser.cpp
)

target_include_directories(memory_analyzer PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# Install
install(TARGETS memory_analyzer
    LIBRARY DESTINATION lib
    RUNTIME DESTINATION bin
)
