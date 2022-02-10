import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    
    const navigate = useNavigate()
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [err, seterr] = useState("")

    const handleClick = async () => {
        const res = await fetch('http://localhost:1000/login',{
            method: "post",
            headers: {'content-type':'application/json'},
            body:JSON.stringify({username , password}),
            credentials:"include"
        })
        const data =await res.json()
        if(res.status == 400){
            seterr(data.err)
        }else{
            localStorage.username = data.username
            localStorage.role = data.role[0].role
            console.log(data);
            navigate('/vacations')
        }

        console.log(data)
       
    }

  return <div className='login'>
            <h1>Login</h1>
            <br/>
            <h5>Enter UserName:</h5>
            <input type="text" onChange={e=>setusername(e.target.value)} />
            <br/><br />
            <h5>Enter Password:</h5>
            <input type="password" onChange={e=>setpassword(e.target.value)}/>
            <br/>
            <h6 className='err'>{err}</h6>
            <br/>
            <button onClick={handleClick}>Login</button>
            <br/>
            <span>Don't have an account yet? <Link to='/register'>Register now</Link></span>
  </div>;
}
