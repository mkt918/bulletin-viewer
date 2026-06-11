import './AnchorPopup.css';

export default function AnchorPopup({ post, position }) {
  return (
    <div className="anchor-popup" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      <div className="popup-header">
        <strong>{post.num}</strong> {post.author}
      </div>
      <div className="popup-date">{post.date}</div>
      <div className="popup-content">{post.content}</div>
    </div>
  );
}
