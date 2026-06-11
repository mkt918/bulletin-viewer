import { useState, useEffect } from 'react';
import PostItem from './PostItem';
import './ThreadViewer.css';

export default function ThreadViewer({ threadId }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!threadId) return;

    const fetchThread = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/thread/${threadId}`);
        if (!response.ok) throw new Error('Failed to fetch thread');

        const data = await response.json();
        if (data.success) {
          setTitle(data.data.title);
          setPosts(data.data.posts);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(`/api/download/${threadId}`);
      if (!response.ok) throw new Error('Failed to download CSV');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thread_${threadId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Download failed: ${err.message}`);
    }
  };

  if (!threadId) {
    return (
      <div className="thread-viewer">
        <div className="no-thread">
          <h2>スレッドを選択してください</h2>
          <p>上部のフォーム からスレッド ID を入力してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="thread-viewer">
      <div className="thread-header">
        <h1>{title || `Thread ${threadId}`}</h1>
        <button className="download-btn" onClick={handleDownloadCSV} disabled={loading}>
          📥 CSV ダウンロード
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">読み込み中...</div>}

      {!loading && posts.length > 0 && (
        <div className="posts-container">
          <div className="post-count">全 {posts.length} レス</div>
          {posts.map((post, index) => (
            <PostItem key={index} post={post} threadId={threadId} allPosts={posts} />
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="no-posts">投稿がありません</div>
      )}
    </div>
  );
}
