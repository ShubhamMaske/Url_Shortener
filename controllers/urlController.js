

exports.createShortUrl = async (req, res) => {
  try {

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
