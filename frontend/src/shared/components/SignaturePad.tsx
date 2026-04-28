import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { Button } from "prometeo-design-system";
import { Eraser } from "lucide-react";

export interface SignaturePadHandle {
  toBase64: () => string | null;
  clear: () => void;
  isEmpty: () => boolean;
}

interface Props {
  ref?: Ref<SignaturePadHandle>;
  width?: number;
  height?: number;
}

const SignaturePad = ({ ref, width = 500, height = 200 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const empty = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPoint = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX =
      "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPoint(e.nativeEvent);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPoint(e.nativeEvent);
    ctx.lineTo(x, y);
    ctx.stroke();
    empty.current = false;
  };

  const stop = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    empty.current = true;
  };

  useImperativeHandle(ref, () => ({
    toBase64: () => {
      if (empty.current) return null;
      return canvasRef.current?.toDataURL("image/png") ?? null;
    },
    clear,
    isEmpty: () => empty.current,
  }));

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-neutral-default-default rounded-md bg-white touch-none cursor-crosshair w-full max-w-full"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={stop}
      />
      <Button
        type="button"
        variant="ghost"
        size="small"
        label="Limpiar firma"
        icon={<Eraser size={14} />}
        onClick={clear}
      />
    </div>
  );
};

export default SignaturePad;
