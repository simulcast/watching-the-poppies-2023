import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const newSocket = io("https://watching-the-poppies-server.up.railway.app");
    setSocket(newSocket);

    newSocket.on("message", (message) => {
      // Handle incoming messages
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.slice(1));
      }, 15000);
    });

    newSocket.on("connect", () => {
      console.log("Connected to the backend server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage) return;
    socket.emit("message", { username, content: inputMessage });
    setInputMessage("");
  };

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`chat-container ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="chat-toggle" onClick={handleToggleClick}>
        {isExpanded ? "-" : "+"}
      </button>
      {isExpanded && (
        <div className="chat">
          <div className="messages">
            {messages.map((message, index) => (
              <p key={index}>
                <strong>{message.username}:</strong> {message.content}
              </p>
            ))}
          </div>
          <input
            type="text"
            placeholder="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default Chat;
