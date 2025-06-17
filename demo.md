# CodeGen CLI Demo Guide

This guide will walk you through using both the CLI and web interface of CodeGen CLI.

## 🚀 Quick Demo

### 1. Start the Web Interface

```bash
# Start the web server
npm run web

# The server will start on http://localhost:3000
```

### 2. Open the Web Interface

Open your browser and navigate to: **http://localhost:3000**

You'll see a beautiful, modern interface with three main tabs:

- **Generate** - Create new projects
- **Templates** - Manage project templates  
- **Settings** - Configure preferences

### 3. Generate Your First Project

1. **Fill in Project Details:**
   - Project Name: `my-awesome-app`
   - Framework: Select `React`
   - Package Manager: Choose `npm`

2. **Select Features:**
   - ✅ TypeScript (recommended)
   - ✅ ESLint (recommended)
   - ✅ Prettier (recommended)
   - ✅ Tailwind CSS (optional)
   - ✅ Jest Testing (optional)

3. **Click "Generate Project"**

4. **Watch the Magic Happen!**
   - Real-time progress updates
   - Beautiful animations
   - Success notification

### 4. Explore Templates

Switch to the **Templates** tab to see:
- Built-in templates (React, Vue, Express)
- Template details and features
- Create custom templates

### 5. Configure Settings

Switch to the **Settings** tab to customize:
- Default author information
- Preferred frameworks
- Package manager preferences
- Editor settings

## 🖥️ CLI Demo

You can also use the traditional CLI interface:

```bash
# Start interactive mode
npm start

# Or use direct commands
node src/cli.js generate --name my-cli-app --framework react
```

## 🎯 What You'll Get

After generating a project, you'll have:

### React Project Structure
```
my-awesome-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### Ready-to-Use Scripts
```bash
cd my-awesome-app
npm install
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## 🌟 Features Demonstrated

- **Modern Web UI** - Responsive design with beautiful animations
- **Real-time Progress** - Live updates during project generation
- **Template Management** - Visual template browser
- **Feature Selection** - Easy-to-use checkboxes for features
- **Settings Management** - Persistent configuration
- **Toast Notifications** - Beautiful feedback system
- **Mobile Responsive** - Works on all devices

## 🔧 Advanced Usage

### Create Custom Templates

1. Go to **Templates** tab
2. Click **"Create New Template"**
3. Fill in template details
4. Your template will be available for future projects

### API Integration

The web interface is built on a REST API:

```bash
# Get all templates
curl http://localhost:3000/api/templates

# Get configuration
curl http://localhost:3000/api/config

# Generate project via API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "api-project",
    "framework": "react",
    "features": ["typescript", "eslint"]
  }'
```

## 🎨 UI Features

- **Gradient Backgrounds** - Beautiful visual design
- **Smooth Animations** - Professional feel
- **Interactive Forms** - Real-time validation
- **Progress Indicators** - Visual feedback
- **Toast Notifications** - Non-intrusive messages
- **Responsive Layout** - Works on all screen sizes

## 🚀 Next Steps

1. **Explore Templates** - Try different frameworks
2. **Customize Settings** - Set your preferences
3. **Create Templates** - Build your own templates
4. **Generate Projects** - Start building amazing apps!

---

**Happy coding! 🚀** 