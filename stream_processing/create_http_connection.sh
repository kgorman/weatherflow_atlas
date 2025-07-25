#!/bin/bash

# Atlas Admin API - WeatherFlow HTTP Connection Setup
# This script shows the actual Atlas Admin API calls used to create the connections

# Load credentials from api.txt
if [ ! -f "../client/api.txt" ]; then
    echo "❌ Error: api.txt not found in ../client/"
    exit 1
fi

# Extract Atlas Admin API credentials
PUBLIC_KEY=$(grep "public_key=" ../client/api.txt | cut -d'=' -f2)
PRIVATE_KEY=$(grep "private_key=" ../client/api.txt | cut -d'=' -f2)
PROJECT_ID=$(grep "project_id=" ../client/api.txt | cut -d'=' -f2)
INSTANCE_NAME=$(grep "sp_instance_name:" ../client/api.txt | cut -d':' -f2 | xargs)

if [ -z "$PUBLIC_KEY" ] || [ -z "$PRIVATE_KEY" ] || [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Missing Atlas Admin API credentials in api.txt"
    exit 1
fi

if [ -z "$INSTANCE_NAME" ]; then
    INSTANCE_NAME="Test01"
fi

echo "🔧 Atlas Admin API - WeatherFlow Connection Setup"
echo "================================================"
echo ""
echo "📋 Configuration:"
echo "   Public Key: ${PUBLIC_KEY:0:8}***"
echo "   Project ID: $PROJECT_ID"
echo "   Stream Processing Instance: $INSTANCE_NAME"
echo ""

# Create WeatherFlow HTTP connection
echo "🌐 Creating WeatherFlow HTTP connection..."
echo ""

RESPONSE=$(curl -s -X POST \
  "https://cloud.mongodb.com/api/atlas/v2/groups/${PROJECT_ID}/streams/${INSTANCE_NAME}/connections" \
  --digest -u "${PUBLIC_KEY}:${PRIVATE_KEY}" \
  --header "Accept: application/vnd.atlas.2024-05-30+json" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "weatherflow_api",
    "type": "Https",
    "config": {
      "baseURL": "https://swd.weatherflow.com"
    }
  }')

# Check if connection was created successfully
if echo "$RESPONSE" | grep -q '"name".*"weatherflow_api"'; then
    echo "✅ WeatherFlow HTTP connection created successfully"
elif echo "$RESPONSE" | grep -q "already exists"; then
    echo "ℹ️  WeatherFlow HTTP connection already exists"
else
    echo "❌ Error creating connection:"
    echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
fi

echo ""
echo "🔍 Listing all connections..."

# List existing connections
LIST_RESPONSE=$(curl -s \
  "https://cloud.mongodb.com/api/atlas/v2/groups/${PROJECT_ID}/streams/${INSTANCE_NAME}/connections" \
  --digest -u "${PUBLIC_KEY}:${PRIVATE_KEY}" \
  --header "Accept: application/vnd.atlas.2024-05-30+json")

echo "$LIST_RESPONSE" | jq -r '.results[] | "   ✓ \(.name) (\(.type))"' 2>/dev/null || echo "   (Raw response: check connection manually)"

echo ""
echo "📚 Atlas Admin API Documentation:"
echo "   https://www.mongodb.com/docs/atlas/api/atlas-admin-api/"
echo "   Endpoint: /groups/{projectId}/streams/{instanceName}/connections"
echo ""
echo "✅ Setup complete! Connections are ready for WeatherFlow processor."
