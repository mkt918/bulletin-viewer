import { useState } from 'react';
import AnchorPopup from './AnchorPopup';
import './PostItem.css';

export default function PostItem({ post, threadId, allPosts }) {
  const [hoveredAnchor, setHoveredAnchor] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  // Parse content and render with anchor links
  const renderContent = () => {
    const content = post.content;
    // Match >>number pattern
    const parts = content.split(/(&gt;&gt;|\>\>)(\d+)/g);

    return parts.map((part, idx) => {
      if (part === '>>' || part === '&gt;&gt;') {
        return null; // Skip separator
      }

      if (/^\d+$/.test(part)) {
        // This is an anchor number
        return (
          <span
            key={idx}
            className="anchor-link"
            onMouseEnter={(e) => {
              setHoveredAnchor(part);
              const rect = e.currentTarget.getBoundingClientRect();
              setPopupPos({
                x: rect.left,
                y: rect.bottom + 5
              });
            }}
            onMouseLeave={() => setHoveredAnchor(null)}
          >
            &gt;&gt;{part}
          </span>
        );
      }

      return part;
    });
  };

  const targetPost = hoveredAnchor
    ? allPosts.find(p => p.num === hoveredAnchor || p.num == hoveredAnchor)
    : null;

  return (
    <div className="post-item">
      <div className="post-header">
        <span className="post-num">{post.num}</span>
        <span className="post-author">{post.author}</span>
        <span className="post-date">{post.date}</span>
      </div>
      <div className="post-content">
        {renderContent()}
      </div>

      {hoveredAnchor && targetPost && (
        <AnchorPopup post={targetPost} position={popupPos} />
      )}
    </div>
  );
}
