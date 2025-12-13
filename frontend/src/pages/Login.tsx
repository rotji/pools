
import React from 'react';
import styles from '../styles/pages/Auth.module.css';

const Login: React.FC = () => (
    <div className={styles.authPage}>
        <form className={styles.authForm}>
            <h1 className={styles.authTitle}>Login</h1>
            <input type="email" placeholder="Email" className={styles.authInput} />
            <input type="password" placeholder="Password" className={styles.authInput} />
            <button type="submit" className={styles.authButton}>Login</button>
        </form>
    </div>
);

export default Login;
