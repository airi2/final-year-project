import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col p-0 m-0">
                    <div className='p-2 d-flex justify-content-center shadow'>
                        <div>
                            <h4>PANGA KAZZI APP</h4>
                        </div>
                    </div>
                    
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
export default Dashboard;
