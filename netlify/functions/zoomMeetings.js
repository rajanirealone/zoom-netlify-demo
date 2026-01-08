const axios = require("axios");

exports.handler = async () => {
  try {
    const tokenRes = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "account_credentials",
          account_id: process.env.ZOOM_ACCOUNT_ID
        },
        auth: {
          username: process.env.ZOOM_CLIENT_ID,
          password: process.env.ZOOM_CLIENT_SECRET
        }
      }
    );

    const accessToken = tokenRes.data.access_token;

    const meetingsRes = await axios.get(
      "https://api.zoom.us/v2/users/me/meetings?type=upcoming",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(meetingsRes.data.meetings)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Zoom API failed" })
    };
  }
};