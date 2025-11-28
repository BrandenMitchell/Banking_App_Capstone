import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/authContext";
import "../css/dashboard.css";
import "../css/sidebar.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, loading } = useContext(AuthContext);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: "assistant-welcome",
      sender: "assistant",
      content: "Hi! I'm your local AI assistant. Ask me anything about your finances.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!authUser) {
        navigate("/");
      } else {
        setUser({
          fullName: authUser.username || "",
          email: authUser.email || "",
          phone: authUser.phoneNumber || "",
        });
      }
    }
  }, [authUser, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const buildPayload = (messages) =>
    messages.map((msg) => ({
      role: msg.sender === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const newMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: chatInput.trim(),
    };

    const nextMessages = [...chatMessages, newMessage];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: buildPayload(nextMessages) }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Chat service unavailable");
      }

      const assistantReply = data.reply?.trim();
      if (assistantReply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: "assistant",
            content: assistantReply,
          },
        ]);
      }
    } catch (err) {
      setChatError(err.message || "Something went wrong");
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#001524",
          color: "#ffecd1",
          fontFamily: "Inter, sans-serif",
          fontSize: "18px",
          letterSpacing: "0.5px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        onSelectOverview={() => navigate("/dashboard")}
        onNavigateAccounts={() => navigate("/accounts")}
        onNavigateProfile={() => navigate("/profile")}
        onNavigateChat={() => navigate("/chat")}
        onLogout={handleLogout}
        active="chat"
      />

      <main className="main-content chat-main">
        <header className="dashboard-header chat-header-card">
          <div className="chat-page-header">
            <h1 className="dashboard-title">AI Banking Assistant</h1>
            <p className="chat-page-subtitle">
              Chat with the assistant to get budgeting tips, explain recent transactions, or plan your next move.
            </p>
          </div>
        </header>

        <section className="chat-section chat-section--full">
          <div className="chat-header">
            <h3 className="section-title">Conversation</h3>
            <span className={`chat-status ${chatLoading ? "chat-status--thinking" : "chat-status--idle"}`}>
              {chatLoading ? "Thinking..." : "Online"}
            </span>
          </div>
          <div className="chat-window">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <span className="chat-message-label">{msg.sender === "assistant" ? "Assistant" : "You"}</span>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          {chatError && <p className="chat-error">{chatError}</p>}
          <form className="chat-input-row" onSubmit={handleChatSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about spending insights, saving tips..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" className="chat-send-btn" disabled={chatLoading}>
              {chatLoading ? "Sending..." : "Send"}
            </button>
          </form>
          <p className="chat-helper-text">Responses are generated locally. No data leaves your device.</p>
        </section>
      </main>
    </div>
  );
};

export default ChatPage;

