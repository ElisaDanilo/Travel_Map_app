import "./css/login.css"
import { useState, useRef } from 'react';
import axios from 'axios';
import RoomIcon from '@mui/icons-material/Room';
import CancelIcon from '@mui/icons-material/Cancel';

const Login = ({setShowLogin, setCurrentUser}) => {
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
        const res = await axios.post("http://localhost:8800/api/users/login", user)
        setCurrentUser(res.data.username);
        setShowLogin(false)
    } catch (err) {
        setFail(true)
    }
    };
return ( 
<div className='login_content'>
        <div className='login_logo'>
            <RoomIcon />
            My Travel Pin</div>
    <form className='login_form'onSubmit={handleSubmit}>
        <input autoFocus type="text" placeholder='username' ref={nameRef}/>
        <input type="password" placeholder='password' ref={passwordRef}/>
        <button className='login_button' type="submit">Login</button>
        { fail && ( 
        <span className='login_msg_fail'>username or password incorrect</span>
        )}
    </form>
    <CancelIcon className='login_cancel' onClick={()=>setShowLogin(false)}/>
</div>
  )
}

export default Login