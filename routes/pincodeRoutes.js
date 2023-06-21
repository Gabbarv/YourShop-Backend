import express from "express"


const router = express.Router()

router.get('/', async (req,res) => {
    
    res.json(['222202','222201','211008'])
})


export default router