import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AddVacation() {
    const navigate = useNavigate()
    const [destination, setdestination] = useState("");
    const [description, setdescription] = useState("");
    const [image, setimage] = useState("");
    const [startdate, setstartdate] = useState("");
    const [enddate, setenddate] = useState("");
    const [price, setprice] = useState(0);


    const AddVacation = async () => {
        const res = await fetch('http://localhost:1000/newvacation',{
            method: "post",
            headers: {'content-type':'application/json'},
            body:JSON.stringify({destination , description , image , startdate , enddate , price}),
            credentials:"include",
        })
      
        const data =await res.json()
        alert(data.msg);
        navigate('/vacations')
    }

  return <div className='formvacation'>
      <h1>Add Vacation:</h1>
      <h5>Enter New Destination:</h5>
      <input type="text" onChange={e => setdestination(e.target.value)}  />
      <br /><br />
      <h5>Enter Description:</h5>
      <textarea className='description' type="text" onChange={e => setdescription(e.target.value)} />
      <br /><br />
      <h5>Image URL:</h5>
      <input type="text" onChange={e => setimage(e.target.value)}/>
      <br /><br />
      <h5>Enter Date start and end:</h5>
      <input type="date" onChange={e => setstartdate(e.target.value)} /> - 
      - <input type="date" onChange={e => setenddate(e.target.value)} />
      <h5>Enter Price:</h5>
      <input type="Number" onChange={e => setprice(e.target.value)}/>
      <br /><br />
      <button onClick={AddVacation}>Add Vacation</button>
  </div>;
}
