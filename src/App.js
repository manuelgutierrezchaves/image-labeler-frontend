import React, { useState } from 'react';
import "./App.css"
import Menu from './components/Menu';
import ImageTagger from './components/ImageTagger';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function App() {
  const [allLabels, setAllLabels] = useState({"0":[],"1":[],"2":[],"3":[],"4":[]})
  const [labels, setLabels] = useState([])
  const [idSelectedLabel, setIdSelectedLabel] = useState(null)
  const [idHoverLabel, setIdHoverLabel] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const finishTask = () => {
    // Post labels to server
    setAllLabels({...allLabels, [currentImageIndex]: labels})
    setLabels(allLabels[currentImageIndex === 5 - 1 ? 0 : currentImageIndex + 1])
    setCurrentImageIndex(currentImageIndex === 5 - 1 ? 0 : currentImageIndex + 1);
    setIdSelectedLabel(null)
  };

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

    allLabels.forEach((data) => {
      transformCoordinatesToYOLO(data)
      createTxtFile(data, zip);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'data.zip');
    });
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
        Image ID: {JSON.stringify(currentImageIndex)} <br/><br/>
        ARRAY of labels: {JSON.stringify(labels)} <br/><br/>
        ARRAY of all labels: {JSON.stringify(allLabels)} <br/><br/>
      </p>
    </div>

  );
}

export default App;
