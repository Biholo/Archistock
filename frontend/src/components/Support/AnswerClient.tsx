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
      setMessages((prevMessages) => [...prevMessages, { senderId: 'You', message: messageInput }]);
      setMessageInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className='text-4xl font-bold'>Answer Client</h1>
      {supportAssigned ? (
        <div className="flex flex-col flex-grow">
          <p className="mb-4">You are connected with client: {supportAssigned}</p>
          <div className="flex flex-col flex-grow bg-blue-100 p-4 rounded overflow-y-auto max-h-full">
            <h2 className='text-xl font-bold mb-4'>Messages:</h2>
            <ul className="flex flex-col space-y-2">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`flex ${msg.senderId === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.senderId === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                    }`}
                  >
                    <strong>{msg.senderId === 'You' ? 'You' : 'Client'}: </strong><br/>{msg.message}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-row w-full'>
            <input
              type="text"
              value={messageInput}
              className='input input-bordered w-full max-w-xs text-white'
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message"
            />
            <button className='btn btn-primary text-white ml-2' onClick={handleSendMessage}>
              Send
            </button>
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
