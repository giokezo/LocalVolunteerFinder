import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Register</h2>
      <form>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Name:</label><br />
          <input type="text" id="name" name="name" required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label><br />
          <input type="email" id="email" name="email" required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label><br />
          <input type="password" id="password" name="password" required style={{ width: '100%' }} />
        </div>

        <button type="submit" style={{ width: '100%' }}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
