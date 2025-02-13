const Url = require('../models/url');
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
    const topic = req.params.topic;
    const userId = req.user.id;

    if(isEmpty(topic)) {
      return res.status(403).json({ message: 'Input params should not be empty' });
    }

    const urls = await Url.find({ topic, userId });

    if (!urls.length) {
        return res.status(404).json({ message: "No URLs found for this topic." });
    }

    let totalClicks = 0;
    let uniqueUsersSet = new Set();
    let clicksByDate = {};

    const urlsData = urls.map((url) => {
      totalClicks += url.analytics.length;
      url.analytics.forEach((entry) => uniqueUsersSet.add(entry.ip));

      url.analytics.forEach((entry) => {
        const date = entry.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });

      return {
        shortUrl: `/api/shorten/${url.alias}`,
        totalClicks: url.analytics.length,
        uniqueUsers: new Set(url.analytics.map((entry) => entry.ip)).size,
      };
    });

    const clicksByDateArray = Object.entries(clicksByDate)
      .map(([date, count]) => ({ date, count }));

    res.json({
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate: clicksByDateArray,
      urls: urlsData,
    });
  } catch (error) {
    console.log("getTopicsAnalytics error - ",error)
    res.status(500).json({ message: 'Error in getTopicsAnalytics' });
  }
}


// Get all URLs analytics
exports.allURLAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const urls = await Url.find({ userId });

    let totalUrls = urls.length;
    let totalClicks = 0;
    let uniqueUsersSet = new Set();
    let clicksByDate = {};
    let osType = {};
    let deviceType = {};

    urls.forEach((url) => {
        totalClicks += url.analytics.length;

        url.analytics.forEach((entry) => {
        uniqueUsersSet.add(entry.ip);

        // Group clicks by date
        const date = entry.timestamp.toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        // Group by OS type
        const osName = entry.os || 'Unknown';
        if (!osType[osName]) {
            osType[osName] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        osType[osName].uniqueClicks += 1;
        osType[osName].uniqueUsers.add(entry.ip);

        // Group by device type
        const deviceName = entry.device || 'Unknown';
        if (!deviceType[deviceName]) {
            deviceType[deviceName] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        deviceType[deviceName].uniqueClicks += 1;
        deviceType[deviceName].uniqueUsers.add(entry.ip);
        });
    });

    // Converting osType and deviceType sets into arrays with unique user counts
    const osTypeArray = Object.entries(osType).map(([osName, data]) => ({
        osName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
    }));

    const deviceTypeArray = Object.entries(deviceType).map(([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
    }));

    const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
        date,
        count,
    }));

    res.json({
        totalUrls,
        totalClicks,
        uniqueUsers: uniqueUsersSet.size,
        clicksByDate: clicksByDateArray,
        osType: osTypeArray,
        deviceType: deviceTypeArray,
    });
  } catch (error) {
    console.log("allURLAnalytics error - ",error)
    res.status(500).json({ message: 'Server Error' });
  }
}
