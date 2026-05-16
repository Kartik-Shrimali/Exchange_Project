import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/v1/health" , (req , res) =>{
    res.json({msg : "The backend is working !!!"});
})

app.listen(PORT , () => {
    console.log(`The backend is running on port ${PORT}`);
})