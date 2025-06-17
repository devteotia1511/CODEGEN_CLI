#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProject } from './commands/generate.js';
import { manageTemplates } from './commands/templates.js';
import { configureSettings } from './commands/settings.js';
import { Logger } from './utils/logger.js';
import { ConfigManager } from './utils/config.js';
import { TemplateManager } from './utils/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const logger = new Logger();
const config = new ConfigManager();
const templateManager = new TemplateManager();

// Initialize configuration
await config.init();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeGen CLI Web Server is running' });
});

app.get('/api/templates', async (req, res) => {
  try {
    const templates = await templateManager.listTemplates();
    res.json({ success: true, templates });
  } catch (error) {
    logger.error('Failed to fetch templates:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    const configData = await config.getConfig();
    res.json({ success: true, config: configData });
  } catch (error) {
    logger.error('Failed to fetch config:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const updates = req.body;
    await config.updateConfig(updates);
    res.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    logger.error('Failed to update config:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { name, framework, features, packageManager, template } = req.body;
    
    // Validate required fields
    if (!name || !framework) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project name and framework are required' 
      });
    }

    const options = {
      name,
      framework,
      template,
      features: features || [],
      packageManager: packageManager || 'npm'
    };

    // Create a custom logger that emits progress via Socket.IO
    const webLogger = {
      info: (message) => {
        logger.info(message);
        io.emit('generation-progress', { message, type: 'info', timestamp: new Date().toISOString() });
      },
      success: (message) => {
        logger.success(message);
        io.emit('generation-progress', { message, type: 'success', timestamp: new Date().toISOString() });
      },
      error: (message) => {
        logger.error(message);
        io.emit('generation-progress', { message, type: 'error', timestamp: new Date().toISOString() });
      },
      warn: (message) => {
        logger.warn(message);
        io.emit('generation-progress', { message, type: 'warning', timestamp: new Date().toISOString() });
      }
    };

    // Emit initial progress
    io.emit('generation-progress', { 
      message: `Starting project generation for "${name}" in Downloads folder...`, 
      type: 'info', 
      timestamp: new Date().toISOString() 
    });

    // Generate project with timeout protection
    const generationPromise = generateProject(options);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Project generation timed out')), 60000)
    );

    const result = await Promise.race([generationPromise, timeoutPromise]);

    // Emit success message
    io.emit('generation-progress', { 
      message: `Project "${name}" generated successfully in Downloads folder!`, 
      type: 'success', 
      timestamp: new Date().toISOString() 
    });

    res.json({ 
      success: true, 
      message: `Project "${name}" generated successfully in Downloads folder!`,
      projectPath: result.projectPath
    });

  } catch (error) {
    logger.error('Failed to generate project:', error.message);
    
    // Emit error message
    io.emit('generation-progress', { 
      message: `Error: ${error.message}`, 
      type: 'error', 
      timestamp: new Date().toISOString() 
    });
    
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/templates', async (req, res) => {
  try {
    const { action, templateData } = req.body;
    
    switch (action) {
      case 'create':
        await templateManager.createTemplate(templateData);
        res.json({ success: true, message: 'Template created successfully' });
        break;
      case 'delete':
        // Implementation for deleting templates
        res.json({ success: true, message: 'Template deleted successfully' });
        break;
      default:
        res.status(400).json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    logger.error('Failed to manage templates:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info('Client connected to web interface');
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected from web interface');
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle all other routes by serving the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
const isDev = process.argv.includes('--dev');

server.listen(PORT, () => {
  logger.success(`🚀 CodeGen CLI Web Server running on http://localhost:${PORT}`);
  if (isDev) {
    logger.info('Development mode enabled');
  }
});

export { app, io }; 