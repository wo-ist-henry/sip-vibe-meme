// Utility functions for the application

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function to limit the rate of function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Download a file from a blob or data URL
 */
export const downloadFile = (data: string | Blob, filename: string): void => {
  const url = typeof data === 'string' ? data : URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  if (typeof data !== 'string') {
    URL.revokeObjectURL(url)
  }
}

/**
 * Convert a canvas to a blob
 */
export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality?: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

/**
 * Load an image from a URL or file
 */
export const loadImage = (src: string | File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    
    if (typeof src === 'string') {
      img.src = src
    } else {
      img.src = URL.createObjectURL(src)
    }
  })
}

/**
 * Resize an image while maintaining aspect ratio
 */
export const resizeImage = (
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = img.width / img.height
  
  let { width, height } = img
  
  if (width > maxWidth) {
    width = maxWidth
    height = width / aspectRatio
  }
  
  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }
  
  return { width, height }
}

/**
 * Get the center point of an element
 */
export const getCenter = (element: { x: number; y: number; width?: number; height?: number }) => {
  return {
    x: element.x + (element.width || 0) / 2,
    y: element.y + (element.height || 0) / 2
  }
}

/**
 * Calculate distance between two points
 */
export const getDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  
  return 'just now'
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

/**
 * Check if the browser supports a feature
 */
export const supports = {
  webp: (): boolean => {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').indexOf('webp') > -1
  },
  clipboard: (): boolean => {
    return 'clipboard' in navigator
  },
  share: (): boolean => {
    return 'share' in navigator
  },
  webgl: (): boolean => {
    try {
      const canvas = document.createElement('canvas')
      return !!(
        canvas.getContext('webgl') || 
        canvas.getContext('experimental-webgl')
      )
    } catch (e) {
      return false
    }
  }
}

/**
 * Get random item from array
 */
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Parse GIF file and extract frames using omggif
 */
export const parseGifFrames = (file: File): Promise<{
  frames: { image: HTMLImageElement; delay: number }[]
  width: number
  height: number
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        
        // Check if it's a GIF file
        const header = String.fromCharCode(...uint8Array.slice(0, 6))
        if (header !== 'GIF87a' && header !== 'GIF89a') {
          reject(new Error('Not a valid GIF file'))
          return
        }

        // Use omggif to parse the GIF
        const { GifReader } = await import('omggif')
        
        try {
          const reader = new GifReader(uint8Array)
          const frames: { image: HTMLImageElement; delay: number }[] = []
          
          // Create canvas for frame extraction
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = reader.width
          canvas.height = reader.height
          
          // Extract all frames
          for (let i = 0; i < reader.numFrames(); i++) {
            const frameInfo = reader.frameInfo(i)
            const imageData = ctx.createImageData(reader.width, reader.height)
            
            // Decode frame
            reader.decodeAndBlitFrameRGBA(i, imageData.data)
            
            // Draw to canvas
            ctx.putImageData(imageData, 0, 0)
            
            // Create image from canvas
            const frameImage = new Image()
            const framePromise = new Promise<void>((resolveFrame) => {
              frameImage.onload = () => resolveFrame()
            })
            
            frameImage.src = canvas.toDataURL()
            await framePromise
            
            frames.push({
              image: frameImage,
              delay: (frameInfo.delay || 10) * 10 // Convert to milliseconds (GIF uses centiseconds)
            })
          }
          
          resolve({
            frames,
            width: reader.width,
            height: reader.height
          })
          
        } catch (parseError) {
          console.warn('Failed to parse GIF with omggif, falling back to single frame:', parseError)
          // Fallback to single frame approach
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            
            const frameImg = new Image()
            frameImg.onload = () => {
              resolve({
                frames: [{ image: frameImg, delay: 500 }],
                width: img.width,
                height: img.height
              })
            }
            frameImg.src = canvas.toDataURL()
          }
          img.onerror = () => reject(new Error('Failed to load GIF'))
          img.src = URL.createObjectURL(file)
        }
        
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Check if file is a GIF
 */
export const isGifFile = (file: File): boolean => {
  return file.type === 'image/gif'
}