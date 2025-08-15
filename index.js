const {faker}=require("@faker-js/faker");
const express=require("express");
const app=express();
const mysql=require('mysql2');
const methodOverride=require("method-override");



const path=require("path");

// app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'webDev',
    password:'yourPassword',
});


let getRandomUser=()=>{
    return[
        faker.datatype.uuid(),
        faker.internet.userName(),
       faker.internet.email(),
        faker.internet.password()
    ];
};

app.get("/", (req, res)=>{
    let q="SELECT COUNT(*) FROM user";

    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            console.log(result[0]["COUNT(*)"]);
            res.render("home.ejs", {result});
        });
    }catch(err){
        console.log(err);
        res.send("Something error in DB");
    }
});


app.get("/user", (req, res)=>{
     
    let q="SELECT * FROM user";
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            res.render("users.ejs", {result})

        });
    }catch(err){
        console.log(err);
        res.send("Something error in DB");
    }

});

app.get("/user/:id/edit",(req, res)=>{
    let{id}=req.params;
    let q=`select * from user where id="${id}"`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            res.render("edit.ejs", {result})

        });
    }catch(err){
        console.log(err);
        res.send("Something error in DB");
    }
   
    
});

app.patch("/user/:id",(req, res)=>{
    let{id}=req.params;
    let q=`select * from user where id="${id}"`;    //step 1
    let{password: formPass, username: newUsername}=req.body;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            if(formPass!=result[0].password){   //step 2
                res.send("Wrong Password");
            }else{                  //step 3
                let q2=`UPDATE user SET username="${newUsername}" where id="${id}" `;
               
                    connection.query(q2, (err, result)=>{
                        if(err) throw err;
                        res.redirect("/user");
            
                    });  
            }
    
        });
    }catch(err){
        console.log(err);
        res.send("Something error in DB");
    }
});

app.listen("8080", ()=>{
    console.log("Listening to the port 8080");
});






// let data=[];

// for(let i=0; i<100; i++){
//     data.push(getRandomUser());
// }
