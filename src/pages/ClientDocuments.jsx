import { motion } from 'framer-motion';
import { FileText, Download, Eye, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const documents = [
  {
    id: 1,
    name: 'Form 16 - 2025',
    type: 'PDF',
    status: 'uploaded',
    uploadedAt: '2025-12-28',
    size: '245 KB',
  },
  {
    id: 2,
    name: 'PAN Card',
    type: 'JPG',
    status: 'uploaded',
    uploadedAt: '2025-12-20',
    size: '1.2 MB',
  },
  {
    id: 3,
    name: 'Bank Statement (Apr-Dec)',
    type: 'PDF',
    status: 'requested',
    requestedAt: '2026-01-08',
  },
  {
    id: 4,
    name: 'Investment Proof - 80C',
    type: 'PDF',
    status: 'requested',
    requestedAt: '2026-01-08',
  },
  {
    id: 5,
    name: 'Rent Receipts',
    type: 'PDF',
    status: 'requested',
    requestedAt: '2026-01-09',
  },
];

export default function ClientDocuments() {
  const uploadedDocs = documents.filter(d => d.status === 'uploaded');
  const requestedDocs = documents.filter(d => d.status === 'requested');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
        <p className="text-muted-foreground mt-1">
          Manage your uploaded documents and pending requests
        </p>
      </div>

      {/* Requested Documents */}
      {requestedDocs.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
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
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(doc.requestedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">
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
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-success" />
            Uploaded Documents ({uploadedDocs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uploadedDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
