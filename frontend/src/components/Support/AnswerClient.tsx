import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

const AnswerClient = () => {
  const [clientsWaiting, setClientsWaiting] = useState<{ id: string }[]>([]);
  const [supportAssigned, setSupportAssigned] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  useEffect(() => {
    socket.on('clientsWaiting', (clients) => {
      setClientsWaiting(clients);
    });

    socket.on('connected', ({ clientId }) => {
      console.log('Connected to client:', clientId);
      setSupportAssigned(clientId);
      setSelectedClient(clientId);
    });

    socket.on('receiveMessage', ({ message, senderId }) => {
      setMessages((prevMessages) => [...prevMessages, { senderId, message }]);
    });

    return () => {
      socket.off('clientsWaiting');
      socket.off('connected');
      socket.off('receiveMessage');
    };
  }, []);

  const handleAnswerClient = (clientId: string) => {
    socket.emit('answerClient', { clientId });
  };

  const handleSendMessage = () => {
    if (selectedClient && messageInput) {
      socket.emit('sendMessage', { recipientId: selectedClient, message: messageInput });
      setMessageInput('');
      setMessages((prevMessages) => [...prevMessages, { senderId: 'You', message: messageInput }]);

    }
  };

  return (
    <div>
      <h1 className='text-4xl font-bold'>Answer Client</h1>
      {supportAssigned ? (
        <div>
          <p>You are connected with client: {supportAssigned}</p>
          <div>
            <h2 className='mt-5 text-xl font-bold'>Messages:</h2>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}><strong>{msg.senderId}: </strong>{msg.message}</li>
              ))}
            </ul>
            <input
              type="text"
              value={messageInput}
              className='input input-bordered w-full max-w-xs text-white'
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message"
            />
            <button className='btn btn-primary text-white' onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className='text-xl'>Clients Waiting:</h2>
          <ul>
            {clientsWaiting.map((client) => (
              <li key={client.id}>
                {client.id}{' '}
                <button className="btn btn-primary text-white" onClick={() => handleAnswerClient(client.id)}>
                  Answer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnswerClient;
