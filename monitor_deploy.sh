#!/bin/bash

echo "🔍 Monitoring DigitalOcean deployment..."
echo "Expected new file: main.6e00535b.js"
echo "Current old file: main.aeb8e7dc.js"
echo ""

while true; do
    current_file=$(curl -s https://nuestracarnepa.com/admin | grep -o "main\.[^\"]*\.js")
    timestamp=$(date)
    
    if [ "$current_file" = "main.6e00535b.js" ]; then
        echo "🎉 SUCCESS! New version deployed at $timestamp"
        echo "File changed from main.aeb8e7dc.js to main.6e00535b.js"
        break
    else
        echo "⏳ Still old version ($current_file) at $timestamp"
    fi
    
    sleep 10
done