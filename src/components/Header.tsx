import React from 'react'
import { Link } from 'react-router-dom'
import { ImageIcon, Zap, Image } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Sip Vibe Meme
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/meme-editor" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Meme Editor</span>
            </Link>
            <Link 
              to="/gif-editor" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>GIF Editor</span>
            </Link>
            <Link 
              to="/gallery" 
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Image className="w-4 h-4" />
              <span>Gallery</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/meme-editor" className="btn-primary">
              Create Meme
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header