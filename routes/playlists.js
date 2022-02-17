const router = require("express").Router();
const { Playlist } = require("../models/playlist");
const { Song } = require("../models/song");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const Joi = require("joi");

router.post("/create", auth, async (req, res) => {
  try{
    const playlist = new Playlist({
        name: req.body.name,
        userId: req.user._id,
        desc: req.body.desc,
        songs: req.body.songs,
        img: req.body.img  
    });
    await playlist.save();
    return res.send(playlist);
}catch(ex){
    return res.status(500).send(`Internal Server Error: ${ex}`);
}
});

// edit playlist by id
router.put("/:playlistId", [ auth], async (req, res) => {
 try{
   const update = {
     name:req.body.name,
     userId: req.body.userId,
     desc: req.body.desc,
     songs: req.body.songs,
     img: req.body.img
   };
   const playlist = await Playlist.findByIdAndUpdate(req.params.playlistId,update,{
     new:true,
   });
   if(!playlist) return res.status(400).send(`Playlist not found`);
   return res.send(playlist)
 }catch(error){
   return res.status(500).send(`Internal Server Error: ${error}`)
 }
});

router.put("/add-song", auth, async (req, res) => {
  const schema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
  });
  const { error } = schema.validatePlaylist(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.body.playlistId);
  if (!user._id.equals(playlist.user))
    return res.status(403).send({ message: "User dont have access to add" });

  if (playlist.songs.indexOf(req.body.songId) === -1) {
    playlist.songs.push(req.body.songId);
  }
  await playlist.save();
  res.status(200).send({ data: playlist, mesage: "Added songs to playlist" });
});

router.put("/remove-song", auth, async (req, res) => {
  const schema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
  });
  const { error } = schema.validatePlaylist(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.body.playlistId);
  if (!user._id.equals(playlist.user))
    return res.status(403).send({ message: "User dont have access to remove" });

  const index = playlist.songs.indexOf(req.body.songId);
  playlist.songs.splice(index, 1);
  await playlist.save();
  res.status(200).send({ data: playlist, message: "Removed from playlist" });
});

// favorite playlist
router.get("/favorite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const playlist = await Playlist.find({ _id: user.playlists });
  res.status(200).send({ data: playlists });
});

// random playlist

router.get("/random", auth, async (req, res) => {
  const playlists = await Playlist.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).send({ data: playlists });
});

// playlist by id

router.get("/:id", [ auth], async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).send("not found");

  const songs = await Song.find({ _id: playlist.songs });
  res.status(200).send({ data: { playlist, songs } });
});

// all playlists
router.get("/", auth, async (req, res) => {
  const playlists = await Playlist.find();
  res.status(200).send({ data: playlists });
});

// delete playlists by id
router.delete("/:id", [ auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.params.id);
  if (!user._id.equals(playlist.user._id))
    return res
      .status(403)
      .send({ message: "User don't have access to delete playlist" });

  const index = user.playlist.indexOf(req.params.id);
  user.playlists.splice(index, 1);
  await user.save();
  await playlist.remove();
  res.status(200).send({ message: "Playlist rremoved from library" });
});

module.exports = router;
