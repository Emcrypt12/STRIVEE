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
  content?: string;
  title?: string;
  done?: boolean;
}

export const sendMessageToAssistant = async (
  messages: Message[],
  onChunk: (chunk: StreamChunk) => void
): Promise<void> => {
  const response = await fetch(`${API_URL}/assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No reader available');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          onChunk(data);
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }
  }
};

export const sendMessageToChatbot = async (
  messages: Message[],
  isNewConversation: boolean,
  onChunk: (chunk: StreamChunk) => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, isNewConversation }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk(data);
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
}; 