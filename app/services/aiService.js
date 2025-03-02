/**
 * AI Service
 * 
 * This module provides functions for interacting with OpenAI's API,
 * including generating responses and managing conversations.
 */

const OpenAI = require('openai');
const { OPENAI_CONFIG, SUPABASE_CONFIG } = require('../config');
const { supabase } = require('./supabase');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.apiKey
});

/**
 * Generate a response from the AI
 * @param {String} prompt - The user's message
 * @param {Array} history - Previous messages in the conversation
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - AI response
 */
const generateResponse = async (prompt, history = [], options = {}) => {
  try {
    const {
      model = OPENAI_CONFIG.model,
      temperature = OPENAI_CONFIG.temperature,
      maxTokens = OPENAI_CONFIG.maxTokens,
      systemPrompt = "You are a helpful assistant that provides clear and concise responses."
    } = options;

    // Format conversation history for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    });

    // Extract and return the response
    const response = completion.choices[0].message.content;
    return {
      content: response,
      model: completion.model,
      usage: completion.usage,
      created: completion.created
    };
  } catch (error) {
    console.error('AI response generation error:', error);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
};

/**
 * Save a conversation to the database
 * @param {String} userId - User ID
 * @param {String} title - Conversation title
 * @param {Array} messages - Conversation messages
 * @returns {Promise<Object>} - Saved conversation
 */
const saveConversation = async (userId, title, messages) => {
  try {
    // Create a new chat in the chats table
    const { data: chat, error: chatError } = await supabase
      .from(SUPABASE_CONFIG.tables.chats)
      .insert({
        user_id: userId,
        title: title || 'New Conversation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (chatError) {
      throw new Error(`Failed to create chat: ${chatError.message}`);
    }

    // Format messages for database
    const formattedMessages = messages.map((msg, index) => ({
      chat_id: chat.id,
      role: msg.role,
      content: msg.content,
      order: index,
      created_at: new Date().toISOString()
    }));

    // Insert messages into the messages table
    const { data: savedMessages, error: messagesError } = await supabase
      .from(SUPABASE_CONFIG.tables.messages)
      .insert(formattedMessages)
      .select();

    if (messagesError) {
      throw new Error(`Failed to save messages: ${messagesError.message}`);
    }

    return {
      chat,
      messages: savedMessages
    };
  } catch (error) {
    console.error('Save conversation error:', error);
    throw error;
  }
};

/**
 * Get a conversation from the database
 * @param {String} chatId - Chat ID
 * @returns {Promise<Object>} - Retrieved conversation
 */
const getConversation = async (chatId) => {
  try {
    // Get chat from the chats table
    const { data: chat, error: chatError } = await supabase
      .from(SUPABASE_CONFIG.tables.chats)
      .select('*')
      .eq('id', chatId)
      .single();

    if (chatError) {
      throw new Error(`Failed to get chat: ${chatError.message}`);
    }

    // Get messages from the messages table
    const { data: messages, error: messagesError } = await supabase
      .from(SUPABASE_CONFIG.tables.messages)
      .select('*')
      .eq('chat_id', chatId)
      .order('order', { ascending: true });

    if (messagesError) {
      throw new Error(`Failed to get messages: ${messagesError.message}`);
    }

    return {
      chat,
      messages
    };
  } catch (error) {
    console.error('Get conversation error:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - User's conversations
 */
const getUserConversations = async (userId) => {
  try {
    // Get all chats for the user
    const { data: chats, error } = await supabase
      .from(SUPABASE_CONFIG.tables.chats)
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user chats: ${error.message}`);
    }

    return chats;
  } catch (error) {
    console.error('Get user conversations error:', error);
    throw error;
  }
};

/**
 * Add a message to an existing conversation
 * @param {String} chatId - Chat ID
 * @param {String} role - Message role ('user' or 'assistant')
 * @param {String} content - Message content
 * @returns {Promise<Object>} - Added message
 */
const addMessageToConversation = async (chatId, role, content) => {
  try {
    // Get the current highest order value
    const { data: lastMessage, error: orderError } = await supabase
      .from(SUPABASE_CONFIG.tables.messages)
      .select('order')
      .eq('chat_id', chatId)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const order = lastMessage ? lastMessage.order + 1 : 0;

    // Add the new message
    const { data: message, error: messageError } = await supabase
      .from(SUPABASE_CONFIG.tables.messages)
      .insert({
        chat_id: chatId,
        role,
        content,
        order,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (messageError) {
      throw new Error(`Failed to add message: ${messageError.message}`);
    }

    // Update the chat's updated_at timestamp
    const { error: updateError } = await supabase
      .from(SUPABASE_CONFIG.tables.chats)
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId);

    if (updateError) {
      throw new Error(`Failed to update chat: ${updateError.message}`);
    }

    return message;
  } catch (error) {
    console.error('Add message error:', error);
    throw error;
  }
};

/**
 * Delete a conversation
 * @param {String} chatId - Chat ID
 * @returns {Promise<Object>} - Delete result
 */
const deleteConversation = async (chatId) => {
  try {
    // Delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from(SUPABASE_CONFIG.tables.messages)
      .delete()
      .eq('chat_id', chatId);

    if (messagesError) {
      throw new Error(`Failed to delete messages: ${messagesError.message}`);
    }

    // Delete the chat
    const { error: chatError } = await supabase
      .from(SUPABASE_CONFIG.tables.chats)
      .delete()
      .eq('id', chatId);

    if (chatError) {
      throw new Error(`Failed to delete chat: ${chatError.message}`);
    }

    return {
      success: true,
      message: 'Conversation deleted successfully'
    };
  } catch (error) {
    console.error('Delete conversation error:', error);
    throw error;
  }
};

module.exports = {
  openai,
  generateResponse,
  saveConversation,
  getConversation,
  getUserConversations,
  addMessageToConversation,
  deleteConversation
};
