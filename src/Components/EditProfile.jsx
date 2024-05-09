import React, { useEffect, useState , useRef} from 'react'
import { useNavigate, useParams, Link} from 'react-router-dom';
import {updateDoc, doc, getDoc} from "firebase/firestore";
import { db } from '../firebase';


function EditProfile() {
	const [data, setData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: ''
        
    });
    const [password, setPassword] = useState('');
    const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] = useState('');
    const [emailValidationMessage, setEmailValidationMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();
    const { userId } = useParams();

    const handlePhoneNumberChange = (event) => {
      const newPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digits
      
      // Validate phone number length
      const isValidLength = newPhoneNumber.length === 10;
      setPhoneNumberValidationMessage(isValidLength ? '' : 'Please enter a 10-digit phone number.');
  
      setData(prevData => ({
          ...prevData,
          phoneNumber: newPhoneNumber
      }));
  };
  
  const handleEmailChange = async (event) => {
    const newEmail = event.target.value;

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

    setData(prevData => ({
        ...prevData,
        email: newEmail
      }));

    setEmailValidationMessage(validationMessage);
};

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setData(prevData => ({
        ...prevData,
        password: event.target.value // Update password in the data state
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'employees', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error getting document:', error);
            }
        };

        fetchData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const employeeData = {
            // Extract employee data from form fields
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password
        };
        try {
            // Update employee data in Firestore
            await updateDoc(doc(db, 'employees', userId), employeeData);
            navigate(`/employeedetail/${userId}`);
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
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Update Employee  Detail</h2>
			<form className="row g-3 w-50" onSubmit={handleSubmit}>
			<div className="col-12">
					<label htmlFor="inputName" className="form-label"><strong>Name </strong></label>
					<input type="text" 
                    className="form-control"
                     id="inputName" 
                     placeholder='Enter Name' 
                     autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})} 
					value={data.name}/>
				</div>
				<div className="col-12">
                     <label htmlFor="email"><strong>Email</strong></label>
                    <input
                        type="email"
                        placeholder='Enter Email'
                        name='email'
                        onChange={handleEmailChange}  // Use handleEmailChange function
                        className='form-control rounded-0'
                        autoComplete='off'
                        value={data.email}
                    />
                    {emailValidationMessage && <p className="text-danger">{emailValidationMessage}</p>} {/* Display validation message conditionally */}
                        </div>
                        <div className="col-12">
                    <label htmlFor="phoneNumber"><strong>Phone Number</strong></label>
                    <input
                        type="text"
                        placeholder='Enter Phone Number'
                        name='phoneNumber'
                        onChange={handlePhoneNumberChange} // Use handlePhoneNumberChange function
                        className='form-control rounded-0'
                        autoComplete='off'
                        value={data.phoneNumber}
                    />
                    {phoneNumberValidationMessage && <p className="text-danger">{phoneNumberValidationMessage}</p>} {/* Display validation message conditionally */}
				</div>
                <div  >
                    <label htmlFor="password" ><strong>Password</strong></label> <br/>
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
                        value={data.password} 
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
				<div className="col-12">
					<button type="submit" className="btn btn-primary">Update</button>
                    <Link to={`/employeedetail/${userId}`} className="btn btn-danger btn-sm mx-3 me-2">Cancel</Link>
				</div>
			</form>
		</div>
  )
}

export default EditProfile;