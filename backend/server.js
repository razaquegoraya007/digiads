const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // You can change this port if needed

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Temporary in-memory storage for campaigns
let campaigns = [];

// API to create a new campaign
app.post('/api/create-campaign', (req, res) => {
  const { uniqueCampaignName, uniqueDescription, uniqueLocation, uniqueVideoUrl } = req.body;

  // Store the campaign data
  const newCampaign = {
    name: uniqueCampaignName,
    description: uniqueDescription,
    location: uniqueLocation,
    videoUrl: uniqueVideoUrl,
  };
  campaigns.push(newCampaign);

  // Log the new campaign and respond
  console.log('New campaign created:', newCampaign);
  res.json({ message: 'Campaign created successfully!', campaign: newCampaign });
});

// API to get all campaigns (for the admin)
app.get('/api/campaigns', (req, res) => {
  res.json({ campaigns });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
