const express = require("express");
require("./Database/config");
const User = require("./Database/Users");
const Product = require('./Database/protuct')

const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password
  resp.send(result);
});

app.post("/login", async (req, resp) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
    } else {
      resp.send(['user not found']);
    }
  }
  else{
    resp.send(['user not found']);
  }
});

app.post('/addproduct', async (req,resp)=>{

  let product = new Product(req.body)
  let result = await product.save()
  resp.send(result)
})

app.get('/products',async(req,resp)=>{
  let product = await Product.find();
  if(product.length>0){
    resp.send(product)
  }else{
    resp.send({result:"No Record Found"})
  }
})


app.delete('/product/:id', async(req,resp)=>{
  let result = await Product.deleteOne({_id: req.params.id})
  resp.send(result)
})

app.get('/product/:id', async(req,resp)=>{
  let result = await Product.findOne({_id:req.params.id})
  if (result) {
    resp.send(result)
} else {
    resp.send({ "result": "No Record Found." })
}
})

app.put('/product/:id', async (req,resp)=>{
 let result = await Product.updateOne(
  { _id: req.params.id },
  { $set: req.body }
 )
 resp.send(result)
})

app.get('/search/:key', async (req,resp)=>{
  let result = await Product.find({
    "$or": [
        {
            name: { $regex: req.params.key }  
        },
        {
            company: { $regex: req.params.key }
        },
        {
            category: { $regex: req.params.key }
        }
    ]
});
resp.send(result);
})



app.listen(4000);
