'use strict';

const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/orbit360';
  try {
    await mongoose.connect(uri);
    console.log('[MongoDB] Connected');
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
  }
}

module.exports = { connectMongo };
