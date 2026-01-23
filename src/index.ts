import express from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';
import securityMiddleware from "./middleware/security";

const app = express();
const port = 8000;

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))
app.use(express.json());

app.use(securityMiddleware);


app.use('/api/subjects',subjectsRouter)

app.get('/',(req,res) => {
    res.send("Hello World!");
});

app.listen(port,() => {
    console.log("Server is running on http://localhost:8000");
})