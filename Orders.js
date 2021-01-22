var express=require('express');
const app=express();
var mysql=require('mysql');

var bodyparser=require('body-parser');
const { builtinModules } = require('module');
const { nextTick } = require('process');

var connect=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"password",
    database:'shoponline'
});
connect.connect();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));



app.post('/sendorders/',(req,res,next)=>{

    var data=req.body;
    var username= data.username;
    var products=data.products;
    var total=data.total;
    var date=data.date;

    
    var insert_cmd="insert into orders (username,products,total,date) values (?,?,?,?)";
    values=[username,products,total,date];
    connect.query(insert_cmd,values,(err,results,fields)=>{
    connect.on('error',(err)=>{
        console.log("[MySQL Error",err);
    });
    console.log("order Inserted");
});

    connect.query("select * from orders where username=? order by id desc limit 1",[username], function(err,result,fields){
    connect.on('error',(err)=>{
        console.log("[MySQL Error",err);
    });
    
    if(result && result.length){
        res.json(result[0]);
    }
});
});

app.post('/vieworders/',(req,res,next)=>{

    var data=req.body;
    var username= data.username;
 
    connect.query("select * from orders where username=?",[username], function(err,result,fields){
    
        connect.on('error',(err)=>{
            console.log("[MySQL Error",err);
        });
        
        if(result && result.length){
            res.json(result);
        }
    });
});

var server=app.listen(3030,()=>{   
    console.log("Server running at http://localhost:3030");
});

