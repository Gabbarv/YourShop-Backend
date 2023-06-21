import express from "express"
import Product from "../models/ProductModel.js"
import User from "../models/UserModel.js"
import generateToken from "../utils/generateToken.js"
import multer from "multer"


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'backend/uploads/images')
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now()+'_'+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


  router.get('/productByCategory',async (req,res) => {
    const {category,maxPrice,size,color} = req.query
    let filter = {}
    if(category){
      filter.category = category
    }
    if(maxPrice){
      filter.price = { $gte: 0, $lte: maxPrice }
    }
    if(color){
      filter.color = { $in: color }
    }
    if(size){
      filter.size = { $in: size }
    }
    const products = await Product.find(filter);
    const tshirts = {}
    for(let item of products){
      if(item.title in tshirts){
            if(!tshirts[item.title].color.includes(item.color) && item.availableQty > 0){
              tshirts[item.title].color.push(item.color)
            }
            if(!tshirts[item.title].size.includes(item.size) && item.availableQty > 0){
              tshirts[item.title].size.push(item.size)
            }
      }else{
          tshirts[item.title] = JSON.parse(JSON.stringify(item))
          if(item.availableQty > 0){
              tshirts[item.title].color = [item.color]
              tshirts[item.title].size = [item.size]
          }
      }
  }

  
  res.json({tshirts}) 
  })
router.post('/addproducts',upload.array('images',12), async (req,res) => {
  const productImages = req.files;
  const productSize = req.body.sizes;
  const image = [];
 
  for(var i =0; i<productImages.length; i++ ){
         image.push(`http://localhost:5000/backend/uploads/images/${productImages[i].filename}`)
  }

  for(var j = 0; j<productSize.length; j++){

    const product = await Product.create({
        category: req.body.category,
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
        slug:  `${req.body.slug}${productSize[j]}`,
        availableQty: req.body.availableQty,
        size: productSize[j],
        color: req.body.color,
        img: image

    })
    product.save()
  }
    
    
})
router.get('/', async (req,res) => {

  

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}
  console.log(keyword)
  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    

 
    let tshirts = {}

    for(let item of products){
        if(item.title in tshirts){
              if(!tshirts[item.title].color.includes(item.color) && item.availableQty > 0){
                tshirts[item.title].color.push(item.color)
              }
              if(!tshirts[item.title].size.includes(item.size) && item.availableQty > 0){
                tshirts[item.title].size.push(item.size)
              }
        }else{
            tshirts[item.title] = JSON.parse(JSON.stringify(item))
            if(item.availableQty > 0){
                tshirts[item.title].color = [item.color]
                tshirts[item.title].size = [item.size]
            }
        }
    }

    
    res.json({tshirts })   
})
router.get('/:id', async(req,res) => {
    
    const product = await Product.findById(req.params.id);
   
    res.json(product)
})

router.get('/details/:slug', async(req,res) => {
    
    const product = await Product.findOne({slug: req.params.slug});
    let variants = await Product.find({title: product.title})
    let colorSizeSlug = {}

    for(let item of variants){
        if(Object.keys(colorSizeSlug).includes(item.color)){
            colorSizeSlug[item.color][item.size] = {slug: item.slug}
        }else{
            colorSizeSlug[item.color] = {}
            colorSizeSlug[item.color][item.size] = {slug: item.slug}
        }
    }
   
    res.json({product,colorSizeSlug})
})

router.post('/wishlist/:itemId', async(req,res) => {

    const {userId} = req.body;
    const itemId = req.params.itemId
    const user = await User.findById(userId)
    const product = await Product.findById(itemId)
    
   
    if(product && user){

        if(user.wishlist.includes(itemId)){
            user.wishlist = user.wishlist.filter(item => item != itemId)
            user.save()
            
        }else{
            user.wishlist.push(itemId)
            user.save();
            
        }
        

    } 

    


    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        wishlist: user.wishlist
      })
})


router.post('/:slug/reviews',async (req,res) => {
  const { review,rating,user } = req.body

  const product = await Product.findOne({slug: req.params.slug})

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const revie = {
      name: user.name,
      rating: Number(rating),
      comment: review,
      user: user._id,
    }

    product.reviews.push(revie)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})






export default router