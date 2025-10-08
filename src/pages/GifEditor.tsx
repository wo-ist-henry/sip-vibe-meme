import React, { useState, useRef, useEffect } from 'react'
import { Upload, Play, Download, Plus, Trash2, Settings, Type } from 'lucide-react'
import { GifFrame, GifTextElement } from '../types'
import { generateId, parseGifFrames, isGifFile, loadImage } from '../utils'

interface LocalGifFrame extends GifFrame {
  image: HTMLImageElement
}

interface GifEditorState {
  frames: LocalGifFrame[]
  textElements: GifTextElement[]
  isPlaying: boolean
  currentFrameIndex: number
  selectedFrameId: string | null
  selectedTextId: string | null
  playbackInterval: NodeJS.Timeout | null
}

const GifEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // State management
  const [state, setState] = useState<GifEditorState>({
    frames: [],
    textElements: [],
    isPlaying: false,
    currentFrameIndex: 0,
    selectedFrameId: null,
    selectedTextId: null,
    playbackInterval: null
  })
  
  const [gifSettings, setGifSettings] = useState({
    quality: 10,
    repeat: 0, // 0 = infinite
    width: 400,
    height: 300
  })

  // Derived state
  const { frames, textElements, isPlaying, currentFrameIndex, selectedFrameId, selectedTextId } = state
  const selectedFrame = frames.find(frame => frame.id === selectedFrameId)
  const selectedText = textElements.find(text => text.id === selectedTextId)

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (state.playbackInterval) {
        clearInterval(state.playbackInterval)
      }
    }
  }, [state.playbackInterval])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFrames: LocalGifFrame[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        if (isGifFile(file)) {
          // Parse GIF file to extract frames
          const gifData = await parseGifFrames(file)
          gifData.frames.forEach((frameData) => {
            newFrames.push({
              id: generateId(),
              image: frameData.image,
              delay: frameData.delay || 500
            })
          })
          
          // Update canvas size to match GIF
          setGifSettings(prev => ({
            ...prev,
            width: gifData.width,
            height: gifData.height
          }))
        } else {
          // Handle regular image files
          const img = await loadImage(file)
          newFrames.push({
            id: generateId(),
            image: img,
            delay: 500 // default 500ms
          })
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error)
        // Fall back to treating as regular image
        try {
          const img = await loadImage(file)
          newFrames.push({
            id: generateId(),
            image: img,
            delay: 500
          })
        } catch (fallbackError) {
          console.error('Failed to load image:', file.name, fallbackError)
        }
      }
    }
    
    setState(prev => ({
      ...prev,
      frames: [...prev.frames, ...newFrames]
    }))
  }

  const deleteFrame = (frameId: string) => {
    setState(prev => ({
      ...prev,
      frames: prev.frames.filter(frame => frame.id !== frameId),
      selectedFrameId: prev.selectedFrameId === frameId ? null : prev.selectedFrameId
    }))
  }

  const updateFrameDelay = (frameId: string, delay: number) => {
    setState(prev => ({
      ...prev,
      frames: prev.frames.map(frame => 
        frame.id === frameId ? { ...frame, delay } : frame
      )
    }))
  }

  const moveFrame = (frameId: string, direction: 'up' | 'down') => {
    setState(prev => {
      const currentIndex = prev.frames.findIndex(frame => frame.id === frameId)
      if (currentIndex === -1) return prev

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prev.frames.length) return prev

      const newFrames = [...prev.frames]
      const [movedFrame] = newFrames.splice(currentIndex, 1)
      newFrames.splice(newIndex, 0, movedFrame)
      
      return { ...prev, frames: newFrames }
    })
  }

  // Text management functions
  const addTextElement = () => {
    const newText: GifTextElement = {
      id: generateId(),
      text: 'Your Text Here',
      x: gifSettings.width / 2,
      y: gifSettings.height / 4,
      fontSize: 32,
      fontFamily: 'Impact',
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
      align: 'center',
      fontWeight: 'bold',
      fontStyle: 'normal',
      rotation: 0,
      opacity: 1,
      shadow: false,
      shadowColor: '#000000',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      startFrame: 0,
      endFrame: Math.max(0, frames.length - 1),
      duration: frames.length > 0 ? frames.reduce((sum, frame) => sum + frame.delay, 0) : 2000
    }
    
    setState(prev => ({
      ...prev,
      textElements: [...prev.textElements, newText],
      selectedTextId: newText.id
    }))
  }

  const updateTextElement = (textId: string, updates: Partial<GifTextElement>) => {
    setState(prev => ({
      ...prev,
      textElements: prev.textElements.map(text =>
        text.id === textId ? { ...text, ...updates } : text
      )
    }))
  }

  const deleteTextElement = (textId: string) => {
    setState(prev => ({
      ...prev,
      textElements: prev.textElements.filter(text => text.id !== textId),
      selectedTextId: prev.selectedTextId === textId ? null : prev.selectedTextId
    }))
  }

  const playPreview = () => {
    if (frames.length === 0) return

    setState(prev => ({ ...prev, isPlaying: true }))
    let frameIndex = 0
    
    const playFrame = () => {
      setState(prev => {
        if (!prev.isPlaying) return prev
        
        if (frameIndex >= prev.frames.length) {
          frameIndex = 0
        }
        
        const newState = { ...prev, currentFrameIndex: frameIndex }
        drawFrameWithText(prev.frames[frameIndex], frameIndex)
        
        const delay = prev.frames[frameIndex]?.delay || 500
        frameIndex++
        
        setTimeout(() => {
          if (prev.isPlaying) {
            playFrame()
          }
        }, delay)
        
        return newState
      })
    }
    
    playFrame()
  }

  const stopPreview = () => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentFrameIndex: 0
    }))
    
    if (frames.length > 0) {
      drawFrameWithText(frames[0], 0)
    }
  }



  const drawFrameWithText = (frame: LocalGifFrame, frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas || !frame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and draw frame
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(frame.image, 0, 0, canvas.width, canvas.height)

    // Draw text elements that should be visible on this frame
    textElements.forEach(textEl => {
      if (frameIndex >= textEl.startFrame && frameIndex <= textEl.endFrame) {
        drawTextElement(ctx, textEl)
      }
    })
  }

  const drawTextElement = (ctx: CanvasRenderingContext2D, textEl: GifTextElement) => {
    ctx.save()

    // Apply transformations
    ctx.globalAlpha = textEl.opacity
    ctx.font = `${textEl.fontStyle} ${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`
    ctx.fillStyle = textEl.color
    ctx.textAlign = textEl.align as CanvasTextAlign

    // Apply rotation if any
    if (textEl.rotation !== 0) {
      ctx.translate(textEl.x, textEl.y)
      ctx.rotate((textEl.rotation * Math.PI) / 180)
      ctx.translate(-textEl.x, -textEl.y)
    }

    // Draw shadow if enabled
    if (textEl.shadow) {
      ctx.shadowColor = textEl.shadowColor
      ctx.shadowBlur = textEl.shadowBlur
      ctx.shadowOffsetX = textEl.shadowOffsetX
      ctx.shadowOffsetY = textEl.shadowOffsetY
    }

    // Draw stroke if enabled
    if (textEl.strokeWidth > 0) {
      ctx.strokeStyle = textEl.strokeColor
      ctx.lineWidth = textEl.strokeWidth
      ctx.strokeText(textEl.text, textEl.x, textEl.y)
    }

    // Draw fill text
    ctx.fillText(textEl.text, textEl.x, textEl.y)

    ctx.restore()
  }

  // Update canvas when frames or text elements change
  useEffect(() => {
    if (frames.length > 0 && !isPlaying) {
      const frameToShow = selectedFrame || frames[currentFrameIndex] || frames[0]
      const frameIndex = frames.findIndex(f => f.id === frameToShow.id)
      drawFrameWithText(frameToShow, frameIndex)
    }
  }, [frames, textElements, selectedFrame, currentFrameIndex, isPlaying])

  const generateGif = async () => {
    if (frames.length === 0) {
      alert('Please add some frames first!')
      return
    }

    try {
      // Import gif.js dynamically
      const GIF = (await import('gif.js')).default

      // Create GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: gifSettings.quality,
        width: gifSettings.width,
        height: gifSettings.height,
        repeat: gifSettings.repeat
      })

      // Create a temporary canvas for rendering frames with text overlays
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = gifSettings.width
      tempCanvas.height = gifSettings.height
      const tempCtx = tempCanvas.getContext('2d')!

      // Process each frame
      frames.forEach((frame, frameIndex) => {
        // Clear canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
        
        // Draw the frame image
        tempCtx.drawImage(frame.image, 0, 0, tempCanvas.width, tempCanvas.height)
        
        // Draw text elements that should be visible on this frame
        textElements.forEach(textEl => {
          if (frameIndex >= textEl.startFrame && frameIndex <= textEl.endFrame) {
            drawTextElement(tempCtx, textEl)
          }
        })

        // Add frame to GIF with proper delay
        gif.addFrame(tempCanvas, { delay: frame.delay })
      })

      // Generate and download the GIF
      gif.on('finished', function(blob: Blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `animated-gif-${Date.now()}.gif`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })

      gif.on('progress', function(p: number) {
        console.log('GIF generation progress:', Math.round(p * 100) + '%')
      })

      // Start rendering
      gif.render()

    } catch (error) {
      console.error('Error generating GIF:', error)
      alert('Error generating GIF. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">GIF Editor</h1>
        <p className="text-gray-600">Create animated GIFs from your images with text overlays</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex space-x-2">
                <button
                  onClick={addTextElement}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={frames.length === 0}
                >
                  <Type className="w-4 h-4" />
                  <span>Add Text</span>
                </button>
                <button
                  onClick={isPlaying ? stopPreview : playPreview}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={frames.length === 0}
                >
                  <Play className="w-4 h-4" />
                  <span>{isPlaying ? 'Stop' : 'Play'}</span>
                </button>
                <button
                  onClick={generateGif}
                  className="btn-primary flex items-center space-x-2"
                  disabled={frames.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <span>Generate GIF</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={gifSettings.width}
                  height={gifSettings.height}
                  className="border border-gray-300 rounded-lg bg-gray-100 cursor-crosshair"
                  onClick={(e) => {
                    if (selectedText) {
                      const rect = canvasRef.current?.getBoundingClientRect()
                      if (rect) {
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        updateTextElement(selectedText.id, { x, y })
                      }
                    }
                  }}
                />
                {frames.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-gray-500">No frames added yet</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary flex items-center space-x-2 mx-auto"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Add Images or GIFs</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isPlaying && frames.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Frame {currentFrameIndex + 1} of {frames.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Text Elements */}
          {textElements.length > 0 && (
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold">Text Elements</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {textElements.map((text) => (
                  <div
                    key={text.id}
                    className={`p-2 border rounded cursor-pointer transition-colors ${
                      selectedTextId === text.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setState(prev => ({ ...prev, selectedTextId: text.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{text.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTextElement(text.id)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Frames {text.startFrame + 1}-{text.endFrame + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Properties */}
          {selectedText && (
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold">Text Properties</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text
                  </label>
                  <input
                    type="text"
                    value={selectedText.text}
                    onChange={(e) => updateTextElement(selectedText.id, { text: e.target.value })}
                    className="input-field"
                    placeholder="Enter your text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Frame
                    </label>
                    <select
                      value={selectedText.startFrame}
                      onChange={(e) => updateTextElement(selectedText.id, { startFrame: parseInt(e.target.value) })}
                      className="input-field"
                    >
                      {frames.map((_, index) => (
                        <option key={index} value={index}>Frame {index + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Frame
                    </label>
                    <select
                      value={selectedText.endFrame}
                      onChange={(e) => updateTextElement(selectedText.id, { endFrame: parseInt(e.target.value) })}
                      className="input-field"
                    >
                      {frames.map((_, index) => (
                        <option key={index} value={index}>Frame {index + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Size
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={selectedText.fontSize}
                      onChange={(e) => updateTextElement(selectedText.id, { fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center text-xs text-gray-500">{selectedText.fontSize}px</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Family
                    </label>
                    <select
                      value={selectedText.fontFamily}
                      onChange={(e) => updateTextElement(selectedText.id, { fontFamily: e.target.value })}
                      className="input-field"
                    >
                      <option value="Impact">Impact</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={selectedText.color}
                      onChange={(e) => updateTextElement(selectedText.id, { color: e.target.value })}
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stroke Color
                    </label>
                    <input
                      type="color"
                      value={selectedText.strokeColor}
                      onChange={(e) => updateTextElement(selectedText.id, { strokeColor: e.target.value })}
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Width
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={selectedText.strokeWidth}
                    onChange={(e) => updateTextElement(selectedText.id, { strokeWidth: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-gray-500">{selectedText.strokeWidth}px</div>
                </div>
              </div>
            </div>
          )}

          {/* Frames Management */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Frames</h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Images</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFrameId === frame.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setState(prev => ({ ...prev, selectedFrameId: frame.id, currentFrameIndex: index }))
                    if (!isPlaying) {
                      drawFrameWithText(frame, index)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Frame {index + 1}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{frame.delay}ms</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFrame(frame.id)
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveFrame(frame.id, 'up')
                      }}
                      disabled={index === 0}
                      className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        moveFrame(frame.id, 'down')
                      }}
                      disabled={index === frames.length - 1}
                      className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.gif"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Frame Properties */}
          {selectedFrame && (
            <div className="card space-y-4">
              <h3 className="text-lg font-semibold">Frame Properties</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frame Delay (ms)
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={selectedFrame.delay}
                  onChange={(e) => updateFrameDelay(selectedFrame.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100ms</span>
                  <span>{selectedFrame.delay}ms</span>
                  <span>2000ms</span>
                </div>
              </div>
            </div>
          )}

          {/* GIF Settings */}
          <div className="card space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <h3 className="text-lg font-semibold">GIF Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="800"
                    value={gifSettings.width}
                    onChange={(e) => setGifSettings({...gifSettings, width: parseInt(e.target.value) || 400})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="600"
                    value={gifSettings.height}
                    onChange={(e) => setGifSettings({...gifSettings, height: parseInt(e.target.value) || 300})}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality (1-20)
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={gifSettings.quality}
                  onChange={(e) => setGifSettings({...gifSettings, quality: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Best Quality</span>
                  <span>{gifSettings.quality}</span>
                  <span>Smallest Size</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loop Count (0 = infinite)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gifSettings.repeat}
                  onChange={(e) => setGifSettings({...gifSettings, repeat: parseInt(e.target.value) || 0})}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GifEditor