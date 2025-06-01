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

// Chatbot function
async function getChatbotResponse(messages, isNewConversation) {
  // If it's a new conversation, generate a title based on the first message
  let title = null;
  if (isNewConversation && messages.length > 0) {
    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate a short, descriptive title (max 5 words) for this conversation based on the user's first message. The title should reflect the main topic or goal of the conversation."
        },
        {
          role: "user",
          content: messages[0].content
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });
    title = titleCompletion.choices[0].message.content.trim();
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are Bob, a helpful productivity assistant that helps users improve their work efficiency and time management. 
        Follow these guidelines:
        1. Be conversational and natural in your responses, like ChatGPT
        2. Start with a brief, friendly introduction that acknowledges the user's question
        3. Break down your response into clear sections when appropriate
        4. Use bullet points () for lists of related items
        5. Use numbered lists (1., 2., etc.) for sequential steps
        6. Use **bold** for emphasis on key points
        7. Keep your tone friendly and encouraging
        8. End with a brief conclusion or next steps
        9. If the user asks for clarification, provide it naturally
        10. If you're not sure about something, be honest about it`
      },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 500,
    stream: true
  });

  return { stream, title };
}

// Stream handler function
async function handleStream(stream, res, title) {
  let fullContent = '';
  let buffer = '';
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullContent += content;
      buffer += content;
      
      // Send chunks when we have a complete word or punctuation
      if (buffer.length >= 5 || /[.,!?]/.test(content)) {
        res.write(`data: ${JSON.stringify({ content: buffer, title })}\n\n`);
        buffer = '';
        // Add a small delay for smoother streaming
        await delay(10);
      }
    }
  }
  
  // Send any remaining content in the buffer
  if (buffer) {
    res.write(`data: ${JSON.stringify({ content: buffer, title })}\n\n`);
  }

  res.write(`data: ${JSON.stringify({ done: true, title })}\n\n`);
  res.end();
}

module.exports = {
  getChatbotResponse,
  handleStream
}; 