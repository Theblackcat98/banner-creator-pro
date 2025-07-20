# 🎨 Banner Creator Pro

A modern, responsive banner creation tool built with React, TypeScript, and Vite. Create beautiful banners with custom text, colors, and icons, then export them as PNG files.

![Banner Creator Pro Screenshot](https://via.placeholder.com/1200x630/161b22/e6edf3?text=Banner+Creator+Pro)

## ✨ Features

- 🎨 Customizable banner dimensions
- 🎨 Rich text editing with font size and color options
- 🖼️ Built-in icons and custom SVG upload
- 🎯 Flexible text and icon positioning
- 🖥️ OS Window theme option
- 📥 Export as high-quality PNG
- 🌓 Dark theme UI
- ⚡ Built with Vite for fast development

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/banner-creator-pro.git
   cd banner-creator-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Usage

1. **Customize Banner**
   - Adjust width and height
   - Change background color
   - Add rounded corners and outline

2. **Add Text**
   - Enter your banner text
   - Choose font family and size
   - Set text color and alignment

3. **Add Icons**
   - Select from predefined icons
   - Or upload your own SVG
   - Position the icon relative to text

4. **Download**
   - Click the "Download PNG" button
   - Get a high-quality PNG of your banner

## 🎨 Customization

### Themes
- **Default**: Clean banner with customizable background
- **OS Window**: Banner with a window frame and title bar

### Advanced Options
- Custom SVG upload for icons
- Precise control over text and icon positioning
- Outline and corner radius customization

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── App.tsx         # Main application component
│   ├── constants.ts    # Application constants
│   ├── main.tsx        # Application entry point
│   └── types.ts        # TypeScript type definitions
├── public/             # Static assets
└── index.html          # HTML template
```

## 🌐 Deployment

### GitHub Pages

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/banner-creator-pro/',
     // ... other config
   });
   ```

3. Add deployment scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI powered by [React](https://reactjs.org/)
- Icons from [Heroicons](https://heroicons.com/)
