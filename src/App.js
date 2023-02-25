import React, { useState, useEffect } from 'react';
import "./App.css"
import Menu from './components/Menu';
import ImageTagger from './components/ImageTagger';

function App() {
  const [labels, setLabels] = useState([])

  return (
    <div className="main-container">
      <ImageTagger
        labels={labels}
        setLabels={setLabels}
      />
      <div className="labels-menu">
        <Menu 
          labels={labels}
          setLabels={setLabels}
        />
      </div>

    </div>
  );
}

export default App;
