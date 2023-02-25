import React, { useState, useRef, useEffect } from 'react';
import "./App.css"
import Menu from './components/Menu';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const classes = [{"name": "manzana", "color": "red"}, {"name": "pera", "color": "green"}, {"name": "platano", "color": "yellow"}]

  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState({startX: 0, startY: 0, endX: 0, endY: 0})
  const [labels, setLabels] = useState([])
  const [labelClass, setLabelClass] = useState({})
  const canvasRef = useRef(null);

  const handleMouseDown = (event) => {
    if (labelClass != {}) {
      const { offsetX, offsetY } = event.nativeEvent;
      setIsDrawing(true);
      setCoordinates({ startX: offsetX, startY: offsetY });
    }
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (isDrawing) {
      setCoordinates({...coordinates, endX: offsetX, endY: offsetY })}
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setLabels([...labels, {
        id_label: uuidv4(),
        name: labelClass.name,
        color: labelClass.color,
        coordinates: coordinates}])}
    setIsDrawing(false);
    setLabelClass({})
  };

  const drawRectangle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = coordinates.endX - coordinates.startX;
    const height = coordinates.endY - coordinates.startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = labelClass.color
    ctx.strokeRect(coordinates.startX, coordinates.startY, width, height);
  };

  const drawLabels = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labels.forEach(label => {
      const width = label.coordinates.endX - label.coordinates.startX;
      const height = label.coordinates.endY - label.coordinates.startY;
      ctx.strokeStyle = label.color
      ctx.strokeRect(label.coordinates.startX, label.coordinates.startY, width, height);
    });
  };

  useEffect(() => {
    drawLabels()
  }, [labels])

  return (
    <div className="main-container">
      <div className="image-labeling">
        <img src={require("./images/example.jpg")} alt="Image" />
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
        />

        <div>
          {classes.map((classObj, index) => (
            <button
              key={index}
              style={{
                backgroundColor: classObj.color,
                border: labelClass.name === classObj.name ? '2px solid black' : 'none'
              }}
              onClick={() => setLabelClass(classObj)}
            >
              {labelClass.name === classObj.name && <span>✔️ </span>}
              {classObj.name}
            </button>
          ))}
        </div>

        {isDrawing && drawRectangle()}
      </div>
      <div className="labels-menu">
        <Menu items={labels} />
      </div>
    </div>
  );
}

export default App;
