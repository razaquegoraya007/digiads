const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const ytdl = require('ytdl-core');

const app = express();
const PORT = 3000;

// Use cors to enable cross-origin requests
app.use(cors());

// Configure body-parser to parse URL-encoded data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dfagbsowj',
  api_key: '735472544782495',
  api_secret: 'sWPJvoMI_C4FHBagy_gNTHFTZ5o',
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    resource_type: 'video', // Ensure the files are treated as videos
  },
});
const upload = multer({ storage: storage });

// Temporary in-memory storage for campaigns
let campaigns = [];

// API to create a new campaign
app.post('/api/create-campaign', upload.single('videoFile'), (req, res) => {
  const { uniqueCampaignName, uniqueDescription, uniqueLocation, videoType, videoUrl } = req.body;
  let videoData = {};

  // Handle video data based on the type
  if (videoType === 'url') {
    videoData = { type: 'url', value: videoUrl };
  } else if (req.file) {
    videoData = { type: 'file', value: req.file.path };
  }

  // Create the new campaign object
  const newCampaign = {
    name: uniqueCampaignName,
    description: uniqueDescription,
    location: uniqueLocation,
    video: videoData,
  };
  campaigns.push(newCampaign);

  console.log('New campaign created:', newCampaign);
  res.json({ message: 'Campaign created successfully!', campaign: newCampaign });
});

// API to convert YouTube link to video URL
app.get('/api/convert-youtube', async (req, res) => {
  const { url } = req.query;
  try {
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    res.json({ videoUrl: format.url });
  } catch (error) {
    console.error('Error converting YouTube link:', error);
    res.status(500).json({ message: 'Failed to convert YouTube link' });
  }
});

// API to get all campaigns (for the admin)
app.get('/api/campaigns', (req, res) => {
  res.json({ campaigns });
});

// API to delete a campaign
app.delete('/api/delete-campaign/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < campaigns.length) {
    const deletedCampaign = campaigns.splice(index, 1);
    res.json({ message: 'Campaign deleted successfully!', deletedCampaign });
  } else {
    res.status(400).json({ message: 'Invalid index' });
  }
});

// Route to serve the admin HTML page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
