"use client";

import React, { useState } from "react";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded p-4">
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded mb-2 text-gray-800">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded text-gray-800"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
