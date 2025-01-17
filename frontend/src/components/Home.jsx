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





// import React from 'react';
// import NavBar from './NavBar/NavBar';

// const Home = () => {
//   // Inline styles
//   const styles = {
//     home: {
//       color: 'white',
//       backgroundColor: '#141414',
//       minHeight: '100vh',
//       padding: '20px',
//     },
//     navbar: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px',
//       backgroundColor: '#141414',
//     },
//     logo: {
//       width: '100px', // Adjust logo size
//     },
//     button: {
//       backgroundColor: '#00b300', // Green color for buttons
//       color: 'white',
//       border: 'none',
//       padding: '10px 20px',
//       cursor: 'pointer',
//     },
//     banner: {
//       position: 'relative',
//       height: '448px', // Adjust height as needed
//       backgroundImage: 'url(https://image.tmdb.org/t/p/original/banner_image_url.jpg)', // Background image
//       backgroundSize: 'cover',
//     },
//     bannerContents: {
//       position: 'absolute',
//       bottom: '60px', // Positioning
//       left: '30px', // Positioning
//     },
//     bannerTitle: {
//       fontSize: '3rem', // Adjust title size
//     },
//     bannerDescription: {
//       width: '45%',
//     },
//     row: {
//       marginTop: '20px', // Adjust margin
//     },
//     rowPosters: {
//       display: 'flex', // Flexbox for horizontal layout
//     },
//     rowPoster: {
//       width: '100%', // Adjust width
//       marginRight: '10px', // Space between posters
//     },
//   };

//   return (
//     <div style={styles.home}>
//       {/* <NavBar/> */}
//       {/* Navigation Bar */}
//       <nav style={styles.navbar}>
//         <img 
//           style={styles.logo} 
//           src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
//           alt="Netflix Logo" 
//         />
//         <button style={styles.button}>Sign In</button>
//       </nav>

//       {/* Banner */}
//       <header style={styles.banner}>
//         <div style={styles.bannerContents}>
//           <h1 style={styles.bannerTitle}>Movie Title</h1>
//           <div>
//             <button style={styles.button}>Play</button>
//             <button style={styles.button}>My List</button>
//           </div>
//           <h1 style={styles.bannerDescription}>
//             This is the description of the movie. It is an awesome movie that you should watch!
//           </h1>
//         </div>
//         <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundImage: 'linear-gradient(to top, rgba(37,37,37,0.9), rgba(37,37,37,0))' }} />
//       </header>

//       {/* Movie Rows */}
      
//      <div>
//       {/* Trending Now Row */}
//       <div style={styles.row}>
//         <h2>Trending Now</h2>
//         <div style={styles.rowPosters}>
//           {/* Example movie posters */}
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_1.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_2.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_3.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_4.jpg" alt="" />
//         </div>
//       </div>

//       {/* New Releases Row */}
//       <div style={styles.row}>
//         <h2>New Releases</h2>
//         <div style={styles.rowPosters}>
//           {/* Example new release posters */}
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_5.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_6.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_7.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_8.jpg" alt="" />
//         </div>
//       </div>

//       {/* Popular on Netflix Row */}
//       <div style={styles.row}>
//         <h2>Popular on Netflix</h2>
//         <div style={styles.rowPosters}>
//           {/* Example popular posters */}
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_9.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_10.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_11.jpg" alt="" />
//           <img style={styles.rowPoster} src="https://image.tmdb.org/t/p/w500/movie_image_url_12.jpg" alt="" />
//         </div>
//       </div>
//     </div> 

//     </div>
//   );
// }

// export default Home;
