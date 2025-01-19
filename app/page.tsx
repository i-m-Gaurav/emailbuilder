'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, Save, Image, Undo } from 'lucide-react';

// Define types for our template data
interface TemplateData {
  title: string;
  content: string;
  imageUrl: string;
  footer: string;
}

// Define props for the Preview component
interface PreviewProps extends TemplateData {
  className?: string;
}

// Separate Preview component for better organization
const Preview: React.FC<PreviewProps> = ({ title, content, imageUrl, footer, className }) => {
  return (
    <div className={className}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>{title}</h1>
      <div style={{ marginBottom: '20px' }}>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Email content" 
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
          />
        )}
      </div>
      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>{content}</div>
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '14px', color: '#666' }}>
        {footer}
      </div>
    </div>
  );
};

const defaultTemplate: TemplateData = {
  title: "Welcome to Our Newsletter",
  content: "Hello there! We're excited to have you here. This is a sample email template that you can customize to your needs. Feel free to modify the content, add images, and make it your own!",
  imageUrl: "https://t4.ftcdn.net/jpg/05/70/26/97/360_F_570269734_gE4Za4bdlmm5MLhjScliP4zmOORgDJ3t.jpg",
  footer: "© 2024 Your Company. All rights reserved."
};

export default function Home() {
  const [templateData, setTemplateData] = useState<TemplateData>(defaultTemplate);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/uploadEmailConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      if (!res.ok) throw new Error('Failed to save template');
      alert("Template saved successfully");
    } catch (error) {
      console.error('Error saving template:', error);
      alert("Failed to save template");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/renderAndDownloadTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });
      if (!res.ok) throw new Error('Failed to download template');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template.html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Template downloaded successfully");
    } catch (error) {
      console.error('Error downloading template:', error);
      alert("Failed to download template");
    }
  };

  const handleReset = () => {
    setTemplateData(defaultTemplate);
    alert("Template has been reset to default values");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedUrl = e.dataTransfer.getData('text');
    if (droppedUrl) {
      setTemplateData(prev => ({ ...prev, imageUrl: droppedUrl }));
      alert("New image URL has been set");
    }
  };

  const handleInputChange = (
    key: keyof TemplateData,
    value: string
  ) => {
    setTemplateData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Email Builder</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={handleReset}>
              <Undo className="w-4 h-4 mr-2" />
              Reset Template
            </Button>
            <Button onClick={handleDownload} variant="default">
              <Download className="w-4 h-4 mr-2" />
              Download HTML
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Preview Panel */}
          <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="border rounded-lg p-4 min-h-[600px] bg-white overflow-auto">
              <Preview {...templateData} />
            </div>
          </Card>

          {/* Editor Panel */}
          <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Editor</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Title</label>
                <Input
                  value={templateData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter email title..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={templateData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter email content..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop an image URL here or paste a link
                  </p>
                  <Input
                    value={templateData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="Or enter image URL manually..."
                    className="mt-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Footer</label>
                <Input
                  value={templateData.footer}
                  onChange={(e) => handleInputChange('footer', e.target.value)}
                  placeholder="Enter footer text..."
                />
              </div>

              <Button type="submit" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}