import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!input) return;
    setChat([...chat, { sender: "You", text: input }]);
    const res = await fetch("https://somil-ai-hcmc.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setChat([...chat, { sender: "You", text: input }, { sender: "Bot", text: data.response }]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Chatbot</h2>
      <div style={{ minHeight: 200, border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {chat.map((msg, i) => (
          <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: "80%" }}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App
