import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef } from 'react';
import "../styles/ImageTagger.css"


function ImageTagger({ labels, setLabels }) {

  const classes = [{"name": "manzana", "color": "red"}, {"name": "pera", "color": "green"}, {"name": "platano", "color": "yellow"}]

  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState({startX: 0, startY: 0, endX: 0, endY: 0})
  const [labelClass, setLabelClass] = useState({})
  const rectangleCanvasRef = useRef(null);
  const labelsCanvasRef = useRef(null);

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
    // Clear last rectangle on drawing canvas
    rectangleCanvasRef.current.getContext('2d').clearRect(0, 0, 1000000, 1000000);
  };

  const drawRectangle = () => {
    const canvas = rectangleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = coordinates.endX - coordinates.startX;
    const height = coordinates.endY - coordinates.startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = labelClass.color
    ctx.strokeRect(coordinates.startX, coordinates.startY, width, height);
  };

  const drawLabels = () => {
    const canvas = labelsCanvasRef.current;
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
  <div className="image-labeling">
    <img src={require("../images/example.jpg")} alt="Image" />
    <canvas
      ref={labelsCanvasRef}
      width={600}
      height={400}
    />
    <canvas
      ref={rectangleCanvasRef}
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
    {JSON.stringify(labels)}
  </div>
  )
}

export default ImageTagger