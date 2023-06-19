import * as dotenv from "dotenv";
dotenv.config()
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();
const port = process.env.PORT || 4600;
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./router/user.route"
import router from "./router/property.route";
import routers from "./router/wishlist.route";
import routerss from "./router/propertybuy.route";

app.use(cookieParser())
app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(route)
app.use(router)
app.use(routers)
app.use(routerss)

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/makan')
    .then(() => console.log('Connected!'));

app.listen(port, () => {
    console.log(`server is running ${port}`)
})