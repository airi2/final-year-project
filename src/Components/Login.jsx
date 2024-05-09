import React, { useState, useRef } from 'react'
import './style.css'
import { auth } from '../firebase'
import { useNavigate, Link, useParams} from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


const Login =() => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {userId} = useParams();
    const [emailValidationMessage, setEmailValidationMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const passwordInputRef = useRef(null);

    const handleEmailChange = async (event) => {
      const newEmail = event.target.value;
      setEmail(newEmail);
  
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(newEmail);
  
      let validationMessage = '';
      if (isValidFormat) {
          // Extract domain from email address
          const domain = newEmail.split('@')[1];
  
          // Validate domain using a regular expression
          const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const isValidDomain = domainRegex.test(domain);
  
          if (!isValidDomain) {
              validationMessage = 'Invalid domain.';
          }
      } else {
          validationMessage = 'Please enter a valid email address.';
      }
  
      setEmailValidationMessage(validationMessage);
  };
  

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = (e) =>{
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
            console.error('Password does not meet requirements.');
            return; // Prevent form submission if password is invalid
        }

        try {
            signInWithEmailAndPassword(auth, email.email, password.password)
             .then(() => {
             // Signed in 
            setEmail('');
            setPassword('');

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userId = user.uid;
                    try {
                        
                        navigate(`/employeedetail/${userId}`);
                        
                    } catch (error) {
                        alert('Error navigating ', error);
                    }
                }
                else {
                    alert("successful login")
                    navigate('/'); 
                }
            });
            
            })
            

        } catch (error){
            alert(error);
        }
    }

    const handleFocus = () => {
        passwordInputRef.current.classList.add('focused'); // Add 'focused' class on focus
    };
    
      const handleBlur = () => {
        passwordInputRef.current.classList.remove('focused'); // Remove 'focused' class on blur
    };
   
    
    
    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <h4 className='d-flex justify-content-center align-items-center'> Welcome Back</h4>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
              <input
                type="email"
                placeholder='Enter Email'
                name='email'
                onChange={handleEmailChange}  // Use handleEmailChange function
                className='form-control rounded-0'
                autoComplete='off'
              />
              {emailValidationMessage && <p className="text-danger">{emailValidationMessage}</p>} {/* Display validation message conditionally */}
                    </div>
                    <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
          <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Enter Password'
            name='password'
            onChange={handlePasswordChange}
            className='form-control rounded-0'
            autoComplete='off'
            ref={passwordInputRef} // Assign ref to password input
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary rounded-0"
              type="button"
              onClick={toggleShowPassword}
            >
              {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
            </button>
          </div>
        </div>
        <div className={`text-danger ${passwordInputRef.current?.value && passwordInputRef.current?.classList.contains('focused') ? '' : 'd-none'}`}>
          Password must be at least 8 characters and include:
          <ul>
            <li>One lowercase letter (a-z)</li>
            <li>One uppercase letter (A-Z)</li>
            <li>One number (0-9)</li>
            <li>One special character (@$!%*?&)</li>
          </ul>
        </div>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'> Log in</button>
                    <p className='my-2'> Don't have an account?
                        <Link to={'/Register'}>Register</Link>
                        <Link to={`/dashboard/${userId}/login`} className="btn btn btn-outline-success btn-sm mx-3">Admin</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login