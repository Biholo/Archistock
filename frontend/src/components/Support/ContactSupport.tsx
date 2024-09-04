import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

const ContactSupport = () => {
  const [supportAssigned, setSupportAssigned] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    socket.on('supportAssigned', ({ supportId }) => {
      console.log('You are connected with support:', supportId);
      setSupportAssigned(supportId);
      setLoading(false);
    });

    socket.on('receiveMessage', ({ message, senderId }) => {
      console.log('Message received:', message, 'from:', senderId);
      setMessages((prevMessages) => [...prevMessages, { senderId, message }]);
    });

    return () => {
      socket.off('supportAssigned');
      socket.off('receiveMessage');
    };
  }, []);

  const handleContactSupport = () => {
    socket.emit('contactSupport');
    setLoading(true);
  };

  const handleSendMessage = () => {
    if (supportAssigned && messageInput) {
      socket.emit('sendMessage', { recipientId: supportAssigned, message: messageInput });
      setMessages((prevMessages) => [...prevMessages, { senderId: 'You', message: messageInput }]);
      setMessageInput('');
    }
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setRequested(true);
    if(!supportAssigned && !requested) { socket.emit('contactSupport'); }
  }

  return (
    <div>
      {/* Button to toggle the support menu */}
      <button
        className="fixed bottom-5 right-5 w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg"
        onClick={() => {handleOpenMenu()}}
      >
        ?
      </button>

      {/* Sliding menu */}
      <div
        className={`fixed bottom-5 right-5 bg-white rounded-lg shadow-lg transition-transform duration-300 transform ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        } w-[500px] p-4`}
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <div className='flex flex-row'>
          <h1 className="text-2xl font-bold mb-4">Contact Support</h1>
          <button className="btn bg-white border-none text-black hover:bg-slate-200 rounded-full ml-auto" onClick={() => {handleOpenMenu()}}>X</button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          supportAssigned ? (
            <div>
              <p>You are connected with support: {supportAssigned}</p>
              <div>
                <h2 className="mt-5 text-xl font-bold">Messages:</h2>
                <ul className="overflow-auto h-32 mb-4">
                  {messages.map((msg, index) => (
                    <li key={index} className="mb-2"><strong>{msg.senderId}: </strong>{msg.message}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  className="input input-bordered w-full text-black"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message"
                />
                <button className="btn btn-primary w-full mt-2 text-white" onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary w-full text-white" onClick={handleContactSupport}>Contact Support</button>
          )
        )}
      </div>
    </div>
  );
};

export default ContactSupport;
