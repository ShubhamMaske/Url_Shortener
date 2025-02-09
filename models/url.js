const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  userAgent: String,
  ip: String,
  geolocation: {
    country: String,
    region: String,
    city: String,
  },
  osName: String,
  deviceType: String,
});



const urlSchema = new mongoose.Schema({
    longUrl: { 
      type: String, 
      required: true 
    },
    shortUrl: { 
      type: String, 
      required: true, 
      unique: true 
    },
    customAlias: { 
      type: String 
    },
    topic: { 
      type: String 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    analytics: [analyticsSchema],
  });


  module.exports = mongoose.model('Url', urlSchema);