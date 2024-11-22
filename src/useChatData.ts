import axios from 'axios';
import { useEffect, useState } from 'react';

export type Message = {
  id: number;
  senderId: number;
  text: string;
};

export type UseChatDataReturn = {
  messages: Message[];
  context: string;
  sendMessage: (text: string) => Promise<boolean>;
  updateMessage: (messageId: number, newText: string) => Promise<boolean>;
  deleteMessage: (messageId: number) => Promise<boolean>;
  setContext: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
};

const BASE_URL = 'http://127.0.0.1:8000';
export const CUSTOMER_ID = 23;

const useChatData = (): UseChatDataReturn => {
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('Onboarding'); // use Enum for this
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, senderId: 121, text: "Hello! I'm here to help." },
  ]);

  async function __fetchChat() {
    setLoading(true);
    try {
      const resp = await axios.get<Message[]>(`${BASE_URL}/chat`);
      setMessages(resp.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    __fetchChat();
  }, []);

  async function sendMessage(message: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: -1,
        senderId: CUSTOMER_ID,
        text: message,
      },
    ]);
    setLoading(true);
    try {
      const resp = await axios.post<{
        id: number;
        response: string;
        messages: Message[];
      }>(`${BASE_URL}/chat`, {
        userId: CUSTOMER_ID,
        message,
        context,
      });
      setMessages(resp.data.messages);
    } finally {
      setLoading(false);
    }

    return true;
  }
  async function updateMessage(messageId: number, newMessage: string) {
    setMessages((prev) => {
      const lastMsgIndex = prev.findIndex((m) => m.id === messageId);

      return [
        ...prev.slice(0, lastMsgIndex),
        {
          id: -1,
          senderId: CUSTOMER_ID,
          text: newMessage,
        },
      ];
    });
    setLoading(true);
    try {
      const resp = await axios.put<{
        id: number;
        updatedMessages: Message[];
      }>(`${BASE_URL}/chat/${messageId}`, {
        newMessage,
      });
      setMessages(resp.data.updatedMessages);
    } finally {
      setLoading(false);
    }
    return false;
  }
  // TODO: implement error handling
  async function deleteMessage(messageId: number) {
    try {
      const resp = await axios.delete<{
        id: number;
        status: string;
        updatedMessages: Message[];
      }>(`${BASE_URL}/chat/${messageId}`);
      setMessages(resp.data.updatedMessages);
    } catch (e) {
      console.log('ERROR deleting');
    }
    return false;
  }

  return {
    deleteMessage,
    loading,
    messages,
    context,
    setContext,
    sendMessage,
    updateMessage,
  };
};

export default useChatData;
