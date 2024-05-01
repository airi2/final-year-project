import React, { useState } from 'react'
import './style.css'
import { auth } from '../firebase'
import { useNavigate, Link, useParams} from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


const Login =() => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const {userId} = useParams();
    
    const handleSubmit = (e) =>{
        e.preventDefault();
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
                        console.error('Error navigating to employee detail:', error);
                    }
                }
                else {
                    navigate('/'); 
                }
            });
            
            })
            

        } catch (error){
            console.log(error);
        }
    }

   
    
    
    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <h4 className='d-flex justify-content-center align-items-center'> Welcome Back</h4>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='email'
                        onChange={e => setEmail({email: e.target.value})} 
                        className='form-control rounded-0' 
                        autoComplete='off' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' 
                        name='password'
                        onChange={e => setPassword({ password: e.target.value})} className='form-control rounded-0'
                            />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'> Log in</button>
                    <p className='my-2'> Don't have an account?
                        <Link to={'/Register'}>Register</Link>
                        <Link to={`/dashboard/${userId}/login`} className="btn btn btn-outline-success btn-sm ">Admin</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login