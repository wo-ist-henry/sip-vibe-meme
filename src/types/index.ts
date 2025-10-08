// Common types used throughout the application

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export interface MemeTemplate {
  id: string
  name: string
  image: string
  category: string
  textAreas: TextArea[]
}

export interface TextArea {
  id: string
  x: number
  y: number
  width: number
  height: number
  placeholder: string
}

export interface MemeCreation {
  id: string
  title: string
  image: string
  template?: MemeTemplate
  textElements: TextElement[]
  author: User
  likes: number
  downloads: number
  tags: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  strokeColor: string
  strokeWidth: number
  align: 'left' | 'center' | 'right'
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  rotation: number
  opacity: number
  shadow: boolean
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
}

export interface GifFrame {
  id: string
  image: HTMLImageElement | string
  delay: number
  transition?: TransitionEffect
}

export interface TransitionEffect {
  type: 'fade' | 'slide' | 'zoom' | 'none'
  duration: number
  direction?: 'left' | 'right' | 'up' | 'down'
}

export interface GifSettings {
  width: number
  height: number
  quality: number
  repeat: number
  fps: number
  dithering: boolean
}

export interface FilterEffect {
  id: string
  name: string
  type: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sepia' | 'grayscale'
  value: number
  enabled: boolean
}

export interface CanvasSettings {
  width: number
  height: number
  backgroundColor: string
  backgroundImage?: string
  quality: number
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'gif' | 'webp'
  quality: number
  scale: number
  watermark: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Event types
export interface CanvasEvent {
  type: 'click' | 'drag' | 'resize' | 'select'
  target: TextElement | null
  position: { x: number; y: number }
  data?: any
}