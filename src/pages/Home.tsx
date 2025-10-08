import React from 'react'
import { Link } from 'react-router-dom'
import { ImageIcon, Zap, Image, Sparkles, Download, Share } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: ImageIcon,
      title: 'Meme Creator',
      description: 'Create hilarious memes with custom text, fonts, and styling options.',
      link: '/meme-editor',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'GIF Editor',
      description: 'Transform images into animated GIFs with effects and transitions.',
      link: '/gif-editor',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Image,
      title: 'Gallery',
      description: 'Browse and discover amazing memes created by our community.',
      link: '/gallery',
      color: 'from-orange-500 to-red-600'
    }
  ]

  const benefits = [
    {
      icon: Sparkles,
      title: 'Easy to Use',
      description: 'Intuitive drag-and-drop interface for effortless meme creation.'
    },
    {
      icon: Download,
      title: 'High Quality Export',
      description: 'Download your creations in high resolution for any platform.'
    },
    {
      icon: Share,
      title: 'Share Instantly',
      description: 'Share your memes directly to social media with one click.'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Create Epic{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Memes & GIFs
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Turn your ideas into viral content with our powerful meme and GIF creation tools. 
            No design skills required!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/meme-editor" className="btn-primary text-lg px-8 py-3">
            Start Creating Memes
          </Link>
          <Link to="/gif-editor" className="btn-secondary text-lg px-8 py-3">
            Make GIFs
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Link
              key={index}
              to={feature.link}
              className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-2xl p-8 md:p-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Sip Vibe Meme?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make meme creation fun, fast, and effortless for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Go Viral?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are already making amazing content with our tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/meme-editor" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
              Create Your First Meme
            </Link>
            <Link to="/gallery" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home