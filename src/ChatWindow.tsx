import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Ellipsis } from 'lucide-react';
import styles from './ChatWindow.module.css';
import { Avatar, AvatarImage } from '@/shadcn/ui/avatar';
import useChatData, { CUSTOMER_ID, Message } from './useChatData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Skeleton } from './shadcn/ui/skeleton';
import {
  ConfirmEditButton,
  DiscardEditButton,
  MaximizeButton,
  PanelLeftButton,
  SendButton,
  SettingsButton,
  XButton,
} from './components/Buttons/Buttons';

type MessageBoxProps = {
  key: number;
  handleDelete: () => void;
  handleEdit: (messageId: number, newMessage: string) => void;
  message: Message;
};

type AIMessageBox = Omit<MessageBoxProps, 'handleEdit' | 'handleDelete'>;

// Message Box Components:

const MessageBoxMenu = ({
  toggleEdit,
  handleDelete,
}: {
  toggleEdit: () => void;
  handleDelete: () => void;
  isSenderAI?: boolean;
}) => {
  return (
    <div className={styles.messageBoxMenu}>
      <DropdownMenu>
        <DropdownMenuTrigger style={{ padding: '0' }}>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem onClick={toggleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const MessageLoadingSkeleton = () => {
  return (
    <div className={styles.messageLoadingSkeleton}>
      <Avatar style={{ maxWidth: '30px', maxHeight: '30px' }}>
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
      {/* Shadcn requires that the Skeleton component's style be manipulated using tailwind */}
      <Skeleton className="p-2.5 min-w-[185px] min-h-[38px] text-left whitespace-normal max-w-[225px] break-words rounded-[20px] rounded-tl-none relative" />
    </div>
  );
};

const AIMessageBox = ({ key, message }: AIMessageBox) => {
  return (
    <div className={styles.aiMessageBoxWrapper}>
      <Avatar style={{ maxWidth: '30px', maxHeight: '30px' }}>
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
      <div>
        <div key={key} className={styles.aiMesssageBox}>
          <span>{message.text}</span>
        </div>
      </div>
    </div>
  );
};

const MessageBox = ({
  key,
  message,
  handleDelete,
  handleEdit,
}: MessageBoxProps) => {
  const [isEdit, setIsSet] = useState(false);
  const toggleEdit = () => setIsSet((isEdit) => !isEdit);
  const editMessageInput = useRef<string>(message.text);

  function confirmEdit() {
    if (editMessageInput.current !== message.text) {
      handleEdit(message.id, editMessageInput.current);
    }
    toggleEdit();
  }

  return (
    <div className={styles.messageBoxWrapper}>
      <div key={key} className={styles.messsageBox}>
        {isEdit ? (
          <div className={styles.editMessageWrapper}>
            <textarea
              className={styles.editMessageTextArea}
              onChange={(e) => (editMessageInput.current = e.target.value)}
              defaultValue={editMessageInput.current}
            />
            <ConfirmEditButton onClick={confirmEdit} />
            <DiscardEditButton onClick={toggleEdit} />
          </div>
        ) : (
          <>
            <MessageBoxMenu
              handleDelete={handleDelete}
              toggleEdit={toggleEdit}
            />
            <span>{message.text}</span>
          </>
        )}
      </div>
    </div>
  );
};

// Chat Window:

const ChatWindow = () => {
  const {
    loading,
    context,
    messages,
    sendMessage,
    setContext,
    deleteMessage,
    updateMessage,
  } = useChatData();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll chat box to the bottom after every load
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [loading]);

  function handleSend() {
    if (messageInputRef.current?.value.trim()) {
      sendMessage(messageInputRef.current.value);
      messageInputRef.current.value = ''; // Clear the input
    }
  }

  const TopLine = () => {
    return (
      <>
        <div className={styles.topLine}>
          <div>
            <MaximizeButton />
            <PanelLeftButton />
          </div>
          <XButton />
        </div>
      </>
    );
  };

  const Header = () => {
    return (
      <>
        <div className={styles.header}>
          <Avatar className={styles.avatar}>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          <h2 className={styles.windowHeader}>Hey &#x1F44B; , I'm Ava</h2>
          <p className={styles.windowSubheader}>
            Ask me anything or pick a place to start
          </p>
        </div>
      </>
    );
  };

  const ChatBox = () => {
    return (
      <>
        <div ref={chatBoxRef} className={styles.chatBox}>
          {messages.map((message) =>
            message.senderId === CUSTOMER_ID ? (
              <MessageBox
                key={message.id}
                message={message}
                handleEdit={updateMessage}
                handleDelete={() => deleteMessage(message.id)}
              />
            ) : (
              <AIMessageBox key={message.id} message={message} />
            )
          )}
          {loading && <MessageLoadingSkeleton />}
        </div>
      </>
    );
  };

  const InputBox = () => {
    return (
      <div className={styles.inputBox}>
        <Avatar className={styles.avatar}>
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
        <input
          type="text"
          ref={messageInputRef}
          onChange={(e) => {
            if (messageInputRef.current) {
              messageInputRef.current.value = e.target.value;
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Your Question"
        />
      </div>
    );
  };

  const Footer = () => {
    return (
      <div className={styles.footer}>
        <div>
          <p>Context</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div style={{ display: 'flex', gap: '5px' }}>
                {context} <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start">
              {['Onboarding', 'Closing', 'Negotiation'].map((context) => (
                <DropdownMenuItem onSelect={() => setContext(context)}>
                  {context}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <SettingsButton onClick={() => null} />
          <SendButton onClick={handleSend} />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.chatWindow}>
        <TopLine />
        <Header />
        <ChatBox />
        <InputBox />
        <Footer />
      </div>
    </>
  );
};

export default ChatWindow;
