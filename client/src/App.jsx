import { useState } from 'react'
import ThreadViewer from './components/ThreadViewer'
import './App.css'

function App() {
  const [threadId, setThreadId] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleLoadThread = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setThreadId(inputValue.trim())
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>掲示板ビューアー</h1>
        <p>掲示板スレッドの見やすいビューアー</p>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <div className="input-section">
            <h3>スレッド検索</h3>
            <form onSubmit={handleLoadThread}>
              <input
                type="text"
                placeholder="スレッド ID を入力"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="thread-input"
              />
              <button type="submit" className="search-btn">
                読み込む
              </button>
            </form>
          </div>

          <div className="info-section">
            <h3>使い方</h3>
            <ul>
              <li>スレッド ID を入力して「読み込む」をクリック</li>
              <li>レス内の <code>&gt;&gt;番号</code> にマウスオーバーするとプレビュー表示</li>
              <li>「CSV ダウンロード」でスレッド全体をエクスポート</li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <ThreadViewer threadId={threadId} />
        </main>
      </div>

      <footer className="app-footer">
        <p>掲示板ビューアー v1.0</p>
      </footer>
    </div>
  )
}

export default App
