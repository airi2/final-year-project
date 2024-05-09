import React, { useState, useRef } from 'react';
import './style.css';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] = useState('');
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  const navigate = useNavigate();
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(newPhoneNumber);

    // Validate phone number length
    const isValidLength = newPhoneNumber.length === 10;
    setPhoneNumberValidationMessage(isValidLength ? '' : 'Please enter a 10-digit phone number.');
  };

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error('Password does not meet requirements.');
      return; // Prevent form submission if password is invalid
    }

    try {
     // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      //add the new user to the employees collection and add registerData 
      const employeesCollection = collection(db, "employees");
      const newDocRef = doc(employeesCollection, userId); // Create document reference with user ID

      // Prepare your data
      const registerData = {
        email, password, name, phoneNumber,
        salary: 0,
       category:""
      };


      await setDoc(newDocRef, registerData); // Add data to the created document

			
      console.log('User created and data added successfully!');
      navigate('/');
        
      } catch (error) {
      console.log(error);
     }
  };

  const handleFocus = () => {
    passwordInputRef.current.classList.add('focused'); // Add 'focused' class on focus
  };

  const handleBlur = () => {
    passwordInputRef.current.classList.remove('focused'); // Remove 'focused' class on blur
  };

  return (
    <div>
      <div className='d-flex justify-content-center align-items-center vh-100 registerPage'>
        <div className='p-3 rounded w-25 border registerForm'>
          <h2> Sign up</h2>
          <form onSubmit={handleSubmit}>
          <div className='mb-3'>
              <label htmlFor="name"><strong>UserName</strong></label>
              <input
                type="text"
                placeholder='Enter Surname Firstname Secondname'
                name='name'
                onChange={(e) => setName(e.target.value)}
                className='form-control rounded-0'
                autoComplete='off' 
              />
            </div>
            <div className='mb-3'>
            <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
              <input
                type="text"
                placeholder='Enter Phone Number'
                name='phoneNumber'
                onChange={handlePhoneNumberChange} // Use handlePhoneNumberChange function
                className='form-control rounded-0'
                autoComplete='off'
              />
              {phoneNumberValidationMessage && <p className="text-danger">{phoneNumberValidationMessage}</p>} {/* Display validation message conditionally */}
            </div>
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
             <button type='submit' className='btn btn-success w-100 rounded-0'>
              Sign Up
            </button>
            <p className='my-2'> Already have an account?
            <Link to={'/'}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
