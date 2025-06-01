const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { getChatbotResponse, handleStream: handleChatbotStream } = require('./langchain');
const { getAssistantResponse, handleStream: handleAssistantStream } = require('./assistant');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in .env file');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// AI Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { stream } = await getAssistantResponse(messages);
    await handleAssistantStream(stream, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { messages, isNewConversation } = req.body;
    
    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { stream, title } = await getChatbotResponse(messages, isNewConversation);
    await handleChatbotStream(stream, res, title);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 