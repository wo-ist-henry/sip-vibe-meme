import React, { useState, useRef } from 'react'
import { Upload, Play, Download, Plus, Trash2, Settings } from 'lucide-react'

interface GifFrame {
  id: string
  image: HTMLImageElement
  delay: number // in milliseconds
}

const GifEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frames, setFrames] = useState<GifFrame[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [gifSettings, setGifSettings] = useState({
    quality: 10,
    repeat: 0, // 0 = infinite
    width: 400,
    height: 300
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file, index) => {
      const img = new Image()
      img.onload = () => {
        const newFrame: GifFrame = {
          id: `${Date.now()}-${index}`,
          image: img,
          delay: 500 // default 500ms
        }
        setFrames(prev => [...prev, newFrame])
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const deleteFrame = (frameId: string) => {
    setFrames(frames.filter(frame => frame.id !== frameId))
    if (selectedFrameId === frameId) {
      setSelectedFrameId(null)
    }
  }

  const updateFrameDelay = (frameId: string, delay: number) => {
    setFrames(frames.map(frame => 
      frame.id === frameId ? { ...frame, delay } : frame
    ))
  }

  const moveFrame = (frameId: string, direction: 'up' | 'down') => {
    const currentIndex = frames.findIndex(frame => frame.id === frameId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= frames.length) return

    const newFrames = [...frames]
    const [movedFrame] = newFrames.splice(currentIndex, 1)
    newFrames.splice(newIndex, 0, movedFrame)
    setFrames(newFrames)
  }

  const playPreview = () => {
    if (frames.length === 0) return

    setIsPlaying(true)
    let frameIndex = 0
    
    const playFrame = () => {
      if (frameIndex >= frames.length) {
        frameIndex = 0
      }
      
      setCurrentFrameIndex(frameIndex)
      drawFrame(frames[frameIndex])
      
      const delay = frames[frameIndex]?.delay || 500
      frameIndex++
      
      setTimeout(() => {
        if (isPlaying) {
          playFrame()
        }
      }, delay)
    }
    
    playFrame()
  }

  const stopPreview = () => {
    setIsPlaying(false)
    setCurrentFrameIndex(0)
    if (frames.length > 0) {
      drawFrame(frames[0])
    }
  }

  const drawFrame = (frame: GifFrame) => {
    const canvas = canvasRef.current
    if (!canvas || !frame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(frame.image, 0, 0, canvas.width, canvas.height)
  }

  const generateGif = async () => {
    if (frames.length === 0) {
      alert('Please add some frames first!')
      return
    }

    // This would integrate with a GIF generation library like gif.js
    // For now, we'll show a placeholder
    alert('GIF generation feature coming soon! For now, you can preview your animation.')
  }

  const selectedFrame = frames.find(frame => frame.id === selectedFrameId)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">GIF Editor</h1>
        <p className="text-gray-600">Create animated GIFs from your images</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex space-x-2">
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
                  className="border border-gray-300 rounded-lg bg-gray-100"
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
                        <span>Add Images</span>
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

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFrameId === frame.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedFrameId(frame.id)
                    if (!isPlaying) {
                      setCurrentFrameIndex(index)
                      drawFrame(frame)
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
              accept="image/*"
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