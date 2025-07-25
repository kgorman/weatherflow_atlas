#!/bin/bash

# WeatherFlow Stream Processor Runner
# Loads credentials from api.txt and runs the processor

# Load credentials from api.txt
if [ ! -f "../client/api.txt" ]; then
    echo "❌ Error: api.txt not found in ../client/"
    exit 1
fi

# Extract Atlas Stream Processing URL
ASP_TARGET_URL=$(grep "ASP_TARGET_URL=" ../client/api.txt | cut -d'=' -f2-)

if [ -z "$ASP_TARGET_URL" ]; then
    echo "❌ Error: Could not find ASP_TARGET_URL in api.txt"
    exit 1
fi

# Mask the password in the display URL
MASKED_URL=$(echo "$ASP_TARGET_URL" | sed 's/:dYKCAYAMwfnn2yVk@/:***@/')

echo "🔌 Connecting to MongoDB Atlas Stream Processing..."
echo "🎯 Stream Processing URL: ${MASKED_URL}"
echo "🚀 Running WeatherFlow processor..."

# Run the processor using the real (unmasked) URL
mongosh "$ASP_TARGET_URL" \
    --file weatherflow_unified_processor.js

echo ""
echo "✅ Process complete!"
echo "📊 Check your weather.weatherflow_stream collection for data"
