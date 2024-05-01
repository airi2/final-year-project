import React, { useState } from 'react';
import './style.css'; // Import your CSS file
import { useNavigate, useParams, Link } from 'react-router-dom';


const DashboardLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {userId} = useParams()

  // Simulate user data in local storage (NOT for production)
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  const correctEmail = storedUserData?.email || 'adminlogin@gmail.com'; // Fallback if not set
  const correctPassword = storedUserData?.password || 'pangaKazzi'; // Fallback if not set

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === correctEmail && password === correctPassword) {
      navigate(`/dashboard/${userId}`);
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    < div className=" d-flex justify-content-center align-items-center vh-100 loginPage">
  
  <div className="p-3 rounded w-25 border  loginForm">
    <h4 className="d-flex justify-content-center align-items-center">Admin Login</h4>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email"><strong>Email</strong></label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control rounded-0"
          autoComplete="off"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password"><strong>Password</strong></label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control rounded-0"
        />
      </div>
      <button type="submit" className="btn btn-success w-100 rounded-0">
        Log in
      </button>

      <div className="d-flex justify-content-between px-2 py-2 "> 
      <Link to={`/employeedetail/${userId}`} className="btn btn-outline-success btn-sm mx-2">
        Profile
      </Link>
      <Link to={`/employeedetail/${userId}/todo`} className="btn btn-outline-success btn-sm mx-2">
        Tasks
      </Link>
    </div>
    </form>
  </div>
</div>

  );
};

export default DashboardLogin;
