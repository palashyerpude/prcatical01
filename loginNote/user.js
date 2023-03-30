const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ dest: './uploads' }));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/audio_app', { useNewUrlParser: true });
const db = mongoose.connection;

// Define Audio schema and model
const audioSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  song: String,
});
const Audio = mongoose.model('Audio', audioSchema);

// Define API routes
app.get('/api/audio', (req, res) => {
  // Retrieve all audio records from the database
  Audio.find((err, audio) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(audio);
    }
  });
});

app.get('/api/audio/:id', (req, res) => {
  // Retrieve a single audio record from the database by ID
  Audio.findById(req.params.id, (err, audio) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(audio);
    }
  });
});

app.post('/api/audio', upload.single('song'), (req, res) => {
  // Create a new audio record in the database
  const audio = new Audio({
    name: req.body.name,
    image: req.body.image,
    desc: req.body.desc,
    song: req.file.filename,
  });

  audio.save((err, audio) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(audio);
    }
  });
});

app.put('/api/audio/:id', (req, res) => {
  // Update an existing audio record in the database by ID
  Audio.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      desc: req.body.desc,
    },
    { new: true },
    (err, audio) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(audio);
      }
    }
  );
});

app.delete('/api/audio/:id', (req, res) => {
  // Delete an existing audio record from the database by ID
  Audio.findByIdAndDelete(req.params.id, (err, audio) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Delete the audio file from the uploads folder
      const filePath = path.join(__dirname, 'uploads', audio.song);
      fs.unlinkSync(filePath);

      res.json({ message: 'Audio deleted successfully!' });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (3000))