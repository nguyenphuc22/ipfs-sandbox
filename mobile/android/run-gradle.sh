#!/bin/bash
# Helper script to run Gradle with Node.js in PATH
export PATH=/opt/homebrew/bin:$PATH
./gradlew "$@"
