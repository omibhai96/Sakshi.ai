
import React, { useState } from 'react';
import axios from 'axios';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const newMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    const response = await axios.post("https://api.deepseek.com/v1/chat/completions", {
      model: import.meta.env.VITE_MODEL,
      messages: [{ role: "user", content: input }]
    }, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
      }
    });

    const reply = response.data.choices[0].message.content;
    setMessages(prev => [...prev, { sender: "sakshi", text: reply }]);
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4 flex flex-col h-[90vh]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-pink-100 self-start"}`}>
            <b>{msg.sender === "user" ? "You" : "Sakshi"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border rounded px-2 py-1" />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-1 rounded">Send</button>
      </div>
    </div>
  );
}
