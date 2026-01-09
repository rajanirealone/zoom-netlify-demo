const axios = require("axios");

exports.handler = async () => {
  try {
    // 1️⃣ Get access token (Server-to-Server OAuth)
    const tokenRes = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "account_credentials",
          account_id: process.env.ZOOM_ACCOUNT_ID,
        },
        auth: {
          username: process.env.ZOOM_CLIENT_ID,
          password: process.env.ZOOM_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 2️⃣ Fetch meetings
    const meetingsRes = await axios.get(
      `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings?type=scheduled`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 3️⃣ Return meetings
    return {
      statusCode: 200,
      body: JSON.stringify(meetingsRes.data.meetings),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Zoom API failed",
        status: error.response?.status,
        zoomError: error.response?.data || error.message,
      }),
    };
  }
};
