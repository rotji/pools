
import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import styles from '../styles/pages/Home.module.css';

const Home: React.FC = () => (
    <div className={styles.homePage}>
        <HeroSection />
        <section className={styles.aboutSection}>
            <h2>About UnitedProfit</h2>
            <p>
                This is a platform that helps people reduce risks in markets like stocks, forex, crypto, betting, gambling, and commodities. Join or create a group where each person invests an equal amount in any asset of their choice. Whatever profit is made by anybody, the profit is shared equally, and whatever loss is made by anybody, the loss is shared equally among members of the group.
            </p>
        </section>
    </div>
);

export default Home;
