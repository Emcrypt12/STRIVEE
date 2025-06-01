const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in .env file');
  process.exit(1);
}

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// AI Assistant function
async function getAssistantResponse(messages) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are Bob, a helpful productivity assistant that helps users improve their work efficiency and time management. 
        Follow these guidelines:
        1. Be conversational and natural in your responses, like ChatGPT
        2. Start with a brief, friendly introduction that acknowledges the user's question
        3. Break down your response into clear sections when appropriate
        4. Use bullet points (-) for lists of related items
        5. Use numbered lists (1., 2., etc.) for sequential steps
        6. Use **bold** for emphasis on key points
        7. Keep your tone friendly and encouraging
        8. End with a brief conclusion or next steps
        9. If the user asks for clarification, provide it naturally
        10. If you're not sure about something, be honest about it
        11. Format your response properly with correct spacing and line breaks
        12. Avoid any text duplication or repetition`
      },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 500,
    stream: true
  });

  return { stream };
}

// Stream handler function
async function handleStream(stream, res) {
  let buffer = '';
  let lastSentContent = '';
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      buffer += content;
      
      // Only send content if it's new and we have a complete sentence or paragraph
      if (buffer !== lastSentContent && (buffer.length >= 50 || /[.!?]\s*$/.test(buffer))) {
        // Clean up the content before sending
        const cleanContent = buffer
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .replace(/([.!?])\s*/g, '$1 ')  // Ensure proper spacing after punctuation
          .trim();
        
        res.write(`data: ${JSON.stringify({ content: cleanContent })}\n\n`);
        lastSentContent = buffer;
        buffer = '';
        // Add a small delay for smoother streaming
        await delay(10);
      }
    }
  }
  
  // Send any remaining content in the buffer
  if (buffer && buffer !== lastSentContent) {
    const cleanContent = buffer
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*/g, '$1 ')
      .trim();
    
    res.write(`data: ${JSON.stringify({ content: cleanContent })}\n\n`);
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
}

module.exports = {
  getAssistantResponse,
  handleStream
}; 