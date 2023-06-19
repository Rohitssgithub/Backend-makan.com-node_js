import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    location: {
        type: String
    },
    contact: {
        type: Number
    },
    profiletype: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    confirmPassword: {
        type: String
    }
})

UserSchema.methods.generateAuthToekn = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRAT_KEY);
        // this.tokens = this.tokens.concat({ token: token });
        // await this.save()
        return token;
    }
    catch (err) {
        console.log(err)
    }
}
export default mongoose.model("user", UserSchema)
