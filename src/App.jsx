import { useState } from 'react';
import styles from "./App.module.css"
import profilePicture from './profilePicture.png';
import editarIcon from './editar.png';
import excluirIcon from './excluir.png';
const TweetBox = ({ placeholder = "O que está acontecendo?", maxLength = 125, onTweet }) => {
  const [text, setText] = useState('');

  function onTextChange(event) {
    const newText = event.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
    }
  }
  function handleTweet() {
    if (text.trim()) {
      onTweet({
        text,
        profilePicture,
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false
      });
      setText('');
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#ccc'
      }}>
        <img
          src={profilePicture}
          alt="Foto de Perfil"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <textarea
          placeholder={placeholder}
          value={text}
          onChange={onTextChange}
          style={{ width: '100%', height: '100px', padding: '10px' }}
        ></textarea>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px'
        }}>
          <span>{text.length} / {maxLength}</span>
          <button onClick={handleTweet} style={{
            backgroundColor: '#1da1f2',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer'
          }}>
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

const TweetList = ({
  tweets,
  onLike,
  onEdit,
  editingIndex,
  editingText,
  setEditingText,
  maxLength,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => (
  <div style={{
    margin: '40px auto 0 auto',
    maxWidth: '600px',
    background: '#f5f8fa',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    padding: '20px',
    minHeight: '150px'
  }}>
    <h3 style={{ marginBottom: '16px', color: '#1da1f2' }}>Últimos Tweets</h3>
    {tweets.length === 0 ? (
      <p style={{ color: '#888' }}>Nenhum tweet ainda.</p>
    ) : (
      tweets.slice().reverse().map((tweet, idx) => {
        const realIdx = tweets.length - 1 - idx;
        const isEditing = editingIndex === realIdx;
        // Função utilitária para mostrar tempo relativo
        function timeAgo(dateString) {
          const now = new Date();
          const posted = new Date(dateString);
          const diff = Math.floor((now - posted) / 1000); // em segundos

          if (diff < 60) return 'agora mesmo';
          if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
          if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
          return `${posted.toLocaleDateString()} ${posted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        return (
          <div key={realIdx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '10px 0',
            borderBottom: idx !== tweets.length - 1 ? '1px solid #e1e8ed' : 'none'
          }}>
            <img
              src={tweet.profilePicture}
              alt="Foto de Perfil"
              style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              {isEditing ? (
          <>
            <textarea
              value={editingText}
              onChange={e => {
                if (e.target.value.length <= maxLength) setEditingText(e.target.value);
              }}
              style={{ width: '100%', height: '60px', padding: '6px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span>{editingText.length} / {maxLength}</span>
              <div>
                <button onClick={() => onSaveEdit(realIdx)} style={{ marginRight: 8, background: '#1da1f2', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}>Salvar</button>
                <button onClick={onCancelEdit} style={{ background: '#ccc', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          </>
              ) : (
          <>
            <span style={{ color: '#14171a', display: 'block', marginBottom: '4px' }}>{tweet.text}</span>
            <span style={{ color: '#657786', fontSize: '12px', marginRight: '8px' }}>
              {timeAgo(tweet.createdAt)}
            </span>
            <button
              onClick={() => onLike(realIdx)}
              style={{
                marginLeft: '16px',
                background: 'none',
                border: 'none',
                color: tweet.liked ? '#e0245e' : '#657786',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              aria-label="Curtir"
            >
              ♥ {tweet.likes}
            </button>
            <button
              onClick={() => onEdit(realIdx, tweet.text)}
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                color: '#1da1f2',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <img src={editarIcon} alt="Editar" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />
            </button>
            <button
              onClick={() => onDelete(realIdx)}
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <img src={excluirIcon} alt="Editar" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />
            </button>
          </>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
);

function App() {
  const [tweets, setTweets] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const maxLength = 125;

  function addTweet(newTweet) {
    setTweets(prev => [...prev, newTweet]);
  }

  function handleLike(index) {
    setTweets(prevTweets =>
      prevTweets.map((tweet, i) =>
        i === index
          ? {
              ...tweet,
              likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1,
              liked: !tweet.liked
            }
          : tweet
      )
    );
  }

  function handleEdit(index, text) {
    setEditingIndex(index);
    setEditingText(text);
  }

  function handleSaveEdit(index) {
    setTweets(prevTweets =>
      prevTweets.map((tweet, i) =>
        i === index
          ? { ...tweet, text: editingText.slice(0, maxLength) }
          : tweet
      )
    );
    setEditingIndex(null);
    setEditingText('');
  }

  function handleCancelEdit() {
    setEditingIndex(null);
    setEditingText('');
  }

  function handleDelete(index) {
    setTweets(prevTweets => prevTweets.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingText('');
    }
  }

  return (
    <div className={styles.appContainer}>
      <TweetBox placeholder={'O que está acontecendo?'} maxLength={maxLength} onTweet={addTweet} />
      <div style={{ height: '40vh' }} />
      <TweetList
        tweets={tweets}
        onLike={handleLike}
        onEdit={handleEdit}
        editingIndex={editingIndex}
        editingText={editingText}
        setEditingText={setEditingText}
        maxLength={maxLength}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App
