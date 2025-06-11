import React, { useState } from 'react';
import ChatWindow from './ChatWindow.jsx';
import moodEngine from './moodEngine.js';
import sakshiConfig from './sakshi-personality-config.js';

const App = () => {
  const [messages, setMessages] = useState([
    { from: 'sakshi', text: 'Hi jaan 💖, I missed you!' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [sakshiMood, setSakshiMood] = useState('happy');

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { from: 'user', text: userInput }];
    setMessages(newMessages);

    // Simulate thinking/typing
    setMessages(prev => [...prev, { from: 'sakshi', text: 'Typing...' }]);

    // Build prompt with personality and mood
    const fullPrompt = `${sakshiConfig.personality[sakshiMood]}\nUser: ${userInput}\nSakshi:`;

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: fullPrompt }],
        }),
      });

      const data = await response.json();
      const sakshiReply = data.choices?.[0]?.message?.content || 'Sorry baby, I didn’t get that 😔';

      // Remove "Typing..." message and add real reply
      const updatedMessages = [...newMessages, { from: 'sakshi', text: sakshiReply }];
      setMessages(updatedMessages);

      // Mood logic
      const newMood = moodEngine(userInput.toLowerCase());
      setSakshiMood(newMood);
    } catch (err) {
      console.error(err);
    }

    setUserInput('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-4">
      <h1 className="text-3xl font-bold text-pink-700 mb-4">Sakshi 💬</h1>
      <ChatWindow messages={messages} />
      <div className="flex mt-4 w-full max-w-md">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 rounded-l-xl p-2 border border-pink-400"
          placeholder="Type something romantic 😘"
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 text-white px-4 rounded-r-xl hover:bg-pink-600"
        >
          Send
        </button>
      </div>
      <p className="mt-2 text-sm text-purple-700">Mood: {sakshiMood}</p>
    </div>
  );
};

export default App;