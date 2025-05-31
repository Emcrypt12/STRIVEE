import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotResponse {
  role: 'assistant';
  content: string;
  title?: string;
}

export interface StreamChunk {
  content: string;
  title?: string;
  done?: boolean;
}

export const sendMessageToAssistant = async (messages: Message[]) => {
  try {
    const response = await axios.post(`${API_URL}/assistant`, { messages });
    return response.data;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw error;
  }
};

export const sendMessageToChatbot = async (
  messages: Message[], 
  isNewConversation: boolean = false,
  onChunk: (chunk: StreamChunk) => void
) => {
  try {
    const response = await fetch(`${API_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, isNewConversation }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          onChunk(data);
        }
      }
    }
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
}; 