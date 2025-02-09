const Url = require('../models/Url');
const isEmpty = require('../utils/isEmpty')


// get the specific URL analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const alias = req.params.alias;
    if(isEmpty(alias)) {
      return res.status(403).json({ message: 'Input params should not be empty' });
    }
    const url = await Url.findOne({ shortUrl: alias });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    const totalClicks = url.analytics.length;
    const uniqueUsers = new Set(url.analytics.map((entry) => entry.ip)).size;

 
    const clicksByDate = [];
    const dateMap = {};

    url.analytics.forEach(visit => {
      const date = visit.timestamp.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      clicksByDate.push({ date: formattedDate, clickCount: dateMap[formattedDate] || 0 });
    }

    // Group by OS type
    const osType = {};
    url.analytics.forEach(visit => {
      const os = visit.osName || 'Unknown';
      if (!osType[os]) {
        osType[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      osType[os].uniqueClicks += 1;
      osType[os].uniqueUsers.add(visit.ip);
    });

    const osTypeArray = Object.keys(osType).map(osName => ({
      osName,
      uniqueClicks: osType[osName].uniqueClicks,
      uniqueUsers: osType[osName].uniqueUsers.size,
    }));

    // Group by device type
    const deviceType = {};
    url.analytics.forEach(visit => {
      const device = visit.deviceType || 'Unknown';
      if (!deviceType[device]) {
        deviceType[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      deviceType[device].uniqueClicks += 1;
      deviceType[device].uniqueUsers.add(visit.ip);
    });

    const deviceTypeArray = Object.keys(deviceType).map(deviceName => ({
      deviceName,
      uniqueClicks: deviceType[deviceName].uniqueClicks,
      uniqueUsers: deviceType[deviceName].uniqueUsers.size,
    }));

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osTypeArray,
      deviceType: deviceTypeArray,
    });

  } catch (error) {
    console.log("getAnalytics error - ",error)
    res.status(500).json({ message: 'Error getAnalytics URL', error });
  }
}


// Get URLs analytics for particular topic
exports.getTopicsAnalytics = async (req, res, next) => {
  try {
    
  } catch (error) {
    console.log("getTopicsAnalytics error - ",error)
    res.status(500).json({ message: 'Error in getTopicsAnalytics' });
  }
}


// Get all URLs analytics
exports.allURLAnalytics = async (req, res, next) => {
  try {
    
  } catch (error) {
    console.log("allURLAnalytics error - ",error)
    res.status(500).json({ message: 'Server Error' });
  }
}
