"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';

type Message = {
  id: number;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: string;
};

const API_URL = 'http://localhost:8000/messages'; // Замените на ваш URL API

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get<Message[]>(API_URL);
      setMessages(response.data);
      console.log(messages)
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') {
      return;
    }
    const newMessage: Message = {
      id: 1,
      text: inputText,
      likes: 0,
      dislikes: 0,
      timestamp: new Date().toISOString(),
    };
  
    try {
      const response = await axios.post<Message>(API_URL, newMessage);
      const createdMessage = response.data;
      setMessages([...messages, { ...createdMessage, id: messages.length + 1 }]);
      setInputText('');
  
      // Обновление списка сообщений
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleLikeClick = async (messageId: number) => {
    try {
      const updatedMessages = messages.map((message) => {
        if (message.id === messageId) {
          if (message.dislikes === 1) {
            return { ...message, dislikes: 0, likes: 1 };
          } else if (message.likes === 1) {
            return { ...message, likes: 0 };
          } else {
            return { ...message, likes: 1 };
          }
        }
        return message;
      });
      setMessages(updatedMessages);

      const response = await axios.put(`${API_URL}/${messageId}/like`); // Используйте метод put
      console.log(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDislikeClick = async (messageId: number) => {
    try {
      const updatedMessages = messages.map((message) => {
        if (message.id === messageId) {
          if (message.likes === 1) {
            return { ...message, likes: 0, dislikes: 1 };
          } else if (message.dislikes === 1) {
            return { ...message, dislikes: 0 };
          } else {
            return { ...message, dislikes: 1 };
          }
        }
        return message;
      });
      setMessages(updatedMessages);

      const response = await axios.put(`${API_URL}/${messageId}/dislike`); // Используйте метод put
      console.log(response.data);

    } catch (error) {
      console.error(error);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const isOdd = (id: number) => {
    return id % 2 !== 0;
  };

  return (
    <div style={{ background: '#000033', color: 'white' }} className='m-16 rounded-lg shadow'>
      <h1 className='font-bold flex justify-center p-2'>My chat</h1>
      <div className='space-y-4 mt-2 '>
      {messages.map((message) => (
          <div
            key={message.id} // Add key prop with unique value
            style={{
              background: isOdd(message.id) ? '#0075FF' : 'white',
              width: isOdd(message.id) ? '70%' : '70%',
              marginRight: isOdd(message.id) ? 'auto' : '',
              marginLeft: isOdd(message.id) ? '' : 'auto',
              minHeight: '90px'
            }}
            className={`flex items-start ${isOdd(message.id) ? 'justify-start' : 'justify-end'} p-2 m-2 rounded`}
          >
            <div>
              <div className='text-lg font-bold' style={{ color: isOdd(message.id) ? 'white' : 'black' }}>{message.text}</div>
              <div className='text-sm' style={{ color: isOdd(message.id) ? 'white' : 'black' }}>{message.timestamp}</div>
              <div className={`mt-2 space-x-4 ${isOdd(message.id) ? 'hidden' : ''}`}>
                <button
                  className={`text-sm hover:opacity-20 font-medium ${message.likes === 1 ? 'text-black' : ''}`}
                  onClick={() => handleLikeClick(message.id)}
                >
                  👍 {message.likes}
                </button>
                <button
                  className={`text-sm hover:opacity-20 font-medium ${message.dislikes === 1 ? 'text-red-500' : ''}`}
                  onClick={() => handleDislikeClick(message.id)}
                >
                  👎 {message.dislikes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-4 p-2  flex items-center space-x-2'>
        <input
          type='text'
          className='border w-full text-black border-gray-300 rounded-lg py-2 px-4'
          value={inputText}
          onChange={handleInputChange}
          placeholder="Ask me something"
        />
        <button
          style={{ background: '#0075FF', color: 'white' }}
          className='py-2 px-4 rounded-lg font-medium'
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;