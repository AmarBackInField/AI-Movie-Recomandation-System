import React, { useState, useEffect } from 'react';
import { Search, Film, Heart, Star, TrendingUp } from 'lucide-react';
const MovieLanding = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data)

      setMovies(data.movies || []);
    } catch (error) {
      console.error('Error:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="container">
      {/* Animated Background */}
      <div 
        className="background"
        style={{
          // background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, #FFE4B5 0%, transparent 10%),
                      // radial-gradient(circle at ${70 - mousePosition.x * 25}% ${30 - mousePosition.y * 20}%, #4444ff22 0%, transparent 50%),
                      // radial-gradient(circle at ${30 + mousePosition.x * 20}% ${70 + mousePosition.y * 20}%, #44ff4422 0%, transparent 50%)`
        }}
      />

      {/* Content Container */}
      <div className="content">
        {/* Navigation */}
        <nav className="navbar">
          <a href="/" className="logo">
            <Film className="spin-animation" />
            <span>MovieMind</span>
          </a>
          
          <div className="nav-buttons">
            <button className="nav-button">Features</button>
            <button className="nav-button">How it Works</button>
            <button className="nav-button primary">Get Started</button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className={`hero ${isVisible ? 'visible' : ''}`}>
          <h1 className="hero-title">
            Discover Your Next Favorite Movie
          </h1>
          <p className="hero-subtitle">
            Our AI-powered recommendation system learns your taste and suggests movies you'll love. 
          </p>
          <p className="theeme">Stop Scrolling, Start Watching </p>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <h3>Let AI Pick Your Next Movie</h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="What kind of movie are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? '...' : <Search />}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {movies.length > 0 && (
          <section className="results-section">
            <h3>Recommended Movies</h3>
            <div className="movie-grid">
              {movies.map((movie, index) => (
                <div key={index} className="movie-card">
                  <img 
                    src={movie.poster} 
                    alt={movie.name} 
                    className="movie-poster"
                  />
                  <h4>{movie.name}</h4>
                  <p><strong>Genres:</strong> {movie.genres}</p>
                  <p><strong>Language:</strong> {movie.language}</p>
                  <div className="movie-links">
                    <a 
                      href={movie.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="movie-link info"
                    >
                      More Info
                    </a>
                    <a 
                      href={movie.download} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="movie-link download"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="features-section">
          <h2>Why Choose MovieMind?</h2>
          <div className="features-grid">
            {[
              {
                icon: <TrendingUp size={32} color="#ff4444" />,
                title: "Smart Predictions",
                description: "Our AI analyzes your watching history to predict movies you'll enjoy with high accuracy."
              },
              {
                icon: <Heart size={32} color="#ff4444" />,
                title: "Personalized For You",
                description: "Get recommendations based on your unique taste, mood, and preferred genres."
              },
              {
                icon: <Star size={32} color="#ff4444" />,
                title: "Curated Collections",
                description: "Discover hand-picked movie collections and themed recommendations."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`feature-card ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <Film className="spin-animation" />
            <span>© Made By Amar Choudhary</span>
          </div>
        </footer>
      </div>

      <style>
        {`
          /* Base Reset */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          /* Container & Background */
          .container {
            min-height: 100vh;
            background: #000000;
            color: #ffffff;
            font-family: system-ui, -apple-system, sans-serif;
            position: relative;
            overflow: hidden;
          }
          
          .background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            opacity: 0.8;
            transition: background 0.5s ease;
          }
          
          .content {
            position: relative;
            z-index: 2;
          }
          
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          
          @keyframes blink {
            50% { border-color: transparent; }
          }
          
          .theeme {
            font-size: 1.5rem;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            border-right: 3px solid black; /* Simulating cursor */
            width: 0;
            display: inline-block;
            animation: typing 2s steps(30, end) forwards, blink 0.5s step-end infinite alternate;
          }
          /* Navbar Styles */
.navbar {
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background 0.3s ease;
}

.navbar:hover {
  background: rgba(0, 0, 0, 0.8);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff4b5c;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.3s ease, color 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
  color: #ff6b6b;
}

.logo-icon {
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 75, 92, 0.5));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.nav-buttons {
  display: flex;
  gap: 1.2rem;
}

.nav-button {
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.3s ease;
  border-radius: 6px;
}

.nav-button:hover::before {
  left: 0;
}

.nav-button:hover {
  color: #ff6b6b;
}

.nav-button.primary {
  background: linear-gradient(45deg, #ff4b5c, #ff6b6b);
  box-shadow: 0 0 15px rgba(255, 75, 92, 0.4);
  color: #fff;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.nav-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(255, 75, 92, 0.6);
}

.nav-button.primary:active {
  transform: translateY(1px);
  box-shadow: 0 5px 10px rgba(255, 75, 92, 0.5);
}

          /* Hero Section */
          .hero {
            padding: 6rem 1rem;
            text-align: center;
            max-width: 800px;
            margin: 2rem auto;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            transform: translateY(30px);
            opacity: 0;
            transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hero.visible {
            transform: translateY(0);
            opacity: 1;
          }
          
          .hero-title {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            font-weight: bold;
            background: linear-gradient(45deg, #ff4444, #ff8866, #ff4444);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradient 3s linear infinite;
          }
          
          .hero-subtitle {
            font-size: 1.25rem;
            color: #cccccc;
            margin-bottom: 2rem;
            animation: fadeIn 1s ease-out 0.5s forwards;
            opacity: 0;
          }
          
          /* Search Section */
          .search-section {
            max-width: 800px;
            margin: 0 auto 4rem;
            padding: 2rem;
            background: rgba(34,34,34,0.8);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(255,68,68,0.1);
          }
          
          .search-container {
            display: flex;
            max-width: 600px;
            margin: 1rem auto;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
          }
          
          .search-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          
          .search-input {
            flex: 1;
            padding: 1rem;
            border: none;
            background: transparent;
            color: white;
            font-size: 1rem;
            outline: none;
          }
          
          .search-input::placeholder {
            color: rgba(255,255,255,0.5);
          }
          
          .search-button {
            padding: 1rem;
            background: linear-gradient(45deg, #ff4444, #ff6b6b);
            border: none;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .search-button:hover {
            transform: scale(1.1);
          }
          
          /* Movie Grid */
          .movie-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }
          
          .movie-card {
            background: rgba(34,34,34,0.8);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.5s forwards;
          }
          
          .movie-poster-container {
            position: relative;
            overflow: hidden;
          }
          
          .movie-poster {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          .movie-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.9));
            padding: 1rem;
            transform: translateY(100%);
            transition: transform 0.3s ease;
          }
          
          .movie-poster-container:hover .movie-poster {
            transform: scale(1.1);
          }
          
          .movie-poster-container:hover .movie-overlay {
            transform: translateY(0);
          }
          
          .movie-links {
            display: flex;
            gap: 1rem;
            padding: 1rem;
          }
          
          .movie-link {
            flex: 1;
            padding: 0.5rem 1rem;
            text-align: center;
            border-radius: 4px;
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
          }
          
          .movie-link.info {
            background: linear-gradient(45deg, #ff4444, #ff6b6b);
            color: white;
          }
          
          .movie-link.download {
            background: linear-gradient(45deg, #44ff44, #6bff6b);
            color: white;
          }
          
          .movie-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          }
          
          /* Features Section */
          .features-section {
            padding: 4rem 1rem;
            background: rgba(26,26,26,0.7);
            backdrop-filter: blur(10px);
            text-align: center;
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 2rem auto 0;
          }
          
          .feature-card {
            background: rgba(34,34,34,0.8);
            padding: 2rem;
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(255,68,68,0.1);
          }
          
          .feature-icon {
            color: #ff4444;
            margin-bottom: 1rem;
            transition: transform 0.3s ease;
          }
          
          .feature-card:hover .feature-icon {
            transform: scale(1.2) rotate(5deg);
          }
          
          /* Footer */
          .footer {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 2rem;
            text-align: center;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
          }
          
          .footer-content {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            color: rgba(255,255,255,0.6);
          }
          
          /* Animations */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          /* Loader Animation */
          .loader {
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-bottom-color: transparent;
            border-radius: 50%;
            animation: rotate 1s linear infinite;
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem;
            }
          
            .nav-buttons {
              display: none;
            }
          
            .search-container {
              flex-direction: column;
            }
          
            .search-button {
              width: 100%;
            }
          
            .features-grid {
              grid-template-columns: 1fr;
            }
          }
          
          /* Utility Classes */
          .gradient-text {
            background: linear-gradient(45deg, #ff4444, #ff8866);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          
          .float-effect {
            animation: float 6s ease-in-out infinite;
          }
          
          .slide-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default MovieLanding;