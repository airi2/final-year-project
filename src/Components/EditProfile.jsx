import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link} from 'react-router-dom';
import {updateDoc, doc, getDoc} from "firebase/firestore";
import { db } from '../firebase';

function EditProfile() {
	const [data, setData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        
    });
    const [phoneNumberValidationMessage, setPhoneNumberValidationMessage] = useState('');
    const [emailValidationMessage, setEmailValidationMessage] = useState('');
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
  
  const handleEmailChange = (event) => {
      const newEmail = event.target.value;
      
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(newEmail);
  
      // Conditional validation
      let validationMessage = '';
      if (isValidFormat) {
          try {
              validator.isEmail(newEmail, { domain_specific_validation: true });
          } catch (error) {
              validationMessage = 'This email address might not be from a valid domain.';
          }
      } else {
          validationMessage = 'Please enter a valid email address.';
      }
  
      setEmailValidationMessage(validationMessage);
  
      setData(prevData => ({
          ...prevData,
          email: newEmail
      }));
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
        };
        try {
            // Update employee data in Firestore
            await updateDoc(doc(db, 'employees', userId), employeeData);
            navigate(`/employeedetail/${userId}`);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Update Employee  Detail</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label htmlFor="inputName" className="form-label">Name</label>
					<input type="text" 
                    className="form-control"
                     id="inputName" 
                     placeholder='Enter Name' 
                     autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})} 
					value={data.name}/>
				</div>
				<div class="col-12">
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
				<div class="col-12">
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
				<div class="col-12">
					<button type="submit" className="btn btn-primary">Update</button>
                    <Link to={`/employeedetail/${userId}`} className="btn btn-danger btn-sm mx-3 me-2">Cancel</Link>
				</div>
			</form>
		</div>
  )
}

export default EditProfile;