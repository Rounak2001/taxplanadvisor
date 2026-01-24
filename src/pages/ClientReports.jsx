import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Eye, Calendar, FileText, Maximize2, Clock, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { documentService } from '@/api/documentService';

const REPORT_TYPE_COLORS = {
  CMA: 'bg-purple-100 text-purple-700 border-purple-200',
  GST: 'bg-blue-100 text-blue-700 border-blue-200',
  TAX: 'bg-green-100 text-green-700 border-green-200',
  AUDIT: 'bg-orange-100 text-orange-700 border-orange-200',
  OTHER: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function ClientReports() {
  const [viewingReport, setViewingReport] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['shared-reports'],
    queryFn: documentService.listSharedReports,
  });

  const getFileUrl = (file) => {
    if (!file) return null;
    if (file.startsWith('http')) return file;
    return `http://localhost:8000${file.startsWith('/') ? file : `/${file}`}`;
  };

  const handleView = (report) => {
    setViewingReport(report);
  };

  const handleDownload = (report) => {
    const url = getFileUrl(report.file);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = report.title || 'report';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Reports</h1>
        <p className="text-muted-foreground mt-1">
          Access reports shared by your consultant
        </p>
      </div>

      <Card className="glass shadow-xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Shared Reports ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No reports yet</p>
                <p className="text-sm">Your consultant will share reports here</p>
              </div>
            ) : (
              reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{report.title}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${REPORT_TYPE_COLORS[report.report_type] || REPORT_TYPE_COLORS.OTHER}`}
                        >
                          {report.report_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>Shared {new Date(report.created_at).toLocaleDateString('en-IN')}</span>
                        {report.consultant_name && (
                          <>
                            <span>•</span>
                            <span>by {report.consultant_name}</span>
                          </>
                        )}
                      </div>
                      {report.description && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{report.description}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(report)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(report)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Report Modal */}
      <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg">{viewingReport?.title}</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Shared {viewingReport?.created_at ? new Date(viewingReport.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={REPORT_TYPE_COLORS[viewingReport?.report_type] || ''}>
                  {viewingReport?.report_type}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(viewingReport)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getFileUrl(viewingReport?.file), '_blank')}
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden bg-muted/30 p-4">
            {viewingReport?.file && (
              <div className="w-full h-full rounded-lg border border-border bg-white overflow-hidden">
                {viewingReport.file.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={getFileUrl(viewingReport.file)}
                    className="w-full h-full border-none"
                    title="Report Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                    <img
                      src={getFileUrl(viewingReport.file)}
                      alt={viewingReport.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
