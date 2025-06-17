# CodeGen CLI

A modern, interactive command-line tool for generating boilerplate code with beautiful templates and smart scaffolding. Now with a **web interface** for an even better user experience!

![CodeGen CLI Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=CodeGen+CLI)

## ✨ Features

- 🎨 **Beautiful Interactive Interface** - Elegant ASCII art and colorful terminal UI
- 🌐 **Modern Web Interface** - Responsive web UI for easy project generation
- 🚀 **Framework Support** - React, Vue, Angular, Svelte, Express, and more
- 📦 **Smart Scaffolding** - Intelligent project structure generation
- 🛠️ **Feature Selection** - TypeScript, ESLint, Prettier, Testing, and more
- 📋 **Template Management** - Create, modify, and share custom templates
- ⚙️ **Configurable** - Persistent settings and preferences
- 📊 **Progress Tracking** - Visual feedback with spinners and progress bars
- 🎯 **Package Manager Support** - npm, yarn, and pnpm compatibility
- 🔄 **Real-time Updates** - Live progress updates via WebSocket

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codegen-cli.git
cd codegen-cli

# Install dependencies
npm install
```

### Usage

#### Web Interface (Recommended)
```bash
# Start the web server
npm run web

# Open your browser and navigate to:
# http://localhost:3000
```

#### CLI Mode
```bash
# Run the CLI directly
npm start
# or
node src/cli.js
```

#### Direct Commands
```bash
# Generate a new project
node src/cli.js generate --name my-app --framework react

# Manage templates
node src/cli.js templates

# Configure settings
node src/cli.js config
```

## 🌐 Web Interface

The web interface provides a modern, user-friendly way to interact with CodeGen CLI:

### Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Real-time Progress** - Live updates during project generation
- **Template Management** - Visual template browser and creator
- **Settings Configuration** - Easy-to-use settings panel
- **Toast Notifications** - Beautiful feedback for all actions

### Navigation
- **Generate Tab** - Create new projects with feature selection
- **Templates Tab** - Browse and manage project templates
- **Settings Tab** - Configure your preferences

### Getting Started with Web UI
1. Run `npm run web` to start the server
2. Open `http://localhost:3000` in your browser
3. Fill in project details and select features
4. Click "Generate Project" and watch the magic happen!

## 🎯 Supported Frameworks

| Framework | Status | Features |
|-----------|---------|----------|
| React | ✅ | TypeScript, Vite, ESLint, Prettier |
| Vue.js | ✅ | Composition API, TypeScript, Vite |
| Angular | 🚧 | Coming Soon |
| Svelte | 🚧 | Coming Soon |
| Express | ✅ | TypeScript, REST API, Middleware |
| Next.js | 🚧 | Coming Soon |
| Vanilla JS | ✅ | Modern ES6+, CSS3 |

## 🛠️ Available Features

### Core Features
- ✅ **TypeScript** - Full TypeScript support with proper configuration
- ✅ **ESLint** - Code linting with framework-specific rules
- ✅ **Prettier** - Code formatting with sensible defaults
- ✅ **Jest Testing** - Unit testing setup with framework integration
- 🚧 **Cypress E2E** - End-to-end testing (Coming Soon)

### Styling & UI
- ✅ **Tailwind CSS** - Utility-first CSS framework
- 🚧 **Sass/SCSS** - CSS preprocessor support (Coming Soon)
- 🚧 **Styled Components** - CSS-in-JS solution (Coming Soon)

### Development Tools
- ✅ **Docker** - Containerization support
- 🚧 **GitHub Actions** - CI/CD workflows (Coming Soon)
- 🚧 **PWA Support** - Progressive Web App features (Coming Soon)

## 📋 Template System

### Built-in Templates

CodeGen CLI comes with professionally crafted templates:

- **react-basic** - Modern React with Vite and TypeScript
- **vue-starter** - Vue 3 with Composition API
- **express-api** - RESTful API with Express.js

### Custom Templates

Create your own templates through the web interface or CLI:

```bash
# Access template management
node src/cli.js templates

# Select "Create custom template"
# Follow the interactive prompts
```

Template structure:
```
templates/
└── my-template/
    ├── template.json      # Template configuration
    ├── src/              # Source files
    ├── public/           # Public assets
    └── package.json      # Dependencies
```

## ⚙️ Configuration

Configure your preferences through the web interface or CLI:

```bash
node src/cli.js config
```

### Available Settings

- **General Preferences**
  - Default author name and email
  - Log level (error, warn, info, debug)
  - Auto-install dependencies
  - Show helpful tips

- **Template Settings**
  - Custom templates directory
  - Auto-update templates
  - Default framework

- **Package Manager**
  - Default package manager (npm, yarn, pnpm)
  - Use exact versions
  - Custom NPM registry

- **Development Environment**
  - Preferred code editor
  - Auto-open in editor
  - Terminal shell preference
  - Auto-generate .gitignore

## 🎨 User Interface

### Web Interface
CodeGen CLI features a modern, responsive web interface:

- **Clean Design** - Beautiful gradient backgrounds and modern UI components
- **Interactive Forms** - Easy-to-use forms with validation
- **Real-time Feedback** - Live progress updates and toast notifications
- **Mobile Responsive** - Works great on all device sizes
- **Dark/Light Theme** - Comfortable viewing in any environment

### CLI Interface
The traditional CLI still provides:

- **Welcome Screen** - Beautiful ASCII art logo with gradient colors
- **Interactive Menus** - Easy navigation with arrow keys
- **Progress Indicators** - Spinners and progress bars for long operations
- **Color-coded Output** - Different colors for errors, warnings, and success
- **Emoji Integration** - Visual icons for better user experience

## 📁 Project Structure

```
codegen-cli/
├── src/
│   ├── cli.js                 # Main CLI entry point
│   ├── server.js              # Web server for browser interface
│   ├── commands/
│   │   ├── generate.js        # Project generation logic
│   │   ├── menu.js           # Interactive menu system
│   │   ├── settings.js       # Configuration management
│   │   └── templates.js      # Template operations
│   └── utils/
│       ├── config.js         # Configuration utilities
│       ├── logger.js         # Logging system
│       └── templates.js      # Template management engine
├── public/                   # Web interface files
│   ├── index.html           # Main HTML file
│   ├── styles.css           # CSS styles
│   └── app.js               # Frontend JavaScript
├── package.json
└── README.md
```

## 🚀 Development

### Running in Development Mode

```bash
# Start web server in development mode
npm run dev

# This enables additional logging and debugging features
```

### API Endpoints

The web server provides the following API endpoints:

- `GET /api/health` - Server health check
- `GET /api/templates` - List available templates
- `POST /api/templates` - Create/manage templates
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration
- `POST /api/generate` - Generate a new project

### WebSocket Events

- `generation-progress` - Real-time project generation updates

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/codegen-cli.git
cd codegen-cli

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests (when available)
npm test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js/) for command parsing
- UI powered by [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for interactive prompts
- Web interface built with [Express.js](https://expressjs.com/) and [Socket.IO](https://socket.io/)
- Styled with [Chalk](https://github.com/chalk/chalk) for beautiful colors
- ASCII art generated with [Figlet](https://github.com/patorjk/figlet.js)

## 📞 Support

- 📧 **Email**: support@codegen-cli.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/codegen-cli/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/codegen-cli/discussions)

---

<div align="center">
  <p>Made with ❤️ by the CodeGen CLI team</p>
  <p>⭐ Star us on GitHub if you find this helpful!</p>
</div>