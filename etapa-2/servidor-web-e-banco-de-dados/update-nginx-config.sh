#!/bin/bash

# Script to safely replace nginx configuration
# This script will backup the current config and replace it with the new one

set -e  # Exit on any error

echo "🔧 Nginx Configuration Update Script"
echo "====================================="

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root or with sudo"
    echo "Usage: sudo ./update-nginx-config.sh"
    exit 1
fi

# Check if nginx.config exists
if [ ! -f "nginx.config" ]; then
    echo "❌ nginx.config file not found in current directory"
    exit 1
fi

# Create backup directory
BACKUP_DIR="/etc/nginx/backups"
mkdir -p "$BACKUP_DIR"

# Create timestamp for backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/default_backup_$TIMESTAMP.conf"

echo "📁 Creating backup of current configuration..."
if [ -f "/etc/nginx/sites-available/default" ]; then
    cp "/etc/nginx/sites-available/default" "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
else
    echo "⚠️  No existing default configuration found"
fi

# Use the nginx.config file
echo "📝 Using nginx.config file..."
cp nginx.config /etc/nginx/sites-available/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration test passed!"
else
    echo "❌ Nginx configuration test failed!"
    echo "🔄 Restoring backup..."
    cp "$BACKUP_FILE" /etc/nginx/sites-available/default
    echo "✅ Backup restored"
    exit 1
fi

# Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx

if [ $? -eq 0 ]; then
    echo "✅ Nginx reloaded successfully!"
else
    echo "❌ Failed to reload nginx"
    echo "🔄 Restoring backup..."
    cp "$BACKUP_FILE" /etc/nginx/sites-available/default
    systemctl reload nginx
    echo "✅ Backup restored and nginx reloaded"
    exit 1
fi

# Create web directory and set permissions
echo "📁 Creating web directory..."
mkdir -p /var/www/app
chown -R www-data:www-data /var/www/app
chmod -R 755 /var/www/app

# Copy index.html if it exists
if [ -f "index.html" ]; then
    echo "📄 Copying index.html to web directory..."
    cp index.html /var/www/app/
    chown www-data:www-data /var/www/app/index.html
    chmod 644 /var/www/app/index.html
    echo "✅ index.html copied successfully!"
else
    echo "⚠️  index.html not found in current directory"
    echo "   Please copy it manually to /var/www/app/"
fi

# Configuration file used successfully

echo ""
echo "🎉 Configuration update completed successfully!"
echo "📁 Backup location: $BACKUP_FILE"
echo "🌐 Your nginx configuration is now active"
echo "📂 Web directory: /var/www/app"
echo ""
echo "Next steps:"
echo "1. Make sure your Node.js app is running on port 3000"
echo "2. Test your application at http://your-ec2-ip"
echo "3. Check nginx status: sudo systemctl status nginx"
