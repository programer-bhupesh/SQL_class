const {faker}=require("@faker-js/faker");
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
let getRandomUser=()=>{
    return[
        faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
     faker.internet.password(),
    ];
}


const connection =mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"delta_app",
        password:"sqlpwd"
    }
);

let q="SELECT count(*) FROM user";


// try{
//     connection.query(q,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     });

// }
// catch(err)
// {
//     console.log(err);
// }

// connection.end();
// console.log(createRandomUser());

app.listen("8080",()=>{
    console.log("listening to the port 8080");
});


app.get("/",(req,res)=>
{
    try{
            connection.query(q,(err,result)=>{
                if(err) throw err;
                let count=result[0]["count(*)"];
                res.render("home.ejs",{count});
            });
        }
        catch(err)
        {
            console.log(err);
            res.send("some error in database");
        }
});

let s="SELECT * FROM user"
app.get("/user",(req,res)=>
{
    try{
        connection.query(s,(err,result)=>
        {
            if(err) throw err;
            // res.render("xyz.ejs");
            // res.send(result);
            res.render("show.ejs",{result});
        })
    }
    catch(err)
    {
        console.log(err);
        res.send("some error in retriving the data");
    }
});


app.get("/user/:id/edit",(req,res)=>
{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>
        {
            if(err) throw err;
            let user=result[0];
            res.render("edit.ejs",{user});
        })
    }
    catch(err)
    {
        console.log(err);
        res.send("some error in retriving the data");
    }
});


app.patch("/user/:id",(req,res)=>
{
    let {id}=req.params;
    let {password:formpass,username:newUsername}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>
        {
            if(err) throw err;
            let user=result[0];
            if(formpass!=user.password){
            res.send("Wrong password");
            }
            else{
                let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2,(err,result)=>
                {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
        })
    }
    catch(err)
    {
        console.log(err);
        res.send("some error in retriving the data");
    }
});