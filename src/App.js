import React, { useState } from 'react';
import "./App.css"
import Menu from './components/Menu';
import ImageTagger from './components/ImageTagger';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function App() {
  const [labels, setLabels] = useState([])
  const [idSelectedLabel, setIdSelectedLabel] = useState(null)
  const [idHoverLabel, setIdHoverLabel] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const transformCoordinatesToYOLO = data => {
    const w = Math.abs(data.coordinates.endX - data.coordinates.startX);
    const h = Math.abs(data.coordinates.endY - data.coordinates.startY);
    const x = Math.min(data.coordinates.startX, data.coordinates.endX) + w / 2;
    const y = Math.min(data.coordinates.startY, data.coordinates.endY) + h / 2;
    data.yolo = {"x": x, "y": y, "w": w, "h": h};
  };

  const createTxtFile = (data, zip) => {
    const content = `class: ${data.name}, x: ${data.yolo.x}, y: ${data.yolo.y}, w: ${data.yolo.w}, h: ${data.yolo.h}`;
    zip.file(`file-${data.id}.txt`, content);
  };

  const handleDownload = () => {
    const zip = new JSZip();

    labels.forEach((data) => {
      transformCoordinatesToYOLO(data)
      createTxtFile(data, zip);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'data.zip');
    });
  };

  const finishTask = () => {
    if (currentImageIndex === 5 - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    // Post labels to server
    setLabels([])
    setIdSelectedLabel(null)
  };
  
  return (
    <div>
      <div className="main-container">
        <ImageTagger
          labels={labels}
          setLabels={setLabels}
          currentImageIndex={currentImageIndex}
          idSelectedLabel={idSelectedLabel}
          setIdSelectedLabel={setIdSelectedLabel}
          idHoverLabel={idHoverLabel}
        />
        <Menu
          labels={labels}
          setLabels={setLabels}
          idSelectedLabel={idSelectedLabel}
          setIdSelectedLabel={setIdSelectedLabel}
          idHoverLabel={idHoverLabel}
          setIdHoverLabel={setIdHoverLabel}
        />
      </div>
      <button style={{ marginLeft: "20px", padding: "10px" }} onClick={finishTask}>Next image</button>
      <button style={{ marginLeft: "20px", padding: "10px" }} onClick={handleDownload}>Download</button>

      <p>
        -------------------------- DEBUG ZONE -------------------------- <br/><br/>
        Selected ID: {JSON.stringify(idSelectedLabel)} <br/><br/>
        Hover ID: {JSON.stringify(idHoverLabel)} <br/><br/>
        ARRAY of labels: {JSON.stringify(labels)} <br/><br/>
      </p>
    </div>

  );
}

export default App;
