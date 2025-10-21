# Docker Log Management Makefile
# Usage: make <command>

.PHONY: help logs logs-api logs-db logs-all logs-follow logs-tail logs-grep logs-since logs-until logs-limit clean-logs nginx-setup nginx-update nginx-test nginx-reload nginx-status nginx-logs

# Default target
help:
	@echo "Docker Log Management Commands:"
	@echo "  logs      	   	- Show API container logs"
	@echo "  logs-follow   	- Follow API logs in real-time"
	@echo "  logs-tail     	- Show last 50 lines of API logs"
	@echo "  logs-grep     	- Search logs for specific pattern (usage: make logs-grep PATTERN='error')"
	@echo "  clean-logs    	- Clean up old logs"
	@echo ""
	@echo "API Container Management:"
	@echo "  status        	- Show API container status"
	@echo "  restart       	- Restart API container"
	@echo "  stop          	- Stop API container"
	@echo "  start         	- Start API container"
	@echo "  build         	- Build and start API container"
	@echo ""
	@echo "Nginx Management:"
	@echo "  nginx-setup   	- Complete nginx setup and deployment"
	@echo "  nginx-update  	- Update nginx configuration"
	@echo "  nginx-test    	- Test nginx configuration"
	@echo "  nginx-reload   	- Reload nginx configuration"
	@echo "  nginx-status   	- Show nginx status"
	@echo "  nginx-logs     	- Show nginx error logs"
	@echo ""

# Show API container logs
logs:
	@echo "📊 API Container Logs:"
	@docker logs postgres-crud-api

# Follow API logs in real-time
logs-follow:
	@echo "👀 Following API logs (Ctrl+C to stop):"
	@docker logs -f postgres-crud-api

# Show last 50 lines of API logs
logs-tail:
	@echo "📄 Last 50 lines of API logs:"
	@docker logs --tail 50 postgres-crud-api

# Search logs for specific pattern
logs-grep:
	@if [ -z "$(PATTERN)" ]; then \
		echo "❌ Please provide a pattern: make logs-grep PATTERN='error'"; \
		exit 1; \
	fi
	@echo "🔍 Searching API logs for: $(PATTERN)"
	@docker logs postgres-crud-api 2>&1 | grep -i "$(PATTERN)" || echo "No matches found"

# Clean up old logs (requires Docker 20.10+)
clean-logs:
	@echo "🧹 Cleaning up old logs..."
	@docker system prune -f
	@echo "✅ Log cleanup completed"

# Container status
status:
	@echo "📊 Container Status:"
	@docker-compose ps

# Restart API container
restart:
	@echo "🔄 Restarting API container..."
	@docker-compose restart
	@echo "✅ API container restarted"

# Stop API container
stop:
	@echo "🛑 Stopping API container..."
	@docker-compose down
	@echo "✅ API container stopped"

# Start API container production
start:
	@echo "🚀 Starting API container..."
	@docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ API container started"

# Build and start API container
build:
	@echo "🔨 Building and starting API container..."
	@docker-compose -f docker-compose.prod.yml up -d --build
	@echo "✅ API container built and started"

# =============================================================================
# NGINX MANAGEMENT COMMANDS
# =============================================================================

# Complete nginx setup and deployment
nginx-setup:
	@echo "🚀 Complete Nginx Setup and Deployment"
	@echo "======================================"
	@if [ ! -f "update-nginx-config.sh" ]; then \
		echo "❌ update-nginx-config.sh not found!"; \
		echo "   Please make sure the script exists in the current directory"; \
		exit 1; \
	fi
	@if [ ! -f "index.html" ]; then \
		echo "❌ index.html not found!"; \
		echo "   Please make sure index.html exists in the current directory"; \
		exit 1; \
	fi
	@echo "🔧 Running nginx setup script..."
	@chmod +x update-nginx-config.sh
	@sudo ./update-nginx-config.sh
	@echo "🎉 Nginx setup completed!"

# Update nginx configuration only
nginx-update:
	@echo "🔄 Updating Nginx Configuration"
	@echo "==============================="
	@if [ ! -f "update-nginx-config.sh" ]; then \
		echo "❌ update-nginx-config.sh not found!"; \
		exit 1; \
	fi
	@chmod +x update-nginx-config.sh
	@sudo ./update-nginx-config.sh

# Test nginx configuration
nginx-test:
	@echo "🧪 Testing Nginx Configuration"
	@echo "=============================="
	@sudo nginx -t
	@if [ $$? -eq 0 ]; then \
		echo "✅ Nginx configuration test passed!"; \
	else \
		echo "❌ Nginx configuration test failed!"; \
		exit 1; \
	fi

# Reload nginx configuration
nginx-reload:
	@echo "🔄 Reloading Nginx Configuration"
	@echo "==============================="
	@sudo nginx -t
	@if [ $$? -eq 0 ]; then \
		echo "✅ Configuration test passed, reloading..."; \
		sudo systemctl reload nginx; \
		echo "🎉 Nginx reloaded successfully!"; \
	else \
		echo "❌ Configuration test failed, not reloading!"; \
		exit 1; \
	fi

# Show nginx status
nginx-status:
	@echo "📊 Nginx Status"
	@echo "==============="
	@sudo systemctl status nginx --no-pager -l
	@echo ""
	@echo "📁 Web Directory Status:"
	@if [ -d "/var/www/app" ]; then \
		echo "✅ Web directory exists: /var/www/app"; \
		ls -la /var/www/app/; \
	else \
		echo "❌ Web directory not found: /var/www/app"; \
	fi

# Show nginx error logs
nginx-logs:
	@echo "📄 Nginx Error Logs (last 50 lines)"
	@echo "==================================="
	@sudo tail -50 /var/log/nginx/error.log