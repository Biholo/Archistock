import React, { useState } from 'react';

const Assistant = () => {
  const [botAssigned, setBotAssigned] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleContactBot = () => {
    setBotAssigned(true);
    setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', message: 'Hello! How can I assist you today?' }]);
  };

  const handleSendMessage = async () => {
    if (messageInput) {
      // Add user message to chat
      setMessages((prevMessages) => [...prevMessages, { sender: 'You', message: messageInput }]);
      setLoading(true);

      try {
        // Send message to Flask backend
        const response = await fetch('http://localhost:5000/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageInput }),
        });

        const data = await response.json();
        if (data.response) {
          // Add bot response to chat
          setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', message: data.response }]);
        } else {
          setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', message: 'Something went wrong!' }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [...prevMessages, { sender: 'Bot', message: 'Failed to connect to the bot!' }]);
      } finally {
        setLoading(false);
        setMessageInput('');
      }
    }
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!botAssigned) handleContactBot();
  };

  return (
    <div>
      {/* Button to toggle the assistant menu */}
      <button
        className="fixed z-10 bottom-5 right-5 w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg"
        onClick={handleOpenMenu}
      >
        🤖
      </button>

      {/* Sliding menu */}
      <div
        className={`fixed z-10 bottom-5 transition right-5 bg-white rounded-lg shadow-lg transition-transform duration-300 transform ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        } w-[500px] p-4`}
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold mb-4">Chat with Assistant</h1>
          <button className="btn bg-white border-none text-black hover:bg-slate-200 rounded-full ml-auto" onClick={handleOpenMenu}>
            X
          </button>
        </div>

        <div>
          <div>
            <h2 className="mt-5 text-xl font-bold">Messages:</h2>
            <ul className="overflow-auto h-32 mb-4">
              {messages.map((msg, index) => (
                <li key={index} className="mb-2">
                  <strong>{msg.sender}: </strong>{msg.message}
                </li>
              ))}
            </ul>
          </div>

          <input
            type="text"
            className="input input-bordered text-white w-full"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message"
            disabled={loading}
          />
          <button className="btn btn-primary w-full mt-2 text-white" onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
