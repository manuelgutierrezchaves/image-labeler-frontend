import React from 'react';
import { useState, useEffect, useRef } from 'react';
import "../styles/ImageTagger.css"
import LabelModel from '../objects/LabelModel';
import image1 from '../images/1.jpg';
import image2 from '../images/2.jpg';
import image3 from '../images/3.jpg';
import image4 from '../images/4.jpg';
import image5 from '../images/5.jpg';

const images = [image1, image2, image3, image4, image5]

function ImageTagger({ labels, setLabels, currentImageIndex, idSelectedLabel, setIdSelectedLabel, idHoverLabel }) {

  const classes = [
    {"name": "manzana", "color": "red"},
    {"name": "pera", "color": "green"},
    {"name": "platano", "color": "yellow"},
    {"name": "limon", "color": "aqua"}]

  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState({startX: 0, startY: 0, endX: 0, endY: 0})
  const [labelClass, setLabelClass] = useState(null)
  const [labelMove, setLabelMove] = useState(null)
  const [moved, setMoved] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rectangleCanvasRef = useRef(null);
  const labelsCanvasRef = useRef(null);
  const selectedLabelCanvasRef = useRef(null);
  const crossHairCanvasRef = useRef(null)

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (labelClass) {
      setIsDrawing(true);
      setCoordinates({ startX: offsetX, startY: offsetY });
    } else {
      labels.forEach(label => {
        const rectX = Math.min(label.coordinates.startX, label.coordinates.endX);
        const rectY = Math.min(label.coordinates.startY, label.coordinates.endY);
        const rectWidth = Math.abs(label.coordinates.endX - label.coordinates.startX);
        const rectHeight = Math.abs(label.coordinates.endY - label.coordinates.startY);
        if (offsetX >= rectX && offsetX <= rectX + rectWidth &&
            offsetY >= rectY && offsetY <= rectY + rectHeight) {
          setLabelMove({
            id: label.id,
            offsetX: offsetX - label.coordinates.startX,
            offsetY: offsetY - label.coordinates.startY
          })
        }
      })
    }
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    drawCrosshair();
    setMousePosition({ x: offsetX, y: offsetY });
    if (isDrawing) {
      setCoordinates({...coordinates, endX: offsetX, endY: offsetY });
    } else if (labelMove) {
      const newLabels = [...labels];
      const label = newLabels.find(l => l.id === labelMove.id);
      if (label) {
        const newCoordinates = {
          startX: offsetX - labelMove.offsetX,
          startY: offsetY - labelMove.offsetY,
          endX: offsetX - labelMove.offsetX + Math.abs(label.coordinates.endX - label.coordinates.startX),
          endY: offsetY - labelMove.offsetY + Math.abs(label.coordinates.endY - label.coordinates.startY)
        }
        label.updateCoordinates(newCoordinates)
        setLabels(newLabels);
        setMoved(true)
      }
    }
  }

  const changeCoordinatesSystem = (coordinates) => {
    const { startX, startY, endX, endY} = coordinates
    if (startX > endX) {
      coordinates.startX = endX
      coordinates.endX = startX
    }
    if (startY > endY) {
      coordinates.startY = endY
      coordinates.endY = startY
    }
  }

  const handleMouseUp = () => {
    setLabelMove(null)
    if (isDrawing) { // Drawing new label
      rectangleCanvasRef.current.getContext('2d').clearRect(0, 0, 1000000, 1000000);
      changeCoordinatesSystem(coordinates)
      const newLabel = new LabelModel(labelClass.name, labelClass.color, coordinates)
      setLabels([...labels, newLabel])
      setIsDrawing(false)
      setLabelClass(null)
    } else if (moved) { // Move label
      setMoved(false)
    } else if (labelMove) { // Select a label
      setIdSelectedLabel(idSelectedLabel === labelMove.id ? null : labelMove.id)
    }
  };
  
  const handleMouseLeave = () => {
    crossHairCanvasRef.current.getContext('2d').clearRect(0, 0, 10000, 10000);
  };

  const drawRectangle = () => {
    const canvas = rectangleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = coordinates.endX - coordinates.startX;
    const height = coordinates.endY - coordinates.startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = labelClass?.color
    ctx.strokeRect(coordinates.startX, coordinates.startY, width, height);
  };

  const drawLabels = () => {
    const canvas = labelsCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labels.forEach(label => {
      if (label.id !== idSelectedLabel) {
        const width = label.coordinates.endX - label.coordinates.startX;
        const height = label.coordinates.endY - label.coordinates.startY;
        ctx.strokeStyle = label.color
        ctx.lineWidth = label.id === idHoverLabel ? 8 : 1
        ctx.strokeRect(label.coordinates.startX, label.coordinates.startY, width, height);
      }
    });
  };

  const drawSelectedLabel = () => {
    const canvas = selectedLabelCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labels.forEach(label => {
      if (label.id === idSelectedLabel) {
        const width = label.coordinates.endX - label.coordinates.startX;
        const height = label.coordinates.endY - label.coordinates.startY;
        ctx.strokeStyle = label.color
        ctx.lineWidth = label.id === idHoverLabel ? 8 : 4
        ctx.strokeRect(label.coordinates.startX, label.coordinates.startY, width, height);
      }
    });
  };
  
  const drawCrosshair = () => {
    const canvas = crossHairCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 10000;
    const { x, y } = mousePosition;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  };

  const handleClickClasses = (classObj) => {
    if (idSelectedLabel !== null) {
      const newLabels = [...labels];
      const label = newLabels.find(l => l.id === idSelectedLabel);
      if (label) {
        label.updateName(classObj.name)
        label.updateColor(classObj.color)
        setLabels(newLabels);
      }
    } else {
      if (labelClass?.name === classObj.name){
        setLabelClass(null)
      } else {
        setLabelClass(classObj)
      }
    }
  }

  useEffect(() => {
    drawLabels()
    drawSelectedLabel()
  }, [labels, idSelectedLabel, idHoverLabel])

  useEffect(() => {
    drawRectangle()
  }, [coordinates])

  return (
  <div className="image-labeling">
    <div className={labelMove ? "image-canvas label-move" : "image-canvas"}>
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
        ref={crossHairCanvasRef}
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

    <div className="class-buttons">
      {classes.map((classObj, index) => (
        <button
          key={index}
          style={{
            fontSize: "1.5em",
            backgroundColor: classObj.color,
            border: labelClass?.name === classObj.name ? '2px solid black' : 'none'
          }}
          onClick={() => handleClickClasses(classObj)}
        >
          {labelClass?.name === classObj.name && <span>✔️ </span>}
          {classObj.name}
        </button>
      ))}
    </div>
    {/* <p>
      -------------------------- DEBUG ZONE -------------------------- <br/><br/>
      Label Class: {JSON.stringify(labelClass)}  <br/><br/>
      Move ID: {JSON.stringify(labelMove)}
      <br/><br/>--------------------------------------------------------------------------
    </p> */}
  </div>
  )
}

export default ImageTagger
