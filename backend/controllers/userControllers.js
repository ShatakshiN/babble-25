const bcrpt = require('bcrypt')
const {Op} = require('sequelize')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


function isParamValid(str) {
    return (str === undefined || str.length === 0);
};

exports.createUser = async(req,res)=>{
    try{
        const {name , email ,phone, password} = req.body;

        if (isParamValid(email) || isParamValid(name) || isParamValid(password)|| isParamValid(phone)) {
            return res.status(400).json({ err: "bad parameter" });
        }

        let user =await User.findOne({
            where :  {
                [Op.or] : [
                    {email : email},
                    {phone : phone}

                ]
                }
        })
        if(user){
            return res.status(403).json({success : false , msg : "User already exists"})
        }

        const hash = await bcrpt.hash(password , 10)
        user = await User.create({
            name : name,email : email , password : hash ,phone
        })
        return res.json({success : true , msg : "User created successfully"})
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg : "Internal server error"})
    }
}

exports.login = async(req,res)=>{
    try{
        const {email , password} = req.body;
        const user =await User.findOne({where : {email : email}})
        if(!user)
            return res.status(401).json({success : false , msg : "Wrong credentials"})
        const compare = await bcrpt.compare(password , user.password)
        if(compare){
            const token = jwt.sign({id : user.id} , process.env.JWT_SECRET)
            return res.json({success : true , token})
        }else{
            return res.status(401).json({success : false , msg : "Wrong credentials"})
        }

    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg : "Internal server error"})

    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Extract logged-in user ID from middleware

        const users = await User.findAll({
            attributes: ['id', 'name', 'dp'],
            where: { id: { [Op.ne]: loggedInUserId } } // Exclude the logged-in user
        });

        // Provide a default DP if null
        const usersWithDp = users.map(user => ({
            id: user.id,
            name: user.name,
            //dp: user.dp || 'http://localhost:4000/images.png'  // Use the uploaded image
        }));

        return res.json({ success: true, users: usersWithDp });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
