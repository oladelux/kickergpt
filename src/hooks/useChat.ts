import { useState, useEffect } from 'react';
import { chatService, ChatMessage } from '@/services/chat.service';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load chat history on mount
    chatService.getChatHistory().subscribe({
      next: (history) => setMessages(history),
      error: (err) => setError(err.message),
    });
  }, []);

  const sendMessage = (content: string) => {
    setLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    return new Promise<ChatMessage>((resolve, reject) => {
      chatService.sendMessage(content).subscribe({
        next: (response) => {
          setMessages((prev) => [...prev, response]);
          setLoading(false);
          resolve(response);
        },
        error: (err) => {
          setLoading(false);
          setError(err.message);
          reject(err);
        },
      });
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
};
