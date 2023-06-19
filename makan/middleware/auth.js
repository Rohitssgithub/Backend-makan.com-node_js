import jwt from 'jsonwebtoken'
import user from "../model/user.model"
const auth = async (req, res, next) => {

    try {
        // if (req.headers.authorization) {
        //     let token = req.headers.authorization;
        //     let decodeToken = jwt.verify(token, process.env.SECRAT_KEY);
        //     // console.log(decodeToken)
        //     req.user = decodeToken
        //     // console.log(req.user)
        //     if (decodeToken) {
        //         next();
        //     }
        //     else {
        //         return res.status(401).json({
        //             message: 'Invalid token'
        //         });
        //     }
        // }
        // else {
        //     return res.status(401).json({
        //         message: 'Invalid token'
        //     })
        // }
        let token = req.cookies.jwt;
        let decodeToken = jwt.verify(token, process.env.SECRAT_KEY);
        let rootuser = await user.findOne({ _id: decodeToken._id })
        if (!rootuser) { throw new Error('not found user') }
        req.token = token;
        req.rootuser = rootuser
        // req.userID = rootuser._id
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: 'unauthorized'
        })
    }
}

export default auth;