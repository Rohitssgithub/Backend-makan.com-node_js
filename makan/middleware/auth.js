import jwt from 'jsonwebtoken'
import user from "../model/user.model"
const auth = async (req, res, next) => {
    try {
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

const verifyTokenAndAuthorization = (req, res, next) => {
    auth(req, res, () => {
        if (req.decodeToken === req.params.userID || req.rootuser.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    auth(req, res, () => {
        if (req.rootuser.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};


export { auth, verifyTokenAndAdmin, verifyTokenAndAuthorization }
