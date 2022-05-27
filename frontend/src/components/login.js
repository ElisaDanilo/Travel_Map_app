import React from 'react'
import "./css/login.css"
import { useState, useRef } from 'react';
import axios from 'react';
import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';

const Login = ({setShowLogin}) => {
    const [fail, setFail] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };
    try{
        await axios.post("/users/login", user)
        setFail(false)
    } catch (err) {
        setFail(true)
    }
    };
return ( 
<div className='Login'>
        <div className='Login_logo'>
            <RoomIcon />
            ElisaPin</div>
    <form className='Login_form'onSubmit={handleSubmit}>
        <input type="text" placeholder='username' ref={nameRef}/>
        <input type="password" placeholder='password' ref={passwordRef}/>
        <button className='Login_button'>Login</button>
        { fail && ( 
        <span className='Login_msg_fail'>username or password incorrect</span>
        )}
    </form>
    <CancelIcon className='Login_cancel' onClick={()=>setShowLogin(false)}/>
</div>
  )
}

export default Login