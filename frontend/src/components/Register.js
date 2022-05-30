import "./css/register.css"
import { useState, useRef } from 'react';
import axios from 'axios';
import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';

const Register = ({setShowRegister}) => {
    const [success, setSuccess] = useState(false);
    const [fail, setFail] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
    try{
        await axios.post("http://localhost:8800/api/users/register", newUser)
        setFail(false)
        setSuccess(true);
    } catch (err) {
        setFail(true)
    }
    };
return ( 
<div className='register_content'>
        <div className='register_logo'>
            <RoomIcon />
            My Travel Pin</div>
    <form className='register_form'onSubmit={handleSubmit}>
        <input autoFocus type="text" placeholder='username' ref={nameRef}/>
        <input type="email" placeholder='email' ref={emailRef}/>
        <input type="password" placeholder='password' ref={passwordRef}/>
        <button className='register_button' type= "submit" >Register</button>
        { success && (
        <span className='register_msg_success'>Successfull ! You can login now </span>
        )}
        { fail && ( 
        <span className='register_msg_fail'>Something went wrong</span>
        )}
    </form>
    <CancelIcon className='register_cancel' onClick={()=>setShowRegister(false)}/>
</div>
  )
}

export default Register