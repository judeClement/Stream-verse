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
        <div className=''>
            <div className=''>
            <Navbar/>
            </div>
            <div className='bg-black mt-19'>
            <FeaturedContent/>
            </div>
            <div className='bg-'>
            <section className="p-4">
                {error && <p className="text-red-500">{error}</p>}
                
                <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-4 text-black mt-6 ml-6 border-b-4 border-green-600 inline-block pb-1">Popular Movies</h3>
                    <MovieSlider movies={popularMovies} />
                </div>

                <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-4 text-black mt-6 ml-6 border-b-4 border-green-600 inline-block pb-1">Trending Now</h3>
                    <MovieSlider movies={trendingMovies} />
                </div>

                <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-4 text-black mt-6 ml-6 border-b-4 border-green-600 inline-block pb-1">Featured</h3>
                    <MovieSlider movies={featuredMovies} />
                </div>
            </section>
            </div>
            <Footer />
        </div>
    );
};

export default Home;