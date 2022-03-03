const router = require("express").Router();
const { User } = require("../models/user");
const { Song, validate } = require("../models/song");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


router.post("/add", auth, async (req, res) => {
  try{
      const song = new Song({
          name: req.body.name,
          artist: req.body.artist,
          song: req.body.song,
          img: req.body.img,
          duration: req.body.duration
      })
      await song.save();
      return res.send(song);
  }catch(ex){
      return res.status(500).send(`Internal Sever Error: ${ex}`)
  }
});

router.get("/", async (req, res) => {
  try{
      const songs = await Song.find()
      return res.send(songs);
  }catch(ex){
      return res.status(500).send(`Internal Server Error:${ex}`)
  }
});

router.get("/:songid",[auth], async(req,res)=>{
  try{
    const song = await Song.findById(req.params.songId);
    return res.send(song)
  }catch(ex){
    return res.status(500).send(`Internal Server Error: ${ex}`)
  }
  
})

router.put("/:songId", [auth], async (req, res) => {
  try {
      const update = {
          userId: req.body.userId,
          name: req.body.name,
          artist: req.body.artist,
          song: req.body.song,
          img: req.body.img,
          duration: req.body.duration,
          likes: req.body.likes,
          dislikes: req.body.dislikes
      };
      const song = await Song.findByIdAndUpdate(req.params.songId,update,{
         new:true, 
      })
      if(!song) return res.status(400).send(`Song not found`);
      return res.send(song)
    }catch(error){
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});

router.delete("/:songId", [auth, admin], async (req, res) => {
  try{
      const song = await Song.findById(req.params.songId);
      if(!song) 
        return res 
        .status(400)
        .send(`Song with ${req.params.songId} does not exist!`)
        await song.remove();
        return res.send(song);
  } catch(ex){
      return res.status(500).send(`Interanl Server Error: ${ex}`)
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if(song.likes.filter(like=>like.user.toString()===req.user.id).length>0) {
      return res.status(400).send({msg:'Song already liked'})
  }
  song.likes.unshift({user:req.user.id});

  await song.save()
  return res.send(song.likes)
}catch (err){ 
  return res.status(500).send('Server Error')
}
  });

router.get("/like", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const songs = await Song.find({ _id: user.likedSongs });
  res.status(200).send({ data: songs });
});

module.exports = router;
