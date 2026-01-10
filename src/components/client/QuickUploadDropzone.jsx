import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileText, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const suggestedDocs = [
  { id: 1, name: 'Bank Statement', type: 'bank' },
  { id: 2, name: 'PAN Card', type: 'pan' },
  { id: 3, name: 'Form 16', type: 'form16' },
];

export function QuickUploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [
        ...prev,
        ...files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          status: 'uploading',
        }))
      ]);

      // Simulate upload
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => ({ ...f, status: 'completed' }))
        );
      }, 1500);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [
        ...prev,
        ...files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          status: 'uploading',
        }))
      ]);

      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => ({ ...f, status: 'completed' }))
        );
      }, 1500);
    }
  }, []);

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Upload</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag & drop or snap a photo of your documents
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dropzone */}
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            animate={{
              scale: isDragging ? 1.02 : 1,
              borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
            }}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
              isDragging ? 'bg-primary/5' : 'hover:bg-muted/50'
            )}
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Camera Button for Mobile */}
          <Button variant="outline" className="w-full md:hidden" asChild>
            <label className="cursor-pointer">
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </Button>

          {/* Suggested Documents */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Commonly Requested
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedDocs.map((doc) => (
                <Button
                  key={doc.id}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  asChild
                >
                  <label className="cursor-pointer">
                    <FileText className="mr-1.5 h-3 w-3" />
                    {doc.name}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </Button>
              ))}
            </div>
          </div>

          {/* Uploaded Files */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2 border-t border-border"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Uploaded Files
                </p>
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'uploading' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                        />
                      ) : (
                        <Check className="h-4 w-4 text-success" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
