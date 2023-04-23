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
  const [isFirstUpload, setIsFirstUpload] = useState(true);

  function handleFileUpload(event) {
    const files = event.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = function (event) {
        newImages.push(event.target.result);

        if (newImages.length === files.length) {
          if (isFirstUpload) {
            setAllLabels({})
            setLabels([])
            setIdSelectedLabel(null)
            setIdHoverLabel(null)
            setCurrentImageIndex(0)
            setImages(newImages);
            setIsFirstUpload(false);
          } else {
            setImages([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const nextImage = () => {
    setAllLabels({...allLabels, [currentImageIndex]: labels});
    let nextImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    setLabels(nextImageIndex in allLabels ? allLabels[nextImageIndex] : []);
    setCurrentImageIndex(nextImageIndex);
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

      <label style={{ marginLeft: "20px", padding: "10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>
        Next image
        <button onClick={nextImage} style={{ display: "none" }} />
      </label>

      <label style={{ marginLeft: "20px", padding: "10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>
        Download labels
        <button onClick={handleDownload} style={{ display: "none" }} />
      </label>

      <label style={{ marginLeft: "20px", padding: "10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>
        Upload Images
        <input type="file" style={{ display: "none" }} multiple onChange={handleFileUpload} />
      </label>
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
