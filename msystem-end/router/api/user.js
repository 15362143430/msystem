const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport=require('passport');//验证token引入passport



router.get('/', async function (req, res) {
    res.send(await User.find())
})

router.post("/register", (req, res) => {
    // console.log(req.body)
    //查询数据库中是否拥有邮箱
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                return res.status(400).json(
                   "邮箱已被注册"
                )
            } else {
                //头像使用gravatar
                const avatar = gravatar.url(req.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity:req.body.identity,
                    freeze:req.body.freeze
                })
                //加密注册的密码用bcrypt的gensalt
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                return res.status(404).json(
                    "用户不存在"
                )
            }

            if (user.freeze == 0) {
                return res.status(404).json(
                    "用户已被冻结"
                )
            }
            
            //密码匹配，用bcrypt的compare
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //token
                        const rule={id:user.id,name:user.name,avatar:user.avatar,identity:user.identity}
                        jwt.sign(rule, 'secret', {expiresIn: 3600 },(err,token)=>{
                            if(err) throw err;
                            res.json({
                                success:true,
                                token:"Bearer "+token
                            })
                        });
                        // res.json({
                        //     msg: "success"
                        // })
                    } else {
                        return res.status(400).json(
                           "密码错误"
                        )
                    }
                })
        })
})

//私有
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
    console.log(req.user)
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    })
})

//私有,查看所有user
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    User.find()
    .then(profile=>{
        if(!profile){
            return res.status(404).json('没有任何内容')
        }

        res.json(profile);
    })
    .catch(err=>res.status(404).json(err))
})

//私有，根据id删除
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),async (req,res)=>{
    const user=await User.findById(req.params.id)
	await user.remove()
	res.send({
		success:true
	})
})

//私有，根据id冻结
router.put("/freeze/:id",passport.authenticate("jwt",{session:false}),async (req,res)=>{
    const user=await User.findById(req.params.id)
    user.freeze = 0;
    await user.save();
    res.send(user)
})

//私有，根据id解冻
router.put("/thaw/:id",passport.authenticate("jwt",{session:false}),async (req,res)=>{
    const user=await User.findById(req.params.id)
    user.freeze = 1;
    await user.save();
    res.send(user)
})
module.exports = router;