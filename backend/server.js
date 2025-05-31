const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// AI Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a productivity assistant that helps users improve their work efficiency and time management. Provide specific, actionable advice based on their questions. Always format your responses with clear bullet points or numbered lists for better readability."
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ 
      role: 'assistant',
      content: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { messages, isNewConversation } = req.body;
    
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
    
    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are StriveBot, a helpful productivity assistant that helps users improve their work efficiency and time management. 
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
          10. If you're not sure about something, be honest about it`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    });

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
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 