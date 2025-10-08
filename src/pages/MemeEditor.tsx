import React, { useState, useRef, useEffect } from 'react'
import { Upload, Type, Download, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
  align: 'left' | 'center' | 'right'
  fontWeight: 'normal' | 'bold'
  stroke: boolean
  strokeColor: string
}

const MemeEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 400 })
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false)
  const [draggedTextId, setDraggedTextId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const fonts = ['Arial', 'Impact', 'Helvetica', 'Georgia', 'Times New Roman', 'Comic Sans MS']
  const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']

  useEffect(() => {
    drawCanvas()
  }, [image, textElements, isDragging, draggedTextId, selectedTextId])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setCanvasSize({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const addTextElement = () => {
    const newId = Date.now().toString()
    const newTextElement: TextElement = {
      id: newId,
      text: 'Your Text Here',
      x: canvasSize.width / 2,
      y: canvasSize.height / 4,
      fontSize: 32,
      color: '#ffffff',
      fontFamily: 'Impact',
      align: 'center',
      fontWeight: 'bold',
      stroke: true,
      strokeColor: '#000000'
    }
    setTextElements([...textElements, newTextElement])
    setSelectedTextId(newId)
  }

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(textElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  const deleteTextElement = (id: string) => {
    setTextElements(textElements.filter(el => el.id !== id))
    if (selectedTextId === id) {
      setSelectedTextId(null)
    }
  }

  // Helper function to get canvas coordinates from mouse event
  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    }
  }

  // Helper function to check if a point is inside a text element
  const getTextElementAt = (x: number, y: number): TextElement | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Check text elements in reverse order (top to bottom)
    for (let i = textElements.length - 1; i >= 0; i--) {
      const textEl = textElements[i]
      
      // Set font to measure text
      ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`
      ctx.textAlign = textEl.align
      
      const textMetrics = ctx.measureText(textEl.text)
      const textWidth = textMetrics.width
      const textHeight = textEl.fontSize
      
      // Calculate text bounds based on alignment
      let textLeft = textEl.x
      let textTop = textEl.y - textHeight
      let textRight = textEl.x + textWidth
      let textBottom = textEl.y
      
      if (textEl.align === 'center') {
        textLeft = textEl.x - textWidth / 2
        textRight = textEl.x + textWidth / 2
      } else if (textEl.align === 'right') {
        textLeft = textEl.x - textWidth
        textRight = textEl.x
      }
      
      // Add some padding for easier clicking
      const padding = 5
      textLeft -= padding
      textTop -= padding
      textRight += padding
      textBottom += padding
      
      if (x >= textLeft && x <= textRight && y >= textTop && y <= textBottom) {
        return textEl
      }
    }
    
    return null
  }

  // Mouse event handlers for drag and drop
  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event)
    const textElement = getTextElementAt(coords.x, coords.y)
    
    if (textElement) {
      setIsDragging(true)
      setDraggedTextId(textElement.id)
      setSelectedTextId(textElement.id)
      setDragOffset({
        x: coords.x - textElement.x,
        y: coords.y - textElement.y
      })
      
      // Change cursor to indicate dragging
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing'
      }
    }
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event)
    
    if (isDragging && draggedTextId) {
      // Update the position of the dragged text element
      const newX = coords.x - dragOffset.x
      const newY = coords.y - dragOffset.y
      
      updateTextElement(draggedTextId, { x: newX, y: newY })
    } else {
      // Change cursor when hovering over text elements
      const textElement = getTextElementAt(coords.x, coords.y)
      if (canvasRef.current) {
        canvasRef.current.style.cursor = textElement ? 'grab' : 'default'
      }
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setDraggedTextId(null)
    setDragOffset({ x: 0, y: 0 })
    
    // Reset cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default'
    }
  }

  const handleCanvasMouseLeave = () => {
    // Stop dragging if mouse leaves canvas
    if (isDragging) {
      handleCanvasMouseUp()
    }
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image if present
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    } else {
      // Draw placeholder background
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#9ca3af'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Upload an image to start', canvas.width / 2, canvas.height / 2)
    }

    // Draw text elements
    textElements.forEach(textEl => {
      ctx.font = `${textEl.fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`
      ctx.fillStyle = textEl.color
      ctx.textAlign = textEl.align
      
      // Add visual feedback for selected or dragged text
      const isBeingDragged = isDragging && draggedTextId === textEl.id
      const isSelected = selectedTextId === textEl.id
      
      if (isBeingDragged || isSelected) {
        // Draw selection outline
        ctx.save()
        const textMetrics = ctx.measureText(textEl.text)
        const textWidth = textMetrics.width
        const textHeight = textEl.fontSize
        
        let textLeft = textEl.x
        let textTop = textEl.y - textHeight
        let textRight = textEl.x + textWidth
        let textBottom = textEl.y
        
        if (textEl.align === 'center') {
          textLeft = textEl.x - textWidth / 2
          textRight = textEl.x + textWidth / 2
        } else if (textEl.align === 'right') {
          textLeft = textEl.x - textWidth
          textRight = textEl.x
        }
        
        // Draw selection rectangle
        ctx.strokeStyle = isBeingDragged ? '#3b82f6' : '#6b7280'
        ctx.lineWidth = 2
        ctx.setLineDash(isBeingDragged ? [5, 5] : [])
        ctx.strokeRect(textLeft - 3, textTop - 3, textWidth + 6, textHeight + 6)
        ctx.restore()
      }
      
      if (textEl.stroke) {
        ctx.strokeStyle = textEl.strokeColor
        ctx.lineWidth = 2
        ctx.strokeText(textEl.text, textEl.x, textEl.y)
      }
      
      ctx.fillText(textEl.text, textEl.x, textEl.y)
    })
  }

  const downloadMeme = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const selectedText = textElements.find(el => el.id === selectedTextId)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Meme Editor</h1>
        <p className="text-gray-600">Create hilarious memes with custom text and styling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas Area */}
        <div className="lg:col-span-2">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Canvas</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
                <button
                  onClick={downloadMeme}
                  className="btn-primary flex items-center space-x-2"
                  disabled={!image && textElements.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="border border-gray-300 rounded-lg max-w-full h-auto"
                style={{ maxHeight: '600px' }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseLeave}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Text Controls */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Text Elements</h3>
              <button
                onClick={addTextElement}
                className="btn-primary flex items-center space-x-2"
              >
                <Type className="w-4 h-4" />
                <span>Add Text</span>
              </button>
            </div>

            <div className="space-y-3">
              {textElements.map((textEl) => (
                <div
                  key={textEl.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTextId === textEl.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTextId(textEl.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {textEl.text || 'Empty Text'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTextElement(textEl.id)
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                      Font Size
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="72"
                      value={selectedText.fontSize}
                      onChange={(e) => updateTextElement(selectedText.id, { fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{selectedText.fontSize}px</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Family
                    </label>
                    <select
                      value={selectedText.fontFamily}
                      onChange={(e) => updateTextElement(selectedText.id, { fontFamily: e.target.value })}
                      className="input-field text-sm"
                    >
                      {fonts.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex space-x-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => updateTextElement(selectedText.id, { color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedText.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedText.fontWeight === 'bold'}
                      onChange={(e) => updateTextElement(selectedText.id, { 
                        fontWeight: e.target.checked ? 'bold' : 'normal' 
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Bold</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedText.stroke}
                      onChange={(e) => updateTextElement(selectedText.id, { stroke: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Outline</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Alignment
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'left' as const, icon: AlignLeft },
                      { value: 'center' as const, icon: AlignCenter },
                      { value: 'right' as const, icon: AlignRight }
                    ].map(({ value, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => updateTextElement(selectedText.id, { align: value })}
                        className={`p-2 rounded-lg border ${
                          selectedText.align === value 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemeEditor