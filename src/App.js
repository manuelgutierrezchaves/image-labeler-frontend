import React, { useState, useRef, useEffect } from 'react';
import "./App.css"

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState({startX: 0, startY: 0, endX: 0, endY: 0})
  const [allCoordinates, setAllCoordinates] = useState([])
  const canvasRef = useRef(null);

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setCoordinates({ startX: offsetX, startY: offsetY });
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (isDrawing) {
      setCoordinates({...coordinates, endX: offsetX, endY: offsetY });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setAllCoordinates([...allCoordinates, coordinates])}
    setIsDrawing(false);
    
  };

  const drawRectangle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = coordinates.endX - coordinates.startX;
    const height = coordinates.endY - coordinates.startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(coordinates.startX, coordinates.startY, width, height);
  };

  const drawAllRectangles = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allCoordinates.forEach(coordinates => {
    const width = coordinates.endX - coordinates.startX;
    const height = coordinates.endY - coordinates.startY;
    ctx.strokeRect(coordinates.startX, coordinates.startY, width, height);
    });
  };

  useEffect(() => {
    console.log("HOLA")
    drawAllRectangles()
  }, [allCoordinates])

  return (
    <div>
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
      {isDrawing && drawRectangle()}
      
      {JSON.stringify(allCoordinates)}
    </div>
  );
}

export default App;
