import express from 'express';
import subjectsRouter from './routes/subjects';
import usersRouter from './routes/users';
import cors from 'cors';
import securityMiddleware from "./middleware/security";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth";

const app = express();
const port = 8000;

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}));

app.all('/api/auth/*splat',toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);


app.use('/api/subjects',subjectsRouter)
app.use('/api/users',usersRouter)

app.get('/',(req,res) => {
    res.send("Hello World!");
});

app.listen(port,() => {
    console.log("Server is running on http://localhost:8000");
})