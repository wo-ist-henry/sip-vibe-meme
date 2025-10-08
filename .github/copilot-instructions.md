# Copilot Instructions for Sip Vibe Meme

## Project Overview
Sip Vibe Meme is a modern, feature-rich meme and GIF creation platform built with React, TypeScript, and Vite. It provides users with intuitive tools to create, customize, and share hilarious memes and animated GIFs.

## Tech Stack & Architecture

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Package Manager**: pnpm (preferred over npm/yarn)
- **Styling**: Tailwind CSS with custom utility classes
- **Routing**: React Router DOM for client-side routing
- **Icons**: Lucide React for consistent iconography

### Canvas & Image Processing
- **HTML5 Canvas API**: Core rendering engine for meme/GIF creation
- **Fabric.js**: Advanced canvas manipulation library
- **html2canvas**: Screenshot and export functionality
- **gif.js**: GIF generation and animation capabilities

### Development Tools
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React hooks and TypeScript rules
- **PostCSS**: CSS processing with autoprefixer
- **Hot Module Replacement**: Instant updates during development

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Main navigation header
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page with feature showcase
│   ├── MemeEditor.tsx  # Meme creation interface
│   ├── GifEditor.tsx   # GIF creation and animation tools
│   └── Gallery.tsx     # Meme browsing and discovery
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
├── utils/              # Helper functions and utilities
│   └── index.ts        # Common utility functions
├── App.tsx             # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles and custom CSS
```

## Coding Standards & Patterns

### TypeScript Guidelines
- **Strict Mode**: All TypeScript strict checks are enabled
- **Explicit Types**: Avoid `any` type, use specific interfaces
- **Interface Definitions**: Define clear interfaces for all data structures
- **Type Safety**: Leverage TypeScript for compile-time error checking
- **No Unused Variables**: Clean up unused imports and variables

### React Patterns
- **Functional Components**: Use function components with hooks (no class components)
- **TypeScript FC**: Use `React.FC` type annotation for components
- **Hook Dependencies**: Properly manage useEffect dependencies
- **State Management**: Use useState and useRef for local component state
- **Event Handlers**: Type event handlers properly (e.g., `React.ChangeEvent<HTMLInputElement>`)

### Component Structure
```typescript
import React, { useState, useEffect } from 'react'
import { SomeIcon } from 'lucide-react'

interface ComponentProps {
  title: string
  onAction: () => void
}

const MyComponent: React.FC<ComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<string>('')
  
  useEffect(() => {
    // Effect logic
  }, [/* dependencies */])

  return (
    <div className="card">
      {/* JSX content */}
    </div>
  )
}

export default MyComponent
```

## Styling Guidelines

### Tailwind CSS Usage
- **Utility-First**: Use Tailwind utility classes for styling
- **Custom Components**: Use `card`, `btn-primary`, `btn-secondary` classes for consistency
- **Responsive Design**: Use responsive prefixes (`md:`, `lg:`) for mobile-first design
- **Color Scheme**: Stick to defined color palette (primary blues, grays)
- **Spacing**: Use consistent spacing scale (space-y-4, gap-6, p-4, etc.)

### Custom CSS Classes
- `.card`: White background, rounded corners, shadow, padding
- `.btn-primary`: Blue button with hover states
- `.btn-secondary`: Gray button with hover states
- `.input-field`: Styled form inputs with focus states

### Color Palette
```css
Primary: #0ea5e9 (blue-500) -> #0284c7 (blue-600) on hover
Secondary: #e5e7eb (gray-200) -> #d1d5db (gray-300) on hover
Text: #111827 (gray-900), #374151 (gray-700), #6b7280 (gray-500)
Background: #f9fafb (gray-50), white
```

## Development Workflow

### Scripts
- `pnpm dev`: Start development server (port 3000)
- `pnpm build`: Build for production (TypeScript + Vite)
- `pnpm preview`: Preview production build
- `pnpm lint`: Run ESLint with TypeScript rules
- `pnpm type-check`: Run TypeScript compiler check

### Code Quality
- **Linting**: Fix all ESLint errors before committing
- **Type Checking**: Ensure TypeScript compilation passes
- **Hot Reload**: Utilize Vite's HMR for rapid development
- **Build Verification**: Test production builds before deployment

## Canvas & Image Editor Features

### Meme Editor (`/meme-editor`)
- **Image Upload**: File input with drag-and-drop support
- **Text Elements**: Draggable, resizable text with custom fonts
- **Canvas Manipulation**: HTML5 Canvas for rendering
- **Export Options**: Download as PNG/JPEG
- **Text Styling**: Font family, size, color, alignment, stroke options

### GIF Editor (`/gif-editor`)
- **Frame Management**: Multiple image frames for animation
- **Playback Controls**: Play/pause GIF preview
- **Frame Properties**: Individual frame delay settings
- **Canvas Rendering**: Real-time GIF preview
- **Export**: Generate and download animated GIFs

### Common Canvas Patterns
```typescript
// Canvas reference and drawing
const canvasRef = useRef<HTMLCanvasElement>(null)

