// evoc-backend/config/db.js
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');

// Initialize the database driver
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Instantiate the Prisma 7 adapter
const adapter = new PrismaPg(pool);

// Export a single PrismaClient instance with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
