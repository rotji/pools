import React from 'react';

const Signup: React.FC = () => (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
        <h1>Sign Up</h1>
        <form>
            <input type="text" placeholder="Name" style={{ width: '100%', marginBottom: 12 }} />
            <input type="email" placeholder="Email" style={{ width: '100%', marginBottom: 12 }} />
            <input type="password" placeholder="Password" style={{ width: '100%', marginBottom: 12 }} />
            <button type="submit" style={{ width: '100%' }}>Sign Up</button>
        </form>
    </div>
);

export default Signup;
