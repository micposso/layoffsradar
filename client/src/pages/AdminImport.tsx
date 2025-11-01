import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportResult {
  success: number;
  failed: number;
  duplicates: number;
  errors: Array<{ row: number; error: string }>;
}

export default function AdminImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated - Reference: blueprint:javascript_log_in_with_replit
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to access the admin import page. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("csv", file);
      
      const response = await fetch("/api/notices/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Import failed");
      }

      return response.json();
    },
    onSuccess: (data: ImportResult) => {
      setImportResult(data);
      setSelectedFile(null);
      
      // Invalidate all relevant query caches to refresh data across the app
      if (data.success > 0) {
        queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
        queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
        
        toast({
          title: "Import completed",
          description: `Successfully imported ${data.success} WARN notices. All data views have been updated.`,
        });
      }
    },
    onError: (error: Error) => {
      // Handle unauthorized errors - Reference: blueprint:javascript_log_in_with_replit
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Your session has expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const downloadTemplate = () => {
    const template = `companyName,state,city,workersAffected,filingDate,effectiveDate,industry,layoffType
Tech Solutions Inc,CA,San Francisco,150,2024-10-15,2024-12-31,Technology,Permanent Closure
Manufacturing Co,TX,Houston,300,2024-10-20,2025-01-15,Manufacturing,Mass Layoff
Retail Group LLC,NY,New York,200,2024-11-01,2025-02-01,Retail,Plant Closing`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warn_notices_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8 mx-auto space-y-8 md:px-6 lg:px-8 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl" data-testid="heading-admin-import">
              Import WARN Notices
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Upload CSV files to bulk import Worker Adjustment and Retraining Notification (WARN) Act notices
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>CSV File Format</CardTitle>
              <CardDescription>
                Your CSV file must include the following columns in order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted font-mono text-sm">
                <div className="font-semibold mb-2">Required columns:</div>
                <div className="space-y-1 text-muted-foreground">
                  <div>• companyName - Company name</div>
                  <div>• state - Two-letter state code (e.g., CA, TX, NY)</div>
                  <div>• city - City name</div>
                  <div>• workersAffected - Number of workers (integer)</div>
                  <div>• filingDate - Date in YYYY-MM-DD format</div>
                  <div>• effectiveDate - Date in YYYY-MM-DD format (optional)</div>
                  <div>• industry - Industry sector (optional)</div>
                  <div>• layoffType - Type of layoff (optional)</div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={downloadTemplate}
                data-testid="button-download-template"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>
                Select a CSV file containing WARN notice data to import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={importMutation.isPending}
                  data-testid="input-csv-file"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span data-testid="text-selected-file">{selectedFile.name}</span>
                    <span>({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>

              {importMutation.isPending && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing CSV file...</span>
                  </div>
                  <Progress value={undefined} className="w-full" data-testid="progress-import" />
                </div>
              )}

              <Button
                onClick={handleImport}
                disabled={!selectedFile || importMutation.isPending}
                className="w-full"
                data-testid="button-import"
              >
                <Upload className="w-4 h-4 mr-2" />
                {importMutation.isPending ? "Importing..." : "Import WARN Notices"}
              </Button>
            </CardContent>
          </Card>

          {importResult && (
            <Card data-testid="card-import-results">
              <CardHeader>
                <CardTitle>Import Results</CardTitle>
                <CardDescription>
                  Summary of the CSV import operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Imported</span>
                    </div>
                    <div className="text-3xl font-bold font-mono" data-testid="text-success-count">
                      {importResult.success}
                    </div>
                    <div className="text-sm text-muted-foreground">notices added</div>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold">Duplicates</span>
                    </div>
                    <div className="text-3xl font-bold font-mono" data-testid="text-duplicate-count">
                      {importResult.duplicates}
                    </div>
                    <div className="text-sm text-muted-foreground">already exist</div>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold">Failed</span>
                    </div>
                    <div className="text-3xl font-bold font-mono" data-testid="text-failed-count">
                      {importResult.failed}
                    </div>
                    <div className="text-sm text-muted-foreground">validation errors</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <Alert variant="destructive" data-testid="alert-import-errors">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Validation Errors</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                        {importResult.errors.map((err, idx) => (
                          <div key={idx} className="text-sm font-mono">
                            Row {err.row}: {err.error}
                          </div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {importResult.success > 0 && (
                  <Alert data-testid="alert-success-message">
                    <CheckCircle2 className="w-4 h-4" />
                    <AlertTitle>Import Successful</AlertTitle>
                    <AlertDescription>
                      {importResult.success} WARN notice{importResult.success !== 1 ? "s" : ""} successfully imported. 
                      The interactive map and all data views have been updated automatically.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
