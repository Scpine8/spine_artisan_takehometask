import ChatWindow from './ChatWindow';
import styles from './App.module.css';

function App() {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.chatWindowContainer}>
          <ChatWindow />
        </div>
      </div>
    </>
  );
}

export default App;
