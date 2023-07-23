const express = require('express');
const jwt=require('jsonwebtoken');
var cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors({
    "origin": "*",
}))

const users = [{
    id:1,
    username:'admin',
    password:'admin@123',
    isAdmin:true
},
{
    id:2,
    username:'john',
    password:'admin@123',
    isAdmin:false
}
]

let refreshTokenDB=[];

const verifyToken = async (req,res,next) => {
    const tokenHeader =req.headers.authorization;
    if(tokenHeader){
        const token =tokenHeader.split(' ')[1];
        try{
            const validToken = await jwt.verify(token,'kaarasecretkey')

            if(validToken){
                const user=users.find(u => u.id === validToken.id)
                req.user=user;
                next();
            }
        }catch(err){
            return res.status(403).json({error:err.message})

        }
    }
    else{
        return res.status(401).json({error:'you are not authenticated.'})
    }

}

function generateNewToken(user){
    const accessToken=jwt.sign({id:user.id, isAdmin:user.isAdmin},'kaarasecretkey',{expiresIn:'15s'})
    return accessToken;
}

function generaterefreshToken(user){
    const refreshtoken=jwt.sign({id:user.id, isAdmin:user.isAdmin},'refreshtokensecretkey')
    return refreshtoken;
}

app.post('/api/refreshtoken',(req,res) => {
    const refreshToken= req.body.token;
    // send error if there is no token ot it is invalid token
    if(!refreshToken){
        return res.status(401).json({error:'you are not authenticated!'})
    }
    // check refresh token is available in our dB/array // hacker token ko manipulate update kreky ki koshis kry toh db m check kra lo ki token valid or not
    if(!refreshTokenDB.includes(refreshToken)){
        return res.status(404).json({error:'refresh token not exits in DB and invalid token'})
    }
    jwt.verify(refreshToken,'refreshtokensecretkey', (err,user) => {

        if(err){
            return res.status(403).json({error:err.message})
        }
        // remove old token and update our tokenarray in db
        refreshTokenDB =  refreshTokenDB.filter(token => token !== refreshToken)
        const newAccessToken = generateNewToken(user)
        const newRefreshToken = generaterefreshToken(user)

        refreshTokenDB.push(newRefreshToken)
        return res.status(200).json({
            accessToken:newAccessToken,
            refreshToken:newRefreshToken
        })
    });

    
    // if everything is ok create new accesstoken and new refreshtoken and send to user 
})

app.post('/api/login',(req,res) => {
    const {username,password} = req.body;
   const user= users.find((item) => {
        if(item.username === username && item.password === password){
            return item
        }
    })

    if(user){
        const accessToken= generateNewToken(user)
        const refreshToken=generaterefreshToken(user)
        refreshTokenDB.push(refreshToken)
        return res.status(200).json({
            username:user.username,
            isAdmin:user.isAdmin,
            accessToken,
            refreshToken
        })
    }
    else{
        return res.status(400).json({error:'invalid credential'})
    }

})

app.delete('/api/user/:userId',verifyToken,(req,res) => {
    if((req.user.id === parseInt(req.params.userId)) || req.user.isAdmin ){
        return res.status(200).json({message:'user deleted successfully'})
    }else{
        return res.status(404).json({message:'you are not allowed to delete this user'})
    }
})

app.post('/api/logout',verifyToken,(req,res) => {
const refreshToken = req.body.token;

try{
    
 refreshTokenDB = refreshTokenDB.filter(token => token !== refreshToken)
 console.log(refreshTokenDB)

 res.status(200).json({message:'user has been success logout!'})
}catch(err){
    res.status(403).json({error:err.message})

}
})


PORT=5000;

app.listen(PORT,() => {
    console.log(`server started at ${PORT}`)
})