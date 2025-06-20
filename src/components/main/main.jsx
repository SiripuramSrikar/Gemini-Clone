import React, { useState, useRef } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import generateResponse from '../../genai';

const Main = () => {
  const [input, setInput] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResponseGenerated, setIsResponseGenerated] = useState(false);
  const bufferRef = useRef('');
  const typingIntervalRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const promptToSend = input;
    setInput('');
    setOutput('');
    bufferRef.current = '';
    setLoading(true);
    setIsResponseGenerated(false);

    try {
      await generateResponse(promptToSend, (chunk) => {
        const cleanedChunk = chunk
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();

        bufferRef.current += cleanedChunk;

        if (!typingIntervalRef.current) {
          typingIntervalRef.current = setInterval(() => {
            if (bufferRef.current.length > 0) {
              const char = bufferRef.current[0];
              bufferRef.current = bufferRef.current.slice(1);
              setOutput((prev) => prev + char);
            } else {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
              setIsResponseGenerated(true);
              setLoading(false);
              setLastPrompt(promptToSend);
            }
          }, 20);
        }
      });
    } catch (error) {
      setOutput('Error: Failed to generate response.');
      console.error(error);
      setIsResponseGenerated(true);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (isResponseGenerated) {
      setIsResponseGenerated(false);
      setOutput('');
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="user" />
      </div>

      <div className="main-container">
        {(isResponseGenerated || loading) && (
          <div className="chat-output">
            <div className="chat-row-user">
              <img src={assets.user_icon} alt="User" />
              <p>{lastPrompt}</p>
            </div>

            <div className="chat-row-ai">
              <img src={assets.gemini_icon} alt="AI" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p className="response">{output}</p>
              )}
            </div>
          </div>
        )}

        {/* Show greetings and cards only if no response generated and not loading */}
        {!isResponseGenerated && !loading && (
          <>
            <div className="greet">
              <p><span>Hello, Dev.</span></p>
              <p>How can I help you today</p>
            </div>

            <div className="cards">
              <div className="card" onClick={() => setInput("Suggest beautiful places to see on an upcoming road trip")}>
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={() => setInput("Briefly summarize this concept: urban planning")}>
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card" onClick={() => setInput("Brainstorm team bonding activities for our work retreat")}>
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={() => setInput("Tell me about React js and React native")}>
                <p>Tell me about React js and React native</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter the prompt"
              value={input}
              onChange={handleInputChange}
              disabled={loading}
            />
            <div
              onClick={handleSend}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img src={assets.send_icon} alt="Send" />
            </div>
          </div>

          {!isResponseGenerated && !loading && (
            <p className="bottom-info">
              Gemini may display inaccurate info, including about people, so
              double-check its responses. Your privacy and Gemini Apps
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