const drawCanvas = () => {
  const canvas = canvasRef.current
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Clear and draw logic
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // ... drawing operations
}

// Image upload handling
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  // Process uploaded images
}
```

## Key Dependencies & Usage

### Lucide React Icons
```typescript
import { Upload, Download, Play, Pause, Settings } from 'lucide-react'

// Usage in JSX
<Upload className="w-4 h-4" />
```

### Utility Functions
```typescript
import { generateId, debounce, downloadFile } from '../utils'

// Generate unique IDs for elements
const id = generateId()

// Debounce user input
const debouncedHandler = debounce(handleInput, 300)

// Download files
downloadFile(canvas.toDataURL(), 'meme.png')
```

## API & Data Structures

### Core Types
- `User`: User account information
- `MemeTemplate`: Predefined meme templates
- `MemeCreation`: Complete meme with metadata
- `TextElement`: Text overlay configuration
- `GifFrame`: Individual GIF frame data

### State Management
- **Local State**: Use useState for component-specific data
- **Canvas State**: Manage canvas elements and properties
- **File Handling**: Handle image uploads and downloads
- **Form State**: Control form inputs and validation

## Performance Considerations

### Canvas Optimization
- **Efficient Rendering**: Only redraw canvas when necessary
- **Image Caching**: Cache loaded images to avoid reprocessing
- **Debounced Updates**: Debounce user input to reduce render cycles
- **Memory Management**: Clean up canvas contexts and event listeners

### Bundle Optimization
- **Tree Shaking**: Import only needed functions from libraries
- **Code Splitting**: Use lazy loading for routes if needed
- **Asset Optimization**: Optimize images and fonts for web delivery

## Common Patterns & Best Practices

### Event Handling
```typescript
// File input handling
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    // Process file
  }
}

// Canvas events
const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  const rect = canvasRef.current?.getBoundingClientRect()
  if (rect) {
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    // Handle click at (x, y)
  }
}
```

### Error Handling
```typescript
// Safe canvas operations
try {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')
  // Canvas operations
} catch (error) {
  console.error('Canvas error:', error)
}

// File validation
const validateFile = (file: File): boolean => {
  return file.type.startsWith('image/') && file.size < 10 * 1024 * 1024
}
```

## Testing & Quality Assurance

### Manual Testing Checklist
- [ ] Image upload and display works correctly
- [ ] Text elements can be added, moved, and styled
- [ ] Canvas rendering is accurate and responsive  
- [ ] Export functionality generates correct files
- [ ] Responsive design works on mobile and desktop
- [ ] All navigation links work properly

### Browser Compatibility
- Modern browsers with Canvas and File API support
- ES2020+ JavaScript features
- CSS Grid and Flexbox layouts
- HTML5 form validation

## Deployment & Build

### Production Build
- TypeScript compilation with strict checks
- Vite optimizations (minification, tree shaking)
- Asset optimization and chunking
- Source maps for debugging (enabled)

### Environment Setup
- Node.js 18+ recommended
- pnpm as package manager
- Modern browser for development
- Canvas and WebGL support preferred

## Contributing Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Add proper type annotations
- Include JSDoc comments for complex functions
- Maintain consistent indentation and formatting

### Git Workflow
- Create feature branches from main
- Use descriptive commit messages
- Test all changes before submitting PRs
- Ensure linting and type checking pass
- Update documentation when needed

## Troubleshooting

### Common Issues
- **Canvas not rendering**: Check canvas ref and context availability
- **TypeScript errors**: Verify all imports have proper types
- **Build failures**: Check for missing dependencies or type errors
- **Styling issues**: Ensure Tailwind classes are properly applied
- **Performance problems**: Profile canvas rendering and optimize

### Development Tips
- Use browser dev tools for canvas debugging
- Leverage TypeScript IntelliSense for API discovery
- Test with various image sizes and formats
- Monitor bundle size and performance metrics
- Use React Developer Tools for component inspection

This project aims to provide an intuitive, performant, and extensible platform for meme and GIF creation. Focus on user experience, code quality, and maintainable architecture when contributing.