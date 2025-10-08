import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import MemeEditor from './pages/MemeEditor'
import GifEditor from './pages/GifEditor'
import Gallery from './pages/Gallery'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meme-editor" element={<MemeEditor />} />
          <Route path="/gif-editor" element={<GifEditor />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
    </div>
  )
}

export default App