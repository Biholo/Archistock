import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

const ContactSupport = () => {
  const [supportAssigned, setSupportAssigned] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {

    socket.on('supportAssigned', ({ supportId }) => {
      console.log('You are connected with support:', supportId);
      setSupportAssigned(supportId);
    });

    socket.on('receiveMessage', ({ message, senderId }) => {
        console.log('Message received:', message, 'from:', senderId);
      setMessages((prevMessages) => [...prevMessages, { senderId, message }]);
    });

    return () => {
      socket.off('clientsWaiting');
      socket.off('supportAssigned');
      socket.off('receiveMessage');
    };
  }, []);

  const handleContactSupport = () => {
    socket.emit('contactSupport');
  };

  const handleSendMessage = () => {
    if (supportAssigned && messageInput) {
        socket.emit('sendMessage', { recipientId: supportAssigned, message: messageInput });
        setMessageInput('');
        setMessages((prevMessages) => [...prevMessages, { senderId: 'You', message: messageInput }]);
    }
  };

  return (
    <div>
      <h1 className='text-4xl font-bold'>Contact Support</h1>
      {supportAssigned ? (
        <div>
          <p>You are connected with support: {supportAssigned}</p>
          <div>
            <h2 className='mt-5 text-xl font-bold'>Messages:</h2>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}><strong>{msg.senderId}: </strong>{msg.message}</li>
              ))}
            </ul>
            <input
              type="text"
              className='input input-bordered w-full max-w-xs text-white'
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message"
            />
            <button className='btn btn-primary text-white' onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <button className='btn btn-primary text-white' onClick={handleContactSupport}>Contact Support</button>
      )}
    </div>
  );
};

export default ContactSupport;
