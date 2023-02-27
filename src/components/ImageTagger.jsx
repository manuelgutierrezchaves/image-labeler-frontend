import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef } from 'react';
import "../styles/ImageTagger.css"
import image1 from '../images/1.jpg';
import image2 from '../images/2.jpg';
import image3 from '../images/3.jpg';
import image4 from '../images/4.jpg';
import image5 from '../images/5.jpg';

const images = [image1, image2, image3, image4, image5]


function ImageTagger({ labels, setLabels, currentImageIndex, idSelectedLabel, setIdSelectedLabel }) {

  const classes = [{"name": "manzana", "color": "red"}, {"name": "pera", "color": "green"}, {"name": "platano", "color": "yellow"}]

  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState({startX: 0, startY: 0, endX: 0, endY: 0})
  const [labelClass, setLabelClass] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rectangleCanvasRef = useRef(null);
  const labelsCanvasRef = useRef(null);
  const selectedLabelCanvasRef = useRef(null);

  const handleMouseDown = (event) => {
    if (labelClass) {
      const { offsetX, offsetY } = event.nativeEvent;
      setIsDrawing(true);
      setCoordinates({ startX: offsetX, startY: offsetY });
    } else {
      const { offsetX, offsetY } = event.nativeEvent;
      labels.forEach(label => {
        const rectX = Math.min(label.coordinates.startX, label.coordinates.endX);
        const rectY = Math.min(label.coordinates.startY, label.coordinates.endY);
        const rectWidth = Math.abs(label.coordinates.endX - label.coordinates.startX);
        const rectHeight = Math.abs(label.coordinates.endY - label.coordinates.startY);
        
        if (offsetX >= rectX && offsetX <= rectX + rectWidth &&
            offsetY >= rectY && offsetY <= rectY + rectHeight) {
          if (idSelectedLabel === label.id_label) {
            setIdSelectedLabel(null)
          } else {
            setIdSelectedLabel(label.id_label)
          }
        }
      })
      // Comprobar si esta dentro de algun label
    }
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (isDrawing) {
      setCoordinates({...coordinates, endX: offsetX, endY: offsetY });
    }
    if (!isDrawing) {
      setMousePosition({ x: offsetX, y: offsetY });
      drawCrosshair();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setLabels([...labels, {
        id_label: uuidv4(),
        name: labelClass.name,
        color: labelClass.color,
        coordinates: coordinates,
        hover: false}])}
    setIsDrawing(false);
    setLabelClass(false)
    // Clear last rectangle on drawing canvas
    rectangleCanvasRef.current.getContext('2d').clearRect(0, 0, 1000000, 1000000);
  };
  
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
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
      if (label.id_label !== idSelectedLabel) {
        const width = label.coordinates.endX - label.coordinates.startX;
        const height = label.coordinates.endY - label.coordinates.startY;
        ctx.strokeStyle = label.color
        ctx.lineWidth = label.hover ? 8 : 1
        ctx.strokeRect(label.coordinates.startX, label.coordinates.startY, width, height);
      }
    });
  };

  const drawSelectedLabel = () => {
    const canvas = selectedLabelCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labels.forEach(label => {
      if (label.id_label === idSelectedLabel) {
        const width = label.coordinates.endX - label.coordinates.startX;
        const height = label.coordinates.endY - label.coordinates.startY;
        ctx.strokeStyle = label.color
        ctx.lineWidth = label.hover ? 8 : 4
        ctx.strokeRect(label.coordinates.startX, label.coordinates.startY, width, height);
      }
    });
  };
  
  const drawCrosshair = () => {
    const canvas = rectangleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 10000;
    const { x, y } = mousePosition;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  };

  const handleClickClasses = (classObj) => {
    if (idSelectedLabel != null) {
      const newLabels = [...labels];
      const label = newLabels.find(l => l.id_label === idSelectedLabel);
      if (label) {
        label.name = classObj.name;
        label.color = classObj.color;
        setLabels(newLabels);
      }
    } else {
      setLabelClass(classObj)
    }
  }

  useEffect(() => {
    drawLabels()
    drawSelectedLabel()
  }, [labels, idSelectedLabel])

  return (
  <div className="image-labeling">
    <div className="image-canvas">
      <img src={images[currentImageIndex]} alt="Image" />
      <canvas
        ref={labelsCanvasRef}
        width={600}
        height={400}
      />
      <canvas
        ref={selectedLabelCanvasRef}
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
        onMouseLeave={handleMouseLeave}
      />
    </div>

    <div>
      {classes.map((classObj, index) => (
        <button
          key={index}
          style={{
            backgroundColor: classObj.color,
            border: labelClass.name === classObj.name ? '2px solid black' : 'none'
          }}
          onClick={() => handleClickClasses(classObj)}
        >
          {labelClass.name === classObj.name && <span>✔️ </span>}
          {classObj.name}
        </button>
      ))}
    </div>

    {isDrawing && drawRectangle()}
  </div>
  )
}

export default ImageTagger