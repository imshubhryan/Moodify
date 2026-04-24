const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.services");

const uploadSong = async (req, res) => {
  const songBuffer = req.file.buffer;
  const { mood } = req.body;
  const tags = id3.read(songBuffer);

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      filename: tags.title + ".mp3",
      folder: "/moodify/songs",
    }),
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      filename: tags.title + ".jpeg",
      folder: "/moodify/posters",
    }),
  ]);

  const songs = await songModel.create({
    title: tags.title,
    url: songFile.url,
    posterUrl: posterFile.url,
    mood,
  });

  res.status(201).json({
    message: "song created successfully",
    songs,
  });
};

const getSong = async(req,res)=>{
 const {mood} = req.query

 const [song] = await songModel.aggregate([
    {
      $match: { mood }
    },
    {
      $sample: { size: 1 }
    }
 ])

 if (!song) {
    return res.status(404).json({
      message: "no song found for this mood"
    })
 }

 res.status(200).json({
    message: "song fetched successfully",
    song,
 })
}

module.exports = { uploadSong , getSong};
