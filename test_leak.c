#include <stdlib.h>

void memory_leak() {
    int* ptr = (int*)malloc(sizeof(int) * 10);
    // Missing free(ptr)
}

int main() {
    memory_leak();
    return 0;
}
