const axios = require("axios");

exports.handler = async () => {
  try {
    // Use JWT token for simplicity
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { iss: process.env.ZOOM_API_KEY, exp: ((new Date()).getTime() + 5000) },
      process.env.ZOOM_API_SECRET
    );

    const meetingsRes = await axios.get(
      `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings?type=upcoming`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(meetingsRes.data.meetings)
    };
  } catch (error) {
    console.log(error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.response?.data || error.message })
    };
  }
};
