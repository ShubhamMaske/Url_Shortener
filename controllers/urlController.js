const Url = require('../models/Url');
const redisClient = require('../config/redisClient');
const nanoid = require('nanoid');
const isEmpty = require('../utils/isEmpty')

exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    if(isEmpty(longUrl)) {
      return res.status(403).json({ message: 'Input url should not be empty' });
    }
    const userId = req.user.id;
    const shortUrl = customAlias || nanoid(6);
    const newUrl = new Url({ longUrl, shortUrl, customAlias, topic, userId });
    await newUrl.save();
    await redisClient.setEx(shortUrl, 3600, longUrl);
    res.status(201).json({ shortUrl, createdAt: newUrl.createdAt });
  } catch (error) {
    console.log("createShortUrl error - ",error)
    res.status(500).json({ message: 'Error creating short URL', error });
  }
};


exports.redirectUrl = async (req, res) => {
    try {
      
    } catch (error) {
      console.log("redirectUrl error - ",error)
      res.status(500).json({ message: 'Error redirecting URL', error });
    }
  };
