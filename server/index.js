const express = require('express')
const session = require('express-session')
const cors = require('cors')
const { SQL } = require('./db')


const app = express()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}))

app.use(session({
    secret: "123",
    name: "Eden",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge:1000*60*60*24
    }
}))

const onlyUsers = (req, res, next) => {
    if(req.session.username){
        next()
    }else{
        res.status(401).send({err:'you need to login'})
    }
}

app.get('/users',async (req,res)=>{
   const users = await SQL(`SELECT * FROM users`)
   res.send(users)
})

app.post('/register',async (req,res)=> {
    try {
        const {firstname , lastname , username , password} = req.body
        if(!firstname || !lastname || !username || !password){
        return res.status(400).send({err:'missing some info'})
       
        }

        const exist = await SQL(`SELECT * FROM users
        WHERE users.username = "${username}"`)
        if(exist.length){
        return res.status(400).send({err:'username already taken!'})  
        }

        await SQL(`insert into users(firstname, lastname, username, password )
        values("${firstname}" , "${lastname}", "${username}", "${password}")`)
        res.send({msg:'account created, please login'})
      
    } catch (err) {
    console.log(err);
    res.sendStatus(500)
    }
})


app.post('/login',async (req,res)=> {
    try {
        const {username , password} = req.body

        if(!username || !password){
        return res.status(400).send({err:'missing some info'})
        }
        const user = await SQL(`SELECT * FROM users WHERE users.username = "${username}"`)
        if(!user.length){
        return res.status(400).send({err:'wrong username'})   
        }
        const pass = await SQL(`SELECT * FROM users WHERE users.username = "${username}" AND users.password = "${password}"`)
        if(!pass.length){
        return res.status(400).send({err:'wrong password'})
        }
   

        req.session.username = username;
        req.session.role = await SQL(`SELECT users.role FROM users WHERE users.username = "${username}" AND users.password = "${password}"`)
        res.send({msg:"seccessfull login", username , role: req.session.role })
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.get('/whoami', (req,res)=> {
    res.send({msg:req.session.username})
})

app.delete('/logout',onlyUsers, (req,res)=> {
    if(req.session){
        req.session.destroy(err=>{
            if(err){
                res.status(400).send('unable to log out')
            }else{
                res.send('Logout Successful')
            }
        })
    }
   
})  

app.get('/main', onlyUsers ,async (req,res)=> {
    try {
        const user = await SQL(`SELECT users.id,
        users.firstname,
        users.lastname,
        users.role
        FROM users
        WHERE users.username = "${req.session.username}"`)
        const vacations = await SQL(`SELECT vacation.*
        FROM vacation 
        ORDER BY vacation.checked `)
        const adminvacations = await SQL(`SELECT vacation.*
        FROM vacation `)

        res.send({user , vacations, adminvacations })
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.get('/reports', onlyUsers ,async (req,res)=> {
    try {
        const vacations = await SQL(` SELECT * FROM vacation
        WHERE followers > 0`)

        res.send(vacations)
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


app.post('/follow', onlyUsers ,async (req,res)=> {

    try {
        const {user_id , vacation_id} = req.body

        const exist = await SQL(`SELECT * FROM follow WHERE follow.user_id = ${user_id} AND follow.vacation_id = ${vacation_id}`)

        if(!exist.length){
        await SQL(`insert into follow(user_id , vacation_id)
        values(${user_id}, ${vacation_id})`)
        await SQL(`UPDATE vacation SET followers = followers + 1 WHERE id = ${vacation_id}`)
        return res.send({msg:'vacation added to followers'})

        }
        await SQL(`DELETE FROM follow WHERE user_id = ${user_id} AND vacation_id = ${vacation_id}`)
        await SQL(`UPDATE vacation SET followers = followers - 1 WHERE id = ${vacation_id}`)
   
        res.send({msg:'vacation deleted from followers'})
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
    
})


app.delete('/vacation', onlyUsers ,async (req,res)=> {
    try {
        const {vacation_id} = req.body

        await SQL(`DELETE FROM follow WHERE follow.vacation_id = ${vacation_id}`)
        await SQL(`DELETE FROM vacation WHERE vacation.id = ${vacation_id}`)
   
        res.send({msg:'vacation deleted!'})
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.post('/checkifexist', onlyUsers ,async (req,res)=> {
    try {
        const {user_id, vacation_id} = req.body

        const exist = await SQL(`SELECT * FROM follow WHERE follow.user_id = ${user_id} AND follow.vacation_id = ${vacation_id}`)
        if(!exist.length){
        await SQL(`UPDATE vacation SET checked = false WHERE id = ${vacation_id}`)
        }else{
        await SQL(`UPDATE vacation SET checked = true WHERE id = ${vacation_id}`)
        }
        res.send({msg:'details update'})
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.get('/main/:user_id', onlyUsers ,async (req,res)=> {
    try {
        const {user_id} = req.params

        const exist = await SQL(`SELECT * FROM follow WHERE follow.user_id = ${user_id}`)
        res.send(exist)
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


app.get('/:vacationid', onlyUsers ,async (req,res)=> {
    try {
        const {vacationid} = req.params

        const vacation = await SQL(`SELECT * FROM vacation WHERE id = ${vacationid}`)
        res.send(vacation)
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.post('/newvacation', onlyUsers ,async (req,res)=> {
    try {
        const {destination , description , image , startdate , enddate , price } = req.body
        await SQL(`insert into vacation(destination, description, image, startdate, enddate, price)
        values("${destination}", "${description}", "${image}", "${startdate}", "${enddate}", ${price})`)
   
        res.send({msg:'vacation added!'})
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.put('/update/:vacationid', onlyUsers ,async (req,res)=> {
    try {
        const { vacationid } = req.params
        const {destination , description , image , startdate , enddate , price} = req.body
        
        if(destination){
            await SQL(`UPDATE vacation SET destination = "${destination}" WHERE id = ${vacationid}`)
        }
        if(description){
            await SQL(`UPDATE vacation SET description = "${description}" WHERE id = ${vacationid}`)
        }
        if(image){
            await SQL(`UPDATE vacation SET image = "${image}" WHERE id = ${vacationid}`)
        }
        if(startdate){
            await SQL(`UPDATE vacation SET startdate = "${startdate}" WHERE id = ${vacationid}`)  
        }
        if(enddate){
            await SQL(`UPDATE vacation SET enddate = "${enddate}" WHERE id = ${vacationid}`)
        }
        if(price){
            await SQL(`UPDATE vacation SET price = ${price} WHERE id = ${vacationid}`)
        }

        res.send({msg:'vacation update!'})
      
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})



app.post('/search', onlyUsers ,async (req,res)=> {
    try {
        const { search } = req.body
       if(search){
        const results =await SQL(`SELECT * FROM vacation 
        WHERE vacation.destination 
        LIKE '%${search}%'`)
        return res.send(results)
      }else{
        const user = await SQL(`SELECT users.id,
        users.firstname,
        users.lastname,
        users.role
        FROM users
        WHERE users.username = "${req.session.username}"`)
        const vacations = await SQL(`SELECT vacation.*
        FROM vacation 
        ORDER BY vacation.checked `)
        const adminvacations = await SQL(`SELECT vacation.*
        FROM vacation `)
        return res.send({user, vacations, adminvacations})
      }
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})



app.listen(1000, ()=> console.log('server run on port 1000😁'))