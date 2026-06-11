// Generate CSV from thread data
function generateCSV(threadData) {
  const { title, posts } = threadData;

  // CSV headers
  const headers = ['レス番号', '日時', '投稿者', '内容'];

  // Build CSV rows
  const rows = posts.map(post => {
    return [
      escapeCSV(post.num),
      escapeCSV(post.date),
      escapeCSV(post.author),
      escapeCSV(post.content)
    ];
  });

  // Combine headers and rows
  const allRows = [headers, ...rows];

  // Convert to CSV string (with proper line breaks for Windows)
  const csvContent = allRows.map(row => row.join(',')).join('\r\n');

  // Add BOM for proper UTF-8 handling in Excel
  const BOM = '﻿';

  return BOM + csvContent;
}

// Escape CSV field (handle quotes and commas)
function escapeCSV(field) {
  if (!field) return '""';

  const fieldStr = String(field);

  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
    return `"${fieldStr.replace(/"/g, '""')}"`;
  }

  return fieldStr;
}

module.exports = {
  generateCSV
};
