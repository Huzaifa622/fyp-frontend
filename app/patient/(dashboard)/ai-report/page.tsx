"use client";

import React, { useState } from "react";
import {
  FileText,
  Loader2,
  Calendar,
  ChevronRight,
  ImageIcon,
  Plus,
  X as CloseIcon,
  UploadCloud,
  ExternalLink,
} from "lucide-react";
import {
  useGetMyReportsQuery,
  useGenerateAIReportMutation,
} from "@/services/patient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AIReportPage() {
  const { data: reports, isLoading, refetch } = useGetMyReportsQuery();
  const [generateReport, { isLoading: isGenerating }] =
    useGenerateAIReportMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || description.length < 10) {
      setError("Please provide a description (min 10 characters).");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setError(null);
    try {
      await generateReport({ description, images }).unwrap();
      setIsDialogOpen(false);
      setDescription("");
      setImages([]);
      refetch();
    } catch (err: any) {
      console.error("Failed to generate report:", err);
      setError(
        err?.data?.message || "Failed to generate AI report. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AI Diagnosis Reports
          </h1>
          <p className="text-muted-foreground">
            View your previous skin condition analysis reports
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate AI Report</DialogTitle>
              <DialogDescription>
                Provide a description of your skin condition and upload images
                for analysis.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {error && (
                <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your symptoms, how long you've had them..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border border-border"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-0.5 bg-destructive text-destructive-foreground rounded-full"
                      >
                        <CloseIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 border-input transition-colors">
                    <UploadCloud className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] mt-1 text-muted-foreground">
                      Add
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="hover:bg-muted/30 transition-colors cursor-pointer group"
              onClick={() => setSelectedReport(report)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                    {report.imagePaths && report.imagePaths.length > 0 ? (
                      <img
                        src={report.imagePaths[0]}
                        alt="Skin condition"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(report.createdAt), "PPP")}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20"
                      >
                        Analysis Complete
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {report.diseaseName}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ImageIcon className="h-3 w-3" />
                        <span>{report.imagePaths?.length || 0} Images</span>
                      </div>
                      {report.confidenceScore && (
                        <div className="text-xs font-medium text-primary">
                          Confidence: {report.confidenceScore}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center justify-end text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-24 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No reports yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            You haven't generated any AI diagnosis reports yet. Start by
            providing your symptoms and images for analysis.
          </p>
          <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
            Create Your First Report
          </Button>
        </div>
      )}

      {/* Report Details Modal */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">Report Details</DialogTitle>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {selectedReport.confidenceScore
                      ? `Confidence: ${selectedReport.confidenceScore}`
                      : "Analyzed"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedReport.createdAt), "PPPP")}
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-base leading-relaxed bg-muted/30 p-4 rounded-lg border border-border">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Images Analyzed
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedReport.imagePaths?.map(
                      (path: string, i: number) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                        >
                          <img
                            src={path}
                            alt={`Skin ${i}`}
                            className="h-full w-full object-cover hover:scale-105 transition-transform"
                          />
                          <a
                            href={path}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 right-2 p-1 bg-black/50 text-white rounded-md opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                    AI Summary
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {selectedReport?.aiResponse}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => (window.location.href = "/patient/doctors")}
                >
                  Consult a Doctor
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
