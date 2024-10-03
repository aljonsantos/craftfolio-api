#!/bin/bash
# Description: This script is used to generate files from the frontend-codebase to download folder.

DOWNLOAD_ID=$1

# Check if the download folder name is provided
if [ -z "$DOWNLOAD_ID" ]; then
  echo "Please provide the download folder name"
  exit 1
fi

# Create the download directory based on the provided folder name

# Remove the download directory if it exists
rm -rf ./downloads/$DOWNLOAD_ID

# Sync the frontend-codebase to the download directory excluding specific directories
rsync -av --exclude='dist' --exclude='node_modules' --exclude='src/components/Editor' --exclude='services' --exclude='hooks' ./frontend-codebase/ ./downloads/$DOWNLOAD_ID

# Move all files from Common, Editor, and Preview to components and remove empty directories
for dir in Common Editor Preview; do
  if [ -d "./downloads/$DOWNLOAD_ID/src/components/$dir" ]; then
    mv ./downloads/$DOWNLOAD_ID/src/components/$dir/* ./downloads/$DOWNLOAD_ID/src/components/
    rm -rf ./downloads/$DOWNLOAD_ID/src/components/$dir
  fi
done