#!/bin/bash

# Script to optimize GLB models using gltf-pipeline
# This reduces file sizes and improves loading performance

echo "🚀 Optimizing 3D models..."

# Create backup directory
mkdir -p public/models/original
echo "📦 Creating backups in public/models/original/"

# Optimize each model
for model in public/models/*.glb; do
  filename=$(basename "$model")
  
  # Skip if already in original folder
  if [[ "$model" == *"original"* ]]; then
    continue
  fi
  
  echo "Optimizing $filename..."
  
  # Backup original
  cp "$model" "public/models/original/$filename"
  
  # Optimize with Draco compression
  npx gltf-pipeline -i "$model" -o "$model" -d
  
done

echo "✅ All models optimized!"
echo "📊 Compression stats:"
du -sh public/models/original/
du -sh public/models/*.glb
