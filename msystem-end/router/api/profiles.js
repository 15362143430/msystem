const express=require('express');
const router = express.Router();
const passport = require('passport');

const Profile =require('../../models/Profile')

// router.get('/',(req, res)=> {
//     res.send({msg:"profile!!!!"})
// })

//添加，私有
router.post('/add',passport.authenticate("jwt",{session:false}),(req,res)=>{
    console.log(req.body.date)
    console.log(typeof req.body.date)
    const profileFields={};
    if(req.body.date){profileFields.date=req.body.date};
    if(req.body.type){profileFields.type=req.body.type};
    if(req.body.describe){profileFields.describe=req.body.describe};
    if(req.body.income){profileFields.income=req.body.income};
    if(req.body.expend){profileFields.expend=req.body.expend};
    if(req.body.cash){profileFields.cash=req.body.cash};
    if(req.body.remark){profileFields.remark=req.body.remark};

    new Profile(profileFields).save().then(profile=>{
        res.json(profile)
    })
})

//查看所有,私有
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.find()
    .then(user=>{
        if(!profile){
            return res.status(404).json('没有任何内容')
        }

        res.json(user);
    })
    .catch(err=>res.status(404).json(err))
})

//根据id查看，私有
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({_id:req.params.id})
    .then(profile=>{
        if(!profile){
            return res.status(404).json('没有任何内容')
        }

        res.json(profile);
    })
    .catch(err=>res.status(404).json(err))
})

//根据id编辑，私有
router.put("/edit/:id",passport.authenticate("jwt",{session:false}),async (req,res)=>{
    const profile=await Profile.findById(req.params.id)
    // console.log(profile)
    // console.log(req)
    profile.type=req.body.type
    profile.describe=req.body.describe
    profile.income=req.body.income
    profile.expend=req.body.expend
    profile.cash=req.body.cash
    profile.remark=req.body.remark
	await profile.save()
	res.send(profile)
})

//根据id删除，私有
router.delete('/delete/:id',passport.authenticate("jwt",{session:false}),async (req,res)=>{
	const profile=await Profile.findById(req.params.id)
	await profile.remove()
	res.send({
		success:true
	})
})

module.exports = router;