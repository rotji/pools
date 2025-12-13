
import React from 'react';
import styles from '../styles/pages/Home.module.css';

const About: React.FC = () => (
    <section className={styles.aboutSection} style={{ marginTop: '6rem' }}>
        <h2>About UnitedProfit</h2>
        <p>
            UnitedProfit is a modern platform for creating and joining risk-sharing investment groups. Our mission is to make collaborative investing accessible, transparent, and rewarding for everyone. Join a group, share the risk, and grow together!
        </p>
    </section>
);

export default About;
