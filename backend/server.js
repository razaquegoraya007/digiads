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

// Temporary in-memory storage for campaigns and video URLs for Raspberry Pi
let campaigns = [];

// API to create a new campaign
app.post('/api/create-campaign', upload.single('videoFile'), (req, res) => {
  const { uniqueCampaignName, uniqueDescription, uniqueLocation, videoType, videoUrl, timeSlots } = req.body;
  let videoData = {};
  console.log("DigiAds"+JSON.stringify(req.body))
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
    timeSlots: timeSlots
  };
  campaigns.push(newCampaign);

  console.log('New campaign created:', newCampaign);
  res.json({ message: 'Campaign created successfully!', campaign: newCampaign });
});

// API to get all campaigns (for the admin)
app.get('/api/campaigns', (req, res) => {
  res.json({ campaigns });
});

// Route to serve the admin HTML page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
