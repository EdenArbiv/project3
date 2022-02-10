import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as V from 'victory';
import { VictoryBar, VictoryChart ,  VictoryStack } from 'victory';


export default function Reports() {
    const navigate = useNavigate()
    if(!localStorage.username || window.status == 401){
        navigate('/login')
    }

    const [chartdata, setchartdata] = useState([]);

       const SetData = async () => {
            const res = await fetch('http://localhost:1000/reports',{
                method: "get",
                headers: {'content-type':'application/json'},
                credentials:'include'
            })
            const data = await res.json()
            console.log(data);
            setchartdata(
            data.map(vacation => {return {
            x: vacation.destination , y: vacation.followers
            }})
        )}

    useEffect(() => {
        SetData()
    }, []);
    
    console.log(chartdata);

  return ( <div className='chart'>
      <div style={{ height: 500}}>
          <h1>Followers Vacations</h1>
      <VictoryChart 
        animate={{
        duration: 1000,
        onLoad: { duration: 500 }
        }}
         domainPadding={30}
         >
        <VictoryStack>
      
      <VictoryBar
        cornerRadius={{ top: 5}}
        data={chartdata} 
        barRatio={0.8}
        style={{
        data: {   fill: ({ datum }) => datum.y !== 2 ? "rgb(132, 230, 216)" : "rgb(238, 161, 228)" }
        }}/>
        
        </VictoryStack>

      </VictoryChart >
    </div>
     
  </div>
  )
}