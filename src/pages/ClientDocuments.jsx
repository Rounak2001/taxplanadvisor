import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/api/documentService';
import { UploadModal } from '@/components/vault/UploadModal';

export default function ClientDocuments() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['vault-documents'],
    queryFn: documentService.list,
  });

  const requestedDocs = documents.filter(d => d.status === 'PENDING');
  const uploadedDocs = documents.filter(d => d.status !== 'PENDING');

  const handleUploadClick = (request = null) => {
    setSelectedRequest(request);
    setIsUploadModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Clock className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
          <p className="text-muted-foreground mt-1">
            Manage your uploaded documents and pending requests
          </p>
        </div>
        <Button onClick={() => handleUploadClick()}>
          <Upload className="mr-2 h-4 w-4" />
          Proactive Upload
        </Button>
      </div>

      {/* Requested Documents */}
      {requestedDocs.length > 0 && (
        <Card className="border-warning/30 bg-warning/5 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Requests ({requestedDocs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requestedDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-border shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.description || `Requested on ${new Date(doc.created_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleUploadClick(doc)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Documents */}
      <Card className="glass shadow-xl border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            Uploaded Documents ({uploadedDocs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedDocs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                No documents uploaded yet.
              </div>
            ) : (
              uploadedDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <Badge variant="outline" className={cn(
                          "text-[10px] uppercase px-1.5 h-4",
                          doc.status === 'VERIFIED' ? 'border-success text-success bg-success/5' :
                            doc.status === 'REJECTED' ? 'border-destructive text-destructive bg-destructive/5' :
                              'border-warning text-warning bg-warning/5'
                        )}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {doc.file && (
                      <a href={`http://localhost:8000${doc.file}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        documentRequest={selectedRequest}
        onSuccess={() => queryClient.invalidateQueries(['vault-documents'])}
      />
    </motion.div>
  );
}
