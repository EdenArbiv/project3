import React from 'react';
import Login from './Login';
import Register from './Register';
import Vacations from './Vacations';
import { Routes , Route} from 'react-router-dom'
import Reports from './Reports';
import VacationEdit from './VacationEdit';
import AddVacation from './AddVacation';

export default function Main({setcheckedarr, checkedarr, setuser, search}) {

  return <div>
      <div className='main'>
           <Routes>
               <Route path="/login" element={<Login/>}/>
               <Route path="/register" element={<Register/>}/>
               <Route path="/vacations" element={<Vacations setcheckedarr={setcheckedarr} checkedarr={checkedarr} setuser={setuser} search={search}/>}/>
               <Route path="/" element={<Login/>}/>
               <Route path="/reports" element={<Reports/>}/>
               <Route path="/:vacationid" element={<VacationEdit />}/>
               <Route path="/addvacation" element={<AddVacation/>}/>
           </Routes>
        
        </div>
  </div>;
}
