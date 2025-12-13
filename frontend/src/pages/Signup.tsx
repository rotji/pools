
import React from 'react';
import styles from '../styles/pages/Auth.module.css';

const Signup: React.FC = () => (
    <div className={styles.authPage}>
        <form className={styles.authForm}>
            <h1 className={styles.authTitle}>Sign Up</h1>
            <input type="text" placeholder="Name" className={styles.authInput} />
            <input type="email" placeholder="Email" className={styles.authInput} />
            <input type="password" placeholder="Password" className={styles.authInput} />
            <button type="submit" className={styles.authButton}>Sign Up</button>
        </form>
    </div>
);

export default Signup;
