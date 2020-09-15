const fs= require("fs");
const http= require("http")
const url = require("url")
var json=fs.readFileSync(`${__dirname}/data/data.json`,"utf8")
var productContent=JSON.parse(json)

const server=http.createServer((req,res)=>{
    var pathName = url.parse(req.url, true).pathname;
    var productID = url.parse(req.url, true).query.id;
    // console.log(productID)
    if(pathName==="/products"||pathName==="/"){
        res.writeHead(200,{'Content-type':'text/html'})
        fs.readFile(`${__dirname}/overview.html`,"utf8",(err,data)=>{
           var mainTemplate= data;
            fs.readFile(`${__dirname}/templates/products-template.html`,"utf8",(err,data)=>{
                let allData= productContent.map(item=>replaceTemplate(data,item)).join("");
                let output=mainTemplate.replace("{%CARDS%}", allData)
                res.end(output)
})
        })
    } else if(pathName==="/laptop" && productID<productContent.length){
        res.writeHead(200,{'Content-type':'text/html'})
        fs.readFile(`${__dirname}/laptop.html`,"utf8",(err,data)=>{
            var laptop= productContent[productID];
            let output= replaceTemplate(data,laptop)
            console.log(output)
             res.end(output)
        })
        
    }else if((/\.(jpe?g)|png|gif/i).test(pathName)){
        // res.writeHead(200,{'Content-type':'text/html'})
        console.log(pathName)
        fs.readFile(`${__dirname}/${pathName}`,(err,data)=>{
            res.writeHead(200,{'Content-type':'image/jpeg'})
             res.end(data)
        })
        
    } else if((/\.css$/i).test(pathName)){
        // res.writeHead(200,{'Content-type':'text/html'})
        
        console.log("css req",pathName)
        fs.readFile(`${__dirname}/${pathName}`,"utf8",(err,data)=>{
            res.writeHead(200,{'Content-type':'text/css'})
             res.end(data)
        })
        
    }else{
        res.writeHead(404,{'Content-type':'text/html'})
        res.end("Not Found");
    }
    

})
//Template Function
const replaceTemplate=(temp,laptop)=>{
    output = temp.replace(/{%PRICE%}/g,laptop.price);
    output =output.replace(/{%NAME%}/g,laptop.productName);
    output =output.replace(/{%SCREEN%}/g,laptop.screen);
    output =output.replace(/{%CPU%}/g,laptop.cpu);
    output =output.replace(/{%SPACE%}/g,laptop.storage);
    output =output.replace(/{%RAM%}/g,laptop.ram);
    output =output.replace(/{%IMG%}/g,`data/img/${laptop.image}`);
    output =output.replace(/{%DEC%}/g,laptop.description);
    output =output.replace(/{%TITLE%}/g,laptop.productName);
    output =output.replace(/{%ID%}/g,laptop.id);
    return output;
}
server.listen(1337,"127.0.0.1", ()=>{
    console.log("listening")
})

