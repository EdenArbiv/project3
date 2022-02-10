import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Vacation from './Vacation';

export default function Vacations({setcheckedarr, checkedarr, setuser , search}) {
    const [vacations, setvacations] = useState([]);
    const [user_id, setuser_id] = useState(0);
    const [update, setupdate] = useState(false);
    const navigate = useNavigate()

    if(!localStorage.username || window.status == 401){
      navigate('/login')
    }

   
    useEffect(() => {
        (async ()=>{
            const res = await fetch('http://localhost:1000/main',{
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
                setuser(data.user)
                if(data.user[0].role == "admin"){
                    setvacations(data.adminvacations)
                }else{
                   setvacations(data.vacations.reverse()) 
                }
                console.log(data.vacations);
                console.log(data.user[0].role)
                setuser_id(data.user[0].id)
            }
        })();
  
    }, [update, user_id])

    useEffect(() => {
        (async ()=>{
            const res = await fetch(`http://localhost:1000/main/${user_id}`,{
                method: "get",
                headers: {'content-type':'application/json'},
                credentials:'include'
            })
            
            const data = await res.json()
            setcheckedarr(data)
        })();
    }, [update, user_id]);

    useEffect(() => {
        (async ()=>{
            const res = await fetch(`http://localhost:1000/search`,{
                method: "post",
                headers: {'content-type':'application/json'},
                body:JSON.stringify({search}) ,
                credentials:'include'
            })
            
            const data = await res.json()
            if(search){
                setvacations(data)
            }else{
                if(data.user[0].role == "admin"){
                setvacations(data.adminvacations)
                }else{
               setvacations(data.vacations.reverse()) 
                }
                console.log(data.vacations);
                console.log(data.user[0].role)
                setuser_id(data.user[0].id)
            }  
            
        })();
    }, [search]);
    

  return <div className='vacations'>
      
    {
        vacations && vacations.map(vacation => <Vacation key={vacation.id} vacation={vacation} user_id={user_id} setcheckedarr={setcheckedarr} checkedarr={checkedarr} setupdate={setupdate} vacation_id={vacation.id} update={update}/>)
          
    }
       
       
  </div>;
}
