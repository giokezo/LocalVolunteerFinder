import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      <form>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label><br />
          <input type="email" id="email" name="email" required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label><br />
          <input type="password" id="password" name="password" required style={{ width: '100%' }} />
        </div>

        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
