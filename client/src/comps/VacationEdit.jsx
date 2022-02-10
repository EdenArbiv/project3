import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function VacationPage() {
    const {vacationid} = useParams()
    const [vacation, setvacation] = useState();
    const navigate = useNavigate()
    const [destination, setdestination] = useState("");
    const [description, setdescription] = useState(0);
    const [image, setimage] = useState(0);
    const [startdate, setstartdate] = useState(0);
    const [enddate, setenddate] = useState(0);
    const [price, setprice] = useState(0);


    const UpdateDetails = async () => {
      const res = await fetch(`http://localhost:1000/update/${vacationid}`,{
        method: "put",
        headers: {'content-type':'application/json'},
        body:JSON.stringify({destination , description , image , startdate , enddate , price}),
        credentials:"include",
      })
      const data =await res.json()
      alert(data.msg);
      navigate('/vacations')
    }

  
    useEffect(() => {
        (async ()=>{
            const res = await fetch(`http://localhost:1000/${vacationid}`,{
                method: "get",
                headers: {'content-type':'application/json'},
                credentials:'include'
            })
            const data = await res.json()
            
            if(res.status == 401){
              navigate('/login')
              localStorage.removeItem('username')
              localStorage.removeItem('role')
          }else{
             setvacation(data)
            console.log(data);
          }
        })();
    }, [vacationid]);

  
  return <div className='formvacation'>
    {
        vacation && <div><h1>EDIT VACATION</h1>
      <br />
      <img src={vacation[0].image} alt="img" />
      <br />
      <h3>Image URL:</h3>
      <input type="text" defaultValue={vacation[0].image} onChange={e => setimage(e.target.value)}/>
      <br /><br />
      <h3>Destination:</h3>
      <input type="text" defaultValue={vacation[0].destination}  onChange={e => setdestination(e.target.value)}/>
      <br /><br />
      <h3>Description: </h3>
      <textarea className='description' type="text" defaultValue={vacation[0].description}  onChange={e => setdescription(e.target.value)} />
      <h3>Dates:</h3>
      <br />
      <input type="date" defaultValue={vacation[0].startdate}  onChange={e => setstartdate(e.target.value)} /> - 
      - <input type="date" defaultValue={vacation[0].enddate}  onChange={e => setenddate(e.target.value)} />
      <br /><br />
      <h3>Price:</h3>
      <input type="Number" defaultValue={vacation[0].price} onChange={e => setprice(e.target.value)}/>
      <br /><br />
      <button onClick={UpdateDetails}>Update Details</button>
      </div>
    }
     
  </div>;
}
