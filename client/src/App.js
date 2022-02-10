import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './comps/Header';
import Main from './comps/Main';


export default function App() {
  const [checkedarr, setcheckedarr] = useState();
  const [user, setuser] = useState();
  const [search, setsearch] = useState(0);
  
  return <div>
      <Router>
        <Header checkedarr={checkedarr} user={user} setsearch={setsearch}/>
        <Main setcheckedarr={setcheckedarr} checkedarr={checkedarr} setuser={setuser} search={search}/>
      </Router>
      
  </div>
}
