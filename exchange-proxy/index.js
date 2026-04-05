import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express();
const port = 3001;
const targetURL = "https://api.backpack.exchange";

app.use((req , res , next) => {
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Methods" , "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Expose-Headers", "Content-Length , Content-Range");
    next();
})

app.use('/' , createProxyMiddleware({
    target: targetURL,
    changeOrigin : true,
    onProxyReq : (proxyReq , req , res) =>{

    },
    onProxyRes : (proxyRes , req , res)=>{

    }
}))

app.listen(port , ()=>{
    console.log(`Proxy server running on port ${port}`);
})