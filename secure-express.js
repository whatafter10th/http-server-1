const express = require('express');
const app = express();
const port =  3000; //process.env.PORT; 

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const JWT_SECRET = "7777";

let allUsers = [
    {
        username : "Shahista",
        password : "abc",
        emailID : "shahista_gilani@yahoo.com",
        type : "free"
    },
    {
        username : "Shamshuddin",
        password : "xyz",
        emailID : "shamshuddinmanji@yahoo.com",
        type : "free"
    },
    {
        username : "Sara",
        password : "pqr",
        emailID : "sara_manji@yahoo.com",
        type : "paid"
    },
];

let courses = [
    {
        courseName : "BFA",
        courseType : "Bachelors",
        university : "JNAFAU",
        location : "Hyderabad"
    },
    {
        courseName : "MBA",
        courseType : "Masters",
        university : "IIMB",
        location : "Bengaluru"
    },
    {
        courseName : "BDes",
        courseType : "Bachelors",
        university : "NID",
        location : "Ahmedabad"
    },
];

//SIGN IN - POST Request
app.post('/signIn', function printHello2 (req, res)  {
    
    let username = req.body.username;
    let password = req.body.password;
    console.log(username)
    console.log(password)

    let token = jwt.sign({username : username, password: password} , JWT_SECRET);
    console.log("generated token: "+token);

    if(isPaidUser(username, password)){

        
        return res.status(202).json({message : "Paid User. Token generated successfully",
                                     token : token
                                    })

    } else {
        return res.status(202).json({message : "Free User. Token generated successfully",
        token : token
       })
    }

  })

function isPaidUser(username , password){

    const matchingUserOBJ = allUsers.find(u => u.username === username && u.password === password);

    console.log("matchingUserOBJ: "+JSON.stringify(matchingUserOBJ))

    return matchingUserOBJ && matchingUserOBJ.type === "paid";
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    console.log("token: "+token);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
  
    try{

        //decode is optional. Only if you want to have a look at the token.
        const decodedToken = jwt.decode(token, JWT_SECRET);
        console.log("decodedToken:" +JSON.stringify(decodedToken));

        //VERIFY the token
        let decoded = jwt.verify(token, JWT_SECRET);

        // Extract username and password from decoded token and set it onto req
        req.username = decoded.username;
        req.password = decoded.password;

        console.log("username: "+req.username);
        console.log("password: "+req.password);

        next();

    } catch (error){
        console.log("error occurred: "+error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
  };


//INFO - GET Request
app.get('/coursesInfo', verifyToken, function printHello (req, res)  {

    try {

        // Validate username and password against allUsers array
        const isPaid = isPaidUser(req.username, req.password);

        if (!isPaid) {
            return res.status(401).json({ error: 'Unauthorized: This info is only for paid Users' });
        } 

        // Send coursesInfo as JSON response
        res.json({message: "You can access the Courses", data: courses});

    } catch (err) {
        res.status(403).json({ message : "Error occurred while verifying the User Token"});  
    }
  })

app.listen(port, function printX() {
  console.log(`Example app listening on port ${port}`)
})
