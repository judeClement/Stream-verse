// File: src/components/Footer.jsx

import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <p style={styles.text}>
                    © {new Date().getFullYear()} YourCompany. All rights reserved.
                </p>
                <nav style={styles.nav}>
                    <a href="/privacy" style={styles.link}>Privacy Policy</a>
                    <a href="/terms" style={styles.link}>Terms of Service</a>
                    <a href="/contact" style={styles.link}>Contact Us</a>
                </nav>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        marginTop: 'auto',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        margin: '0.5rem 0',
    },
    nav: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Footer;
