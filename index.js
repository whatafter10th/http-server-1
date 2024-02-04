const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');

const app = express();
const port =  3000; //process.env.PORT; 

app.use(bodyParser.json());

app.get('/', function printHello (req, res)  {

  //console.log(req.headers);
  console.log(req.headers['user-agent']);

  console.log(req.query['city']);
  console.log(req.query.gender);
  //res.send('<h1> GET Hello World....! </h1>')
  res.json({answer: "Done!"});
})

app.get('/files/:filename', function(req,response){

    const name = req.params.filename;

    fs.readFile(name, 'utf-8', function x (err,data){
        res.json({data});
    })
    
})

app.get('/error', function printHello (req, res)  {

   
    console.log(req.query.bad);
    res.json({});
    //throw new Error("Bad query")
  })

  app.delete({
    //
    
  })

app.post('/', function printHello2 (req, res)  {
    
    console.log(req.body)
    console.log(req.body.stu)
    //res.send('<h1> POST Hello World! </h1>')
    res.status(201).send('<h1> POST Hello World! </h1>')
  })

//app.listen(port);


app.listen(port, function printX() {
  console.log(`Example app listening on port ${port}`)
})
