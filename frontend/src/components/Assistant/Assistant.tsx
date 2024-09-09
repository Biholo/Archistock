import React, { useState } from 'react';
import ArchistockApiService from '../../services/ArchistockApiService';

const archistockApiService = new ArchistockApiService();

const Assistant = () => {
  const [botAssigned, setBotAssigned] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleContactBot = () => {
    setBotAssigned(true);
    setMessages((prevMessages) => [...prevMessages, { sender: 'ArchiBot', message: 'Bonjour 👋 ! Je suis Archi, votre assistant virtuel. En quoi puis-je vous aider ?' }]);
  };

  const handleSendMessage = async () => {
    if (messageInput) {
      // Add user message to chat
      setMessages((prevMessages) => [...prevMessages, { sender: 'Vous', message: messageInput }]);
      setLoading(true);

      try {
        archistockApiService.generateAiResponse(messageInput).then((data) => {
          if (data.response) {
            // Add bot response to chat
            setMessages((prevMessages) => [...prevMessages, { sender: 'ArchiBot', message: data.response }]);
          } else {
            setMessages((prevMessages) => [...prevMessages, { sender: 'ArchiBot', message: 'Notre robot est parti en vacances... Contactez nous dès maintenant: archistock@fiddle.fr' }]);
          }
        })
        
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [...prevMessages, { sender: 'ArchiBot', message: 'Notre robot est parti en vacances... Contactez nous dès maintenant: archistock@fiddle.fr' }]);
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
      <button
        className="fixed z-10 bottom-5 right-5 w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg"
        onClick={handleOpenMenu}
      >
        🤖
      </button>
      <div
        className={`fixed z-10 bottom-5 transition right-5 bg-white rounded-lg shadow-lg transition-transform duration-300 transform ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        } w-[500px] p-4`}
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold">Parler à ArchiBot</h1>
          <button className="btn bg-white border-none text-black hover:bg-slate-200 rounded-full ml-auto" onClick={handleOpenMenu}>
            X
          </button>
        </div>
        <p className='text-xs text-slate-500'>Archibot est un bot API propulsé par l'IA Google Gemini.</p>
        <div>
          <div>
            <h2 className="mt-1 text-xl font-bold">Messages:</h2>
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
            onChange={(e) => { 
              if (e.target.value.length <= 120) setMessageInput(e.target.value);}}
            placeholder="Ectivez votre message... (max 120 caractères)"
            disabled={loading}
          />
          <button className="btn btn-primary w-full mt-2 text-white" onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
