import React, { useState } from 'react'
import { Search, Filter, Heart, Download, Share2 } from 'lucide-react'

interface MemeItem {
  id: string
  title: string
  image: string
  author: string
  likes: number
  category: string
  createdAt: string
}

const Gallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Mock data - in a real app, this would come from an API
  const mockMemes: MemeItem[] = [
    {
      id: '1',
      title: 'Classic Drake Meme',
      image: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Drake+Meme',
      author: 'MemeCreator2024',
      likes: 1234,
      category: 'classic',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Distracted Boyfriend',
      image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Distracted+BF',
      author: 'ViralMaster',
      likes: 987,
      category: 'reaction',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Woman Yelling at Cat',
      image: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Cat+Meme',
      author: 'FunnyGuy123',
      likes: 2156,
      category: 'animals',
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'This is Fine Dog',
      image: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=This+is+Fine',
      author: 'ChaosMemer',
      likes: 1789,
      category: 'reaction',
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Galaxy Brain',
      image: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Galaxy+Brain',
      author: 'BigBrainTime',
      likes: 856,
      category: 'smart',
      createdAt: '2024-01-11'
    },
    {
      id: '6',
      title: 'Surprised Pikachu',
      image: 'https://via.placeholder.com/300x300/F97316/FFFFFF?text=Pikachu',
      author: 'PokemonFan',
      likes: 3421,
      category: 'reaction',
      createdAt: '2024-01-10'
    }
  ]

  const categories = [
    { value: 'all', label: 'All Memes' },
    { value: 'classic', label: 'Classic' },
    { value: 'reaction', label: 'Reaction' },
    { value: 'animals', label: 'Animals' },
    { value: 'smart', label: 'Smart' },
    { value: 'funny', label: 'Funny' }
  ]

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'liked', label: 'Most Liked' }
  ]

  const filteredMemes = mockMemes
    .filter(meme => {
      const matchesSearch = meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meme.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || meme.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'liked':
          return b.likes - a.likes
        default:
          return b.likes - a.likes // Default to popular (most liked)
      }
    })

  const handleLike = (memeId: string) => {
    // In a real app, this would update the backend
    console.log(`Liked meme ${memeId}`)
  }

  const handleDownload = (meme: MemeItem) => {
    // In a real app, this would download the actual image
    console.log(`Downloading ${meme.title}`)
  }

  const handleShare = (meme: MemeItem) => {
    // In a real app, this would open share options
    if (navigator.share) {
      navigator.share({
        title: meme.title,
        text: `Check out this meme: ${meme.title}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${meme.title} - ${window.location.href}`)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Meme Gallery</h1>
        <p className="text-gray-600">Discover and share the best memes from our community</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field min-w-0"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field min-w-0"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredMemes.length} meme{filteredMemes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Memes Grid */}
      {filteredMemes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No memes found matching your criteria</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemes.map((meme) => (
            <div key={meme.id} className="card group hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                {/* Meme Image */}
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={meme.image}
                    alt={meme.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleLike(meme.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Like"
                    >
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                    <button
                      onClick={() => handleDownload(meme)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleShare(meme)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5 text-blue-500" />
                    </button>
                  </div>
                </div>

                {/* Meme Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {meme.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>by {meme.author}</span>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{meme.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                      {meme.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(meme.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredMemes.length > 0 && (
        <div className="text-center">
          <button className="btn-secondary">
            Load More Memes
          </button>
        </div>
      )}
    </div>
  )
}

export default Gallery