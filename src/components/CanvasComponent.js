import React, { useContext,  useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import AppContext from  "../components/AppContext"

export default function CanvasComponent() {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState("#0000ff");
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const value = useContext(AppContext);


 

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };



  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    console.log(uri);
    downloadURI(uri, "stage.png");
  };

  const resetCanvas = () => {
    setLines([]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const sendImageToWebSocket = (dataURL) => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
        console.log("WebSocket connection opened");
        socket.send(dataURL); // Send the image data
    };
    socket.onmessage = (event) => {
      const receivedImageBase64 = event.data;       
      value.setImageSrc(`data:image/jpeg;base64,${receivedImageBase64}`);
      console.log(receivedImageBase64,value.imageSrc);
      
  };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };
};





  

  const submit = async () => {
    console.log("Submit");
    const canvasData = stageRef.current.toDataURL();

    sendImageToWebSocket(canvasData);

    alert("Processing");
  };


  return (
    <div className="bg-white w-fit p-6 text-white rounded-[50px] drop-shadow-2xl">
      <div className="mb-3">
        <button
          className="text-white p-3 rounded-2xl font-semibold text-[15px] bg-[#eea849] "
          onClick={submit}
        >
          Predict
        </button>
        <button
          className="text-white p-3 rounded-2xl font-semibold text-[15px] bg-[#eea849] hover:bg-[#eea841] ml-6"
          onClick={resetCanvas}
        >
          Clear Canvas
        </button>
        <button
          className="text-white p-3 rounded-2xl font-semibold text-[15px] bg-[#eea849] hover:bg-[#eea841] ml-6"
          onClick={handleExport}
        >
          Save Image
        </button>
      </div>
      <Stage
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={color}
              strokeWidth={20}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
      <div className="flex item gap-10 pt-4">
        <select
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
          className="text-white bg-[#eea849] rounded-lg p-4 pr-6 hover:bg-indigo-600"
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>
        <input
          className="w-[50px] h-[50px] "
          type="color"
          id="colorpicker"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
        ></input>
      </div>
    </div>
  );
}
