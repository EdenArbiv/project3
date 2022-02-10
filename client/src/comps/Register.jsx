import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {

    const [firstname, setfirstname] = useState("")
    const [lastname, setlastname] = useState("")
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [err, seterr] = useState("")
    const navigate = useNavigate()

    const handleClick = async() => {
        const res = await fetch('http://localhost:1000/register',{
            method: "post",
            headers: {'content-type':'application/json'},
            body:JSON.stringify({firstname, lastname, username , password}),
            credentials:"include"
        })
        const data = await res.json()
        if(res.status == 400){
            seterr(data.err)
        }else{
            navigate('/login')
        }

        console.log(data)
    }
  return <div className='register'>
            <h1>Register</h1>
            <br />
            <h5>Enter your First Name:</h5>
            <br />
            <input type="text" onChange={e=>setfirstname(e.target.value)} />
            <br/>
            <h5>Enter your Last Name:</h5>
            <br />
            <input type="text" onChange={e=>setlastname(e.target.value)} />
            <br/>
            <h5>Enter New UserName:</h5>
            <br />
            <input type="text" onChange={e=>setusername(e.target.value)} />
            <br/>
            <h5>Enter New Password:</h5>
            <br />
            <input type="password" onChange={e=>setpassword(e.target.value)}/>
            <br/>
            <h6 className='err'>{err}</h6>
            <br/>
            <button onClick={handleClick}>Register</button>
            <br/><br />
            <span>have an account? <Link to='/login'>Login now</Link></span>
  </div>
}
