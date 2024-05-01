import React, { useState } from 'react';
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

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
     // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      //add the new user to the employees collection and add registerData 
      const employeesCollection = collection(db, "employees");
      // Assuming you have the user ID (userId) obtained earlier

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
                onChange={(e) => setPhoneNumber(e.target.value)}
                className='form-control rounded-0'
                autoComplete='off' 
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="email"><strong>Email</strong></label>
              <input
                type="email"
                placeholder='Enter Email'
                name='email'
                onChange={(e) => setEmail(e.target.value)}
                className='form-control rounded-0'
                autoComplete='off' 
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="password"><strong>Password</strong></label>
              <input
                type="password"
                placeholder='Enter Password'
                name='password'
                onChange={(e) => setPassword(e.target.value)}
                className='form-control rounded-0' 
              />
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
