const axios = require('axios');
const HttpError = require('../models/http-error');

const NOMINATIM_BASE = process.env.NOMINATIM_BASE

const USER_AGENT = process.env.GEOCODER_USER_AGENT

async function getCoordsForAddress(address) {
  if (!address || !address.trim()) {
    throw new HttpError('Address is required for geocoding.', 422);
  }

  try {
    const url = `${NOMINATIM_BASE}/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      timeout: 8000
    });

    const data = response.data;
    if (!Array.isArray(data) || data.length === 0) {
      throw new HttpError('Could not find location for the specified address.', 404);
    }

    const { lat, lon } = data[0];
    const latNum = Number(lat);
    const lngNum = Number(lon);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      throw new HttpError('Geocoding returned invalid coordinates.', 502);
    }

    return { lat: latNum, lng: lngNum };
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError('Geocoding service failed. Please try again later.', 502);
  }
}

module.exports = getCoordsForAddress;