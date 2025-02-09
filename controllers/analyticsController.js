
// get the specific URL analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    

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
