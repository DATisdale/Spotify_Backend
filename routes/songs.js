const express = require("express");
const router = express.Router();
const {User} = require("../models/user")
const {Song}=require("../models/song")
const auth = require("../middleware/auth")
// const validObjectId = require("../middleware/validObjectId")

router.post("/addsong", [auth], async (req,res) =>{
    try{
        const song = new Song({
            name: req.body.name,
            artist:req.body.artist,
            song:req.body.artist,
            userId: req.user._id   
        });
        await song.save();
        return res.send(song);
    }catch(ex){
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.get("/", async (req, res) => {
    try {
      const songs = await Song.find();
      console.log(songs)
      return res.send(songs);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  router.put("/:id",[auth], async(req,res)=>{
      
  })