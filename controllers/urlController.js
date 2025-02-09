const Url = require('../models/Url');
const redisClient = require('../config/redisClient');
const nanoid = require('nanoid');
const isEmpty = require('../utils/isEmpty')
const useragent = require('useragent');
const geoip = require('geoip-lite');

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
      const { alias } = req.params;
      if(isEmpty(alias)) {
        return res.status(403).json({ message: 'Input url should not be empty' });
      }
      let longUrl = await redisClient.get(alias);
      if (!longUrl) {
        const url = await Url.findOne({ shortUrl: alias });
        if (!url) {
          return res.status(404).json({ message: 'URL not found' });
        }

        const agent = useragent.parse(req.headers['user-agent']);
        const osName = agent.os.toString();
        const deviceType = agent.device.family.toLowerCase().includes('mobile') ? 'mobile' : 'desktop';

        // Getting the userIP and user-agent
        const userAgent = req.headers['user-agent'];
        const ip = req.ip;

        const geo = geoip.lookup(ip) || {};
        const geolocation = {
          country: geo.country || 'Unknown',
          region: geo.region || 'Unknown',
          city: geo.city || 'Unknown',
        };

        url.analytics.push({ 
          userAgent, 
          ip, 
          geolocation, 
          osName,
          deviceType, 
        });
        await url.save();

        longUrl = url.longUrl;
        await redisClient.setEx(alias, 3600, longUrl);
      }
      res.redirect(longUrl);
    } catch (error) {
      console.log("redirectUrl error - ",error)
      res.status(500).json({ message: 'Error redirecting URL', error });
    }
  };
