const express = require("express");
const router = require("express").Router();
const { User } = require("../models/user");
const { Song, validate } = require("../models/song");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


router.post("/", admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const song = await Song(req.body).save();
  res.status(201).send({ data: song, message: "Song created successfully" });
});

router.get("/", async (req, res) => {
  const songs = await Song.find();
  res.status(200).send({ data: songs });
});

router.put("/:id", [auth, admin], async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: song, message: "Updated song successfully" });
});

router.delete("/:id", [auth, admin], async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Deleted song successfully" });
});

router.put("/like/:id", [auth, auth], async (req, res) => {
  let resMessage = "";
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(400).send({ message: "song does not exist" });

  const user = await User.findById(req.user._id);
  const index = user.likedSongs.indexOf(song._id);
  if (index === -1) {
    user.likedSongs.push(song._id);
    resMessage = "Added to your liked songs";
  } else {
    user.likedSongs.splice(index, 1);
    resMessage = "Removed from your liked songs";
  }
  await user.save();
  res.status(200).send({ message: resMessage });
});

router.get("/like", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const songs = await Song.find({ _id: user.likedSongs });
  res.status(200).send({ data: songs });
});

module.exports = router;
