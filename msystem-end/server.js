const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser')
const app = express();
const passport=require('passport')//验证token第一步
//初始化passport,第二步
app.use(passport.initialize());
// require("./config/passport")(passport);写在连接数据库之后

app.use(require('cors')());
//代替bodyparser
app.use(express.json());

//引入
const users=require("./router/api/user")
const profiles=require("./router/api/profiles")


// //使用bodyparser中间件
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json())





mongoose.connect('mongodb://localhost:27017/msystem', {
    useNewUrlParser: true,
}).then(() => {
    console.log('connect!!')
}).catch((err) => {
    console.log(err)
})

//使用router
app.use("/api/users",users);
app.use("/api/profiles",profiles);



app.get('/', (req, res) => {
    res.send('OKkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
})
require("./config/passport")(passport);//这里

app.listen(3002, () => {
    console.log('App listening on port 3002')
})