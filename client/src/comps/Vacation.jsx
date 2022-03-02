import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Vacation({vacation, user_id, setupdate, vacation_id, update}) {
    const navigate = useNavigate()

    useEffect(() => {
        (async ()=>{
        const res = await fetch('http://localhost:1000/checkifexist',{
            method: "post",
            headers: {'content-type':'application/json'},
            body:JSON.stringify({user_id, vacation_id}),
                credentials:'include'
        })
        const data = await res.json()
        })()
    }, [user_id, update]);


    const AddToFavorites = async (vacation_id) => {
      const res = await fetch('http://localhost:1000/follow',{
        method: "post",
        headers: {'content-type':'application/json'},
        body:JSON.stringify({user_id , vacation_id}),
        credentials:"include",
      })
      
      const data =await res.json()
      setupdate(up => !up)
    }


  const DeleteVacation = async (vacation_id) => {
    if (window.confirm("Are you sure you want to delete this vacation?")) {
      const res = await fetch('http://localhost:1000/vacation',{
      method: "delete",
      headers: {'content-type':'application/json'},
      body:JSON.stringify({vacation_id}),
      credentials:"include",
    })
     
      const data =await res.json()
      console.log(data.msg);
      setupdate(up => !up)
    }
       
  }
    

  return <div>
  <Card sx={{ maxWidth: 280 , textAlign:'center', margin:'10px 30px',  minWidth: 280}}>
  
    {
        localStorage.role == "user" ? <div><Checkbox className='checkbox' {...label} icon={<StarBorderIcon sx={{color:'white'}} />} checkedIcon={<StarIcon sx={{color:'white'}}/>} checked={vacation.checked? true : false}  onClick={()=> AddToFavorites(vacation.id)} /></div> : <div> <button onClick={() => navigate(`/${vacation.id}`)} className='edit'><EditIcon className='icon'/></button><button onClick={()=> DeleteVacation(vacation.id)} className='edit'><DeleteIcon className='icon'/></button></div>
    }
  
      <CardActionArea>
        <CardMedia
        className='image'
          component="img"
          height="140"
          image={vacation.image}
          alt="img"
        />
        <CardContent className='text'>
            <h3>{vacation.destination}</h3>
            <h6 className='desc'>{vacation.description}</h6>
            <br />
            <h5>Dates :{new Date(vacation.startdate).toLocaleDateString()} - {new Date(vacation.enddate).toLocaleDateString()} </h5>
            <h6>Price: {vacation.price}$</h6>
          
        </CardContent>
      </CardActionArea>
    </Card>
  </div>;
}
