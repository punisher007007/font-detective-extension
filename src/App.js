import React, { useState } from 'react';

const App = () => {
  const [selectedFont, setSelectedFont] = useState('');

  const detectFont = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        document.addEventListener('mouseover', (e) => {
          const computedFont = window.getComputedStyle(e.target).fontFamily;
          chrome.runtime.sendMessage({ font: computedFont });
        });
      }
    });
  };

  chrome.runtime.onMessage.addListener((request) => {
    setSelectedFont(request.font);
  });

  return (
    <div className="container">
      <h2>Font Detective</h2>
      <button onClick={detectFont}>Start Detection</button>
      {selectedFont && (
        <div className="font-info">
          <p>Detected Font:</p>
          <p className="font-name">{selectedFont}</p>
        </div>
      )}
    </div>
  );
};

export default App;