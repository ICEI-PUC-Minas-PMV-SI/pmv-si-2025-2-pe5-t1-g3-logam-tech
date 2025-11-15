#!/bin/bash

# Docker Installation Script for Ubuntu/Debian EC2 instances
# This script installs Docker and Docker Compose on Ubuntu/Debian EC2 instances

set -e

echo "🐳 Starting Docker installation on Ubuntu/Debian EC2..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
echo "🔑 Adding Docker's GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "➕ Adding Docker repository..."
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt-get update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
echo "🚀 Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (so you can run docker without sudo)
echo "👤 Adding ubuntu user to docker group..."
sudo usermod -a -G docker ubuntu

# Install Docker Compose (standalone)
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create symlink for easier access
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installations
echo "✅ Verifying installations..."
docker --version
docker-compose --version

# Test Docker
echo "🧪 Testing Docker installation..."
sudo docker run hello-world

echo ""
echo "🎉 Docker and Docker Compose installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Log out and log back in (or run 'newgrp docker') to apply group changes"
echo "2. Clone your repository: git clone <your-repo-url>"
echo "3. Navigate to your project: cd postgres-crud-api"
echo "4. Setup environment: cp env.production.example .env.production"
echo "5. Edit .env.production with your RDS credentials"
echo "6. Deploy: ./deploy.sh"
echo ""
echo "⚠️  Important: You need to log out and log back in for the docker group changes to take effect!"
echo "   Or run: newgrp docker"
