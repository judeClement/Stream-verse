import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import MovieSlider from '../components/NavBar/MovieSlider';
import FeaturedContent from '../components/FeaturedContent';
import Navbar from './Navbar.jsx';

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [error, setError] = useState(null);

    const API_KEY = 'fed8bdfdab036c276017de82f5ae9589';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Fetch Popular Movies
                const popularResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
                );
                setPopularMovies(popularResponse.data.results);

                // Fetch Trending Movies
                const trendingResponse = await axios.get(
                    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
                );
                setTrendingMovies(trendingResponse.data.results);

                // Fetch Featured Movies (Using Top Rated as Featured Example)
                const featuredResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
                );
                setFeaturedMovies(featuredResponse.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Unable to fetch movies. Please check your API key or network connection.');
            }
        };

        fetchMovies();
    }, []);

    return (
        <div>
            <div className='bg-blue-200'>
            <Navbar/>
            </div>
            <div className='bg-red-200 mt-19'>
            <FeaturedContent/>
            </div>
            <div className='bg-'>
            <section className="p-4">
                {error && <p className="text-red-500">{error}</p>}
                
                <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-4">Popular Movies</h3>
                    <MovieSlider movies={popularMovies} />
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-4">Trending Now</h3>
                    <MovieSlider movies={trendingMovies} />
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-4">Featured</h3>
                    <MovieSlider movies={featuredMovies} />
                </div>
            </section>
            </div>
            <Footer />
        </div>
    );
};

export default Home;