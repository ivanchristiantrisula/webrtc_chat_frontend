import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import WhiteboardContextMenu from "./ContextMenu";

const initState = {
  color: "#000000",
  lineCap: "round",
  lineWidth: 8,
};

const canvasOffset = window.innerHeight + 500;

const Whiteboard = (props: { handleCaptureStream: Function }) => {
  const canvas = useRef<HTMLCanvasElement>();
  const [drawing, setDrawing] = useState(false);

  const [color, setColor] = useState(initState.color);
  const [lineCap, setLineCap] = useState<any>(initState.lineCap);
  const [lineWidth, setLineWidth] = useState(initState.lineWidth);

  const [openContextMenu, setOpenContextMenu] = useState(false);
  const mousePos = useRef({ mouseX: 0, mouseY: 0 });

  useEffect(() => {
    //get context before capturing stream to avoid firefox crash
    canvas.current.getContext("2d");
    //@ts-ignore
    props.handleCaptureStream(canvas.current.captureStream(30));

    setBackgroundColor();
  }, []);

  useEffect(() => closeContextMenu(), [color, lineCap, lineWidth]);

  const setBackgroundColor = () => {
    const context = canvas.current.getContext("2d");

    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);

    context.globalCompositeOperation = "source-over";
  };

  const startDrawing = (event: MouseEvent) => {
    //ignore right click
    if (event.button == 2) return;
    setDrawing(true);
    onDrawing(event);
  };

  const endDrawing = () => {
    setDrawing(false);
    canvas.current.getContext("2d").beginPath();
  };

  const onDrawing = (event: MouseEvent) => {
    if (!drawing) return;
    console.log(event.clientX);

    const ctx = canvas.current.getContext("2d");

    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;

    ctx.lineTo(event.clientX - canvasOffset / 4, event.clientY);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvasOffset / 4, event.clientY);
  };

  const showContextMenu = (event?: MouseEvent<HTMLCanvasElement>) => {
    if (event) {
      event.preventDefault();
      mousePos.current = { mouseX: event.clientX, mouseY: event.clientY };
    }

    setOpenContextMenu(true);
  };

  const closeContextMenu = () => {
    setOpenContextMenu(false);
  };

  const changeColor = (color: string) => setColor(color);

  const changeLineWidth = (width: number) => setLineWidth(width);

  const changeLineCap = (shape: "round" | "square") => setLineCap(shape);

  const clearWhiteboard = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    setBackgroundColor();
    setOpenContextMenu(false);
  };

  const saveWhiteboard = () => {
    const image = canvas.current
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    window.location.href = image;
    setOpenContextMenu(false);
  };

  return (
    <>
      <canvas
        height={window.innerHeight}
        width={window.innerHeight + 500}
        ref={canvas}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={onDrawing}
        style={{ display: "block", margin: "0 auto" }}
        onContextMenu={(e) => showContextMenu(e)}
      />

      <WhiteboardContextMenu
        open={openContextMenu}
        handleClose={closeContextMenu}
        pos={mousePos.current}
        handleColorChange={changeColor}
        handleLineWidthChange={changeLineWidth}
        handleLineCapChange={changeLineCap}
        currentValue={{ color: color, cap: lineCap, width: lineWidth }}
        handleClear={clearWhiteboard}
        handleSave={saveWhiteboard}
      />
    </>
  );
};

export default Whiteboard;
