import React, { useState } from 'react';
import "./App.css"
import Menu from './components/Menu';
import ImageTagger from './components/ImageTagger';

function App() {
  const [labels, setLabels] = useState([])
  const [idSelectedLabel, setIdSelectedLabel] = useState(0)
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
          idSelectedLabel={idSelectedLabel}
        />
        <Menu
          labels={labels}
          setLabels={setLabels}
          idSelectedLabel={idSelectedLabel}
          setIdSelectedLabel={setIdSelectedLabel}
        />
      </div>
      <button onClick={finishTask}>Send</button>
      <p>
        DEBUG ZONE <br/><br/>
        Selected ID: {JSON.stringify(idSelectedLabel)} <br/><br/>
        ARRAY of labels: {JSON.stringify(labels)} <br/><br/>
      </p>
    </div>

  );
}

export default App;
