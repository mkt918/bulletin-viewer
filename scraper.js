const axios = require('axios');
const cheerio = require('cheerio');

// Scrape a thread from bakusai.com
async function scrapeThread(threadId) {
  try {
    // Build the URL for the thread
    // Example: https://bakusai.com/thr_res/acode=5/ctgid=104/bid=523/tid=13309333
    const url = `https://bakusai.com/thr_res/acode=5/ctgid=104/bid=523/tid=${threadId}`;

    // Fetch the page with a proper User-Agent
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Parse thread title
    const title = $('title').text().trim();

    // Parse posts/responses
    const posts = [];

    // Common selectors for posts on bakusai-like boards
    // Adjust these based on actual HTML structure
    $('.res-item, .post, [class*="post"]').each((index, element) => {
      const $post = $(element);

      // Extract post number
      const postNum = $post.find('[class*="num"], .post-num').text().trim();

      // Extract date/time
      const dateStr = $post.find('[class*="date"], .post-date, .time').text().trim();

      // Extract author name
      const author = $post.find('[class*="name"], .post-name, .author').text().trim();

      // Extract post content
      const content = $post.find('[class*="message"], .post-content, .body').text().trim();

      if (content) {
        posts.push({
          num: postNum || index + 1,
          date: dateStr,
          author: author || 'Anonymous',
          content: content
        });
      }
    });

    return {
      id: threadId,
      title: title,
      posts: posts,
      postCount: posts.length,
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw new Error(`Failed to scrape thread ${threadId}: ${error.message}`);
  }
}

module.exports = {
  scrapeThread
};
