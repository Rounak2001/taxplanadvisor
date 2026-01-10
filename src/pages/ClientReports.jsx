import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const reports = [
  {
    id: 1,
    name: 'CMA Report - AY 2025-26',
    type: 'CMA',
    status: 'ready',
    generatedAt: '2026-01-05',
  },
  {
    id: 2,
    name: 'GST Reconciliation - Q3 2025',
    type: 'GST',
    status: 'ready',
    generatedAt: '2025-12-31',
  },
  {
    id: 3,
    name: 'Tax Computation Statement',
    type: 'Tax',
    status: 'processing',
    generatedAt: null,
  },
  {
    id: 4,
    name: 'CMA Report - AY 2024-25',
    type: 'CMA',
    status: 'ready',
    generatedAt: '2025-03-15',
  },
];

export default function ClientReports() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Reports</h1>
        <p className="text-muted-foreground mt-1">
          Access your CMA reports, GST reconciliations, and tax computations
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{report.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {report.type}
                      </Badge>
                    </div>
                    {report.generatedAt ? (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Generated {new Date(report.generatedAt).toLocaleDateString('en-IN')}
                      </p>
                    ) : (
                      <p className="text-sm text-warning">Processing...</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === 'ready' ? (
                    <>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      Processing...
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
