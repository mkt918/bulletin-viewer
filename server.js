require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { scrapeThread } = require('./scraper');
const { generateCSV } = require('./csv-generator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Memory cache for thread data
const cache = {};

// API Endpoints

// GET /api/thread/:id - Fetch thread data
app.get('/api/thread/:id', async (req, res) => {
  try {
    const threadId = req.params.id;

    // Check cache first
    if (cache[threadId] && Date.now() - cache[threadId].timestamp < 3600000) {
      return res.json({
        success: true,
        data: cache[threadId].data,
        cached: true
      });
    }

    // Scrape thread data
    const threadData = await scrapeThread(threadId);

    // Cache the result
    cache[threadId] = {
      data: threadData,
      timestamp: Date.now()
    };

    res.json({
      success: true,
      data: threadData,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/download/:id - Download thread as CSV
app.get('/api/download/:id', async (req, res) => {
  try {
    const threadId = req.params.id;

    // Use cached data if available, otherwise scrape
    let threadData = cache[threadId]?.data;
    if (!threadData) {
      threadData = await scrapeThread(threadId);
    }

    // Generate CSV
    const csvContent = generateCSV(threadData);

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="thread_${threadId}.csv"`);

    res.send(csvContent);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Bulletin Viewer API listening on http://localhost:${PORT}`);
});
