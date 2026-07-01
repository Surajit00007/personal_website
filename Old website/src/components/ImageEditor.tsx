import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowClockwise, ArrowCounterClockwise, MagnifyingGlassPlus, MagnifyingGlassMinus, Crop } from '@phosphor-icons/react';

interface ImageEditorProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CroppedAreaPixels,
  rotation = 0
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box of the rotated image
  const bBoxWidth = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const bBoxHeight = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.9);
};

const ImageEditor = ({ imageSrc, open, onClose, onSave }: ImageEditorProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  const handleSave = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
        onSave(croppedImage);
        onClose();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Crop size={20} weight="light" className="text-primary" />
            Edit Profile Picture
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative h-[350px] w-full bg-background/50 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Zoom slider */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleZoomOut}
              className="p-2 glass-card rounded-lg hover:bg-primary/20 transition-colors"
            >
              <MagnifyingGlassMinus size={20} weight="light" className="text-primary" />
            </button>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-1"
            />
            <button
              onClick={handleZoomIn}
              className="p-2 glass-card rounded-lg hover:bg-primary/20 transition-colors"
            >
              <MagnifyingGlassPlus size={20} weight="light" className="text-primary" />
            </button>
          </div>

          {/* Rotation controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRotateLeft}
              className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:bg-primary/20 transition-colors"
            >
              <ArrowCounterClockwise size={20} weight="light" className="text-primary" />
              <span className="text-sm text-muted-foreground">Rotate Left</span>
            </button>
            <button
              onClick={handleRotateRight}
              className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:bg-primary/20 transition-colors"
            >
              <ArrowClockwise size={20} weight="light" className="text-primary" />
              <span className="text-sm text-muted-foreground">Rotate Right</span>
            </button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleReset} className="border-border">
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
