import React, { useState } from 'react';
import "./App.css"
import Menu from './components/Menu';
import ImageTagger from './components/ImageTagger';

function App() {
  const [labels, setLabels] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const finishTask = () => {
    if (currentImageIndex === 5 - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    // Post labels to server
    setLabels([])
  };
  
  return (
    <div>
      <div className="main-container">
        <ImageTagger
          labels={labels}
          setLabels={setLabels}
          currentImageIndex={currentImageIndex}
        />
        <Menu
          labels={labels}
          setLabels={setLabels}
        />
      </div>
      <button onClick={finishTask}>Send</button>
    </div>

  );
}

export default App;
