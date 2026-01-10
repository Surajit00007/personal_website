import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Save, Image, FileText, Home } from 'lucide-react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const AdminDashboard = () => {
  const { isAdmin, logout, siteContent, updateContent, updateProfileImage } = useAdmin();
  const navigate = useNavigate();
  
  const [localContent, setLocalContent] = useState(siteContent);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    setLocalContent(siteContent);
  }, [siteContent]);

  const handleSave = () => {
    Object.entries(localContent).forEach(([key, value]) => {
      if (key !== 'profileImage') {
        updateContent(key as keyof typeof siteContent, value as string);
      }
    });
    toast.success('Content saved successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: unknown, croppedAreaPixels: CroppedArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    if (!imageFile || !croppedAreaPixels) return;

    const image = new window.Image();
    image.src = imageFile;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.putImageData(data, 0, 0);

    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    updateProfileImage(croppedImage);
    setImageFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    toast.success('Profile image updated!');
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="image" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="w-4 h-4 mr-2" />
              Profile Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Title Override</label>
                  <Input
                    placeholder="Leave empty for default"
                    value={localContent.heroTitle}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Subtitle Override</label>
                  <Input
                    placeholder="Leave empty for default"
                    value={localContent.heroSubtitle}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Description Override</label>
                  <Textarea
                    placeholder="Leave empty for default"
                    value={localContent.heroDescription}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, heroDescription: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Title Override</label>
                  <Input
                    placeholder="Leave empty for default"
                    value={localContent.aboutTitle}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Description Override</label>
                  <Textarea
                    placeholder="Leave empty for default"
                    value={localContent.aboutDescription}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, aboutDescription: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Contact Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Title Override</label>
                  <Input
                    placeholder="Leave empty for default"
                    value={localContent.contactTitle}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, contactTitle: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Description Override</label>
                  <Textarea
                    placeholder="Leave empty for default"
                    value={localContent.contactDescription}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, contactDescription: e.target.value }))}
                    className="bg-muted/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </TabsContent>

          <TabsContent value="image" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Profile Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {siteContent.profileImage && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={siteContent.profileImage}
                      alt="Current profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Select New Image
                </Button>

                {imageFile && (
                  <div className="space-y-4">
                    <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                      <Cropper
                        image={imageFile}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        cropShape="round"
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Zoom: {zoom.toFixed(1)}x</label>
                        <input
                          type="range"
                          min={1}
                          max={3}
                          step={0.1}
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Rotation: {rotation}°</label>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setImageFile(null)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={createCroppedImage} className="flex-1">
                        Apply Image
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
