import React, { useState } from 'react';
import "./App.css"
import Menu from './components/Menu';
import ImageTagger from './components/ImageTagger';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';
import image5 from './images/5.jpg';

function App() {
  const [allLabels, setAllLabels] = useState({})
  const [labels, setLabels] = useState([])
  const [idSelectedLabel, setIdSelectedLabel] = useState(null)
  const [idHoverLabel, setIdHoverLabel] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([image1, image2, image3, image4, image5]);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      setImages([...images, event.target.result]);
    };
    reader.readAsDataURL(file);
  };

  const nextImage = () => {
    // Post labels to server
    setAllLabels({...allLabels, [currentImageIndex]: labels});
    setLabels(currentImageIndex + 1 in allLabels ? allLabels[currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1] : [])
    setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
    setIdSelectedLabel(null);
  };

  const transformCoordinatesToYOLO = data => {
    const w = Math.abs(data.coordinates.endX - data.coordinates.startX);
    const h = Math.abs(data.coordinates.endY - data.coordinates.startY);
    const x = Math.min(data.coordinates.startX, data.coordinates.endX) + w / 2;
    const y = Math.min(data.coordinates.startY, data.coordinates.endY) + h / 2;
    data.yolo = {"x": x, "y": y, "w": w, "h": h};
  };

  const createTxtFile = (data, zip, index) => {
    const content = data.map(item => `${item.name} ${item.yolo.x} ${item.yolo.y} ${item.yolo.w} ${item.yolo.h}`).join('\n');
    zip.file(`file-${index}.txt`, content);
  };

  const handleDownload = () => {
    const zip = new JSZip();
    for (const key in allLabels) {
      allLabels[key].forEach((data) => {
        transformCoordinatesToYOLO(data);
      })
      createTxtFile(allLabels[key], zip, key);
    };
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
          images={images}
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
      <button style={{ marginLeft: "20px", padding: "10px" }} onClick={nextImage}>Next image</button>
      <button style={{ marginLeft: "20px", padding: "10px" }} onClick={handleDownload}>Download</button>
      <input style={{ marginLeft: "20px", padding: "10px" }} type="file" onChange={handleFileUpload} />
      {/* <p>
        -------------------------- DEBUG ZONE -------------------------- <br/><br/>
        Selected ID: {JSON.stringify(idSelectedLabel)} <br/><br/>
        Hover ID: {JSON.stringify(idHoverLabel)} <br/><br/>
        Image ID: {JSON.stringify(currentImageIndex)} <br/><br/>
        ARRAY of labels: {JSON.stringify(labels)} <br/><br/>
        ARRAY of all labels: {JSON.stringify(allLabels)} <br/><br/>
      </p> */}
    </div>

  );
}

export default App;
