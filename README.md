# 🔥 Sip Vibe Meme

A modern, feature-rich meme and GIF creation platform built with React, TypeScript, and Vite.

## ✨ Features

- **🎨 Meme Editor**: Create hilarious memes with custom text, fonts, and styling
- **🎬 GIF Editor**: Transform images into animated GIFs with effects and transitions
- **🖼️ Gallery**: Browse and discover amazing memes from the community
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds
- **🎯 TypeScript**: Full type safety for better development experience

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Type Safety**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Canvas Manipulation**: HTML5 Canvas API
- **GIF Generation**: gif.js (planned)
- **Image Processing**: html2canvas

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wo-ist-henry/sip-vibe-meme.git
   cd sip-vibe-meme
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check

## 🎨 Features in Detail

### Meme Editor
- Upload custom images or use templates
- Add multiple text elements with custom positioning
- Choose from various fonts and text styles
- Adjust font size, color, and alignment
- Add text outlines for better readability
- Real-time preview on canvas
- Export high-quality memes

### GIF Editor
- Upload multiple images to create animated GIFs
- Adjust frame timing and duration
- Reorder frames with drag-and-drop
- Preview animations before export
- Customize GIF settings (quality, loop count, dimensions)
- Support for various image formats

### Gallery
- Browse community-created memes
- Search and filter by categories
- Sort by popularity, recency, or likes
- Like and share favorite memes
- Download memes in high quality

## 🔧 Development

This project uses modern development tools and practices:

- **Hot Module Replacement** for instant updates during development
- **TypeScript** for type safety and better IDE experience
- **ESLint** for code quality and consistency
- **Tailwind CSS** for rapid UI development
- **Component-based architecture** for maintainability

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation header
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page
│   ├── MemeEditor.tsx  # Meme creation interface
│   ├── GifEditor.tsx   # GIF creation interface
│   └── Gallery.tsx     # Meme gallery
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎯 Roadmap

- [ ] User authentication and profiles
- [ ] Cloud storage for memes and GIFs
- [ ] Advanced editing tools (filters, effects)
- [ ] Social features (comments, sharing)
- [ ] Meme templates library
- [ ] Mobile app (React Native)
- [ ] AI-powered meme suggestions
- [ ] Video meme support

## 🚀 Deployment

This project is automatically deployed using GitHub Actions:

### 🌐 Production Deployment
- **Main Site**: Automatically deployed to [GitHub Pages](https://wo-ist-henry.github.io/sip-vibe-meme/) when changes are pushed to the `main` branch
- **Workflow**: `.github/workflows/deploy-main.yml`

### 🔍 PR Preview Deployments
- **Preview URLs**: Each Pull Request gets its own preview deployment at `https://wo-ist-henry.github.io/sip-vibe-meme/pr-{number}/`
- **Automatic Updates**: Previews are updated automatically when new commits are pushed to the PR
- **Cleanup**: Preview deployments are automatically removed when PRs are closed
- **Workflow**: `.github/workflows/deploy-pr-preview.yml`

### 🔧 Local Development
For local development, the site runs at `http://localhost:3000` with proper asset paths configured automatically.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Each PR will automatically get a preview deployment where you can test your changes before they're merged.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

Made with ❤️ by the Sip Vibe Meme team