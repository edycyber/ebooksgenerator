import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileTable from './components/FileTable';
import StorageStats from './components/StorageStats';
import DownloadHistory from './components/DownloadHistory';
import BulkActions from './components/BulkActions';

const DownloadManager = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for generated ebooks
  const [files] = useState([
    {
      id: 1,
      title: "The Complete Guide to Digital Marketing",
      genre: "Business",
      pages: 156,
      fileSize: 2457600, // 2.4 MB
      status: "ready",
      createdAt: "2025-01-15T10:30:00Z",
      downloadCount: 12,
      formats: ["docx", "pdf", "epub"]
    },
    {
      id: 2,
      title: "Artificial Intelligence for Beginners",
      genre: "Technology",
      pages: 203,
      fileSize: 3145728, // 3 MB
      status: "ready",
      createdAt: "2025-01-14T14:22:00Z",
      downloadCount: 8,
      formats: ["docx", "pdf"]
    },
    {
      id: 3,
      title: "Sustainable Living Handbook",
      genre: "Lifestyle",
      pages: 89,
      fileSize: 1572864, // 1.5 MB
      status: "processing",
      createdAt: "2025-01-16T09:15:00Z",
      downloadCount: 0,
      formats: ["docx"]
    },
    {
      id: 4,
      title: "Investment Strategies for 2025",
      genre: "Finance",
      pages: 134,
      fileSize: 2097152, // 2 MB
      status: "ready",
      createdAt: "2025-01-13T16:45:00Z",
      downloadCount: 25,
      formats: ["docx", "pdf", "epub"]
    },
    {
      id: 5,
      title: "Creative Writing Masterclass",
      genre: "Education",
      pages: 178,
      fileSize: 2621440, // 2.5 MB
      status: "failed",
      createdAt: "2025-01-12T11:20:00Z",
      downloadCount: 0,
      formats: []
    }
  ]);

  // Mock download history
  const [downloadHistory] = useState([
    {
      id: 1,
      fileName: "Digital_Marketing_Guide.docx",
      format: "docx",
      status: "completed",
      downloadedAt: "2025-01-16T08:30:00Z",
      fileSize: 2457600
    },
    {
      id: 2,
      fileName: "AI_Beginners.pdf",
      format: "pdf",
      status: "completed",
      downloadedAt: "2025-01-16T07:15:00Z",
      fileSize: 3145728
    },
    {
      id: 3,
      fileName: "Investment_Strategies.epub",
      format: "epub",
      status: "completed",
      downloadedAt: "2025-01-15T19:45:00Z",
      fileSize: 2097152
    },
    {
      id: 4,
      fileName: "Creative_Writing.docx",
      format: "docx",
      status: "failed",
      downloadedAt: "2025-01-15T14:20:00Z",
      fileSize: 2621440
    }
  ]);

  // Calculate storage stats
  const totalUsedStorage = files?.reduce((total, file) => total + file?.fileSize, 0);
  const totalDownloads = files?.reduce((total, file) => total + file?.downloadCount, 0);

  const handleFileSelect = (fileId, isSelected) => {
    setSelectedFiles(prev => {
      if (isSelected) {
        return [...prev, fileId];
      } else {
        return prev?.filter(id => id !== fileId);
      }
    });
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const readyFiles = files?.filter(file => file?.status === 'ready')?.map(file => file?.id);
      setSelectedFiles(readyFiles);
    } else {
      setSelectedFiles([]);
    }
  };

  const handleDownload = (file) => {
    // Simulate download process
    console.log('Downloading file:', file?.title);
    
    // Create a mock download link
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${file?.title?.replace(/\s+/g, '_')}.docx`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);

    // Show success message (in a real app, this would be a toast notification)
    alert(`Download started: ${file?.title}`);
  };

  const handlePreview = (file) => {
    // Navigate to content preview
    window.location.href = `/content-preview?file=${file?.id}`;
  };

  const handleDelete = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      console.log('Deleting file:', fileId);
      // In a real app, this would update the files state
      alert('File deleted successfully');
    }
  };

  const handleBulkDownload = (fileIds, format) => {
    setIsProcessing(true);
    
    // Simulate bulk download processing
    setTimeout(() => {
      console.log('Bulk downloading files:', fileIds, 'as', format);
      
      if (format === 'zip') {
        // Create mock ZIP download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `ebooks_${new Date()?.getTime()}.zip`;
        document.body?.appendChild(link);
        link?.click();
        document.body?.removeChild(link);
        alert(`ZIP archive with ${fileIds?.length} files is being prepared for download.`);
      } else {
        // Individual downloads
        fileIds?.forEach((fileId, index) => {
          const file = files?.find(f => f?.id === fileId);
          if (file) {
            setTimeout(() => {
              handleDownload(file);
            }, index * 1000); // Stagger downloads
          }
        });
      }
      
      setSelectedFiles([]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleBulkDelete = (fileIds) => {
    setIsProcessing(true);
    
    // Simulate bulk delete processing
    setTimeout(() => {
      console.log('Bulk deleting files:', fileIds);
      alert(`${fileIds?.length} files deleted successfully`);
      setSelectedFiles([]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleClearSelection = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Download Manager
                </h1>
                <p className="text-muted-foreground">
                  Manage and download your generated ebooks
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link to="/content-preview">
                  <Button variant="outline" iconName="Eye" iconPosition="left">
                    Preview Mode
                  </Button>
                </Link>
                <Link to="/ebook-creation">
                  <Button variant="default" iconName="Plus" iconPosition="left">
                    Create New Ebook
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <BulkActions
            selectedFiles={selectedFiles}
            onBulkDownload={handleBulkDownload}
            onBulkDelete={handleBulkDelete}
            onClearSelection={handleClearSelection}
            isProcessing={isProcessing}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Files Table - Takes up 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <FileTable
                files={files}
                onDownload={handleDownload}
                onPreview={handlePreview}
                onDelete={handleDelete}
                onRename={() => {}}
                onBulkDownload={handleBulkDownload}
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
                onSelectAll={handleSelectAll}
              />
            </div>

            {/* Sidebar - Takes up 1 column on xl screens */}
            <div className="xl:col-span-1 space-y-6">
              {/* Storage Stats */}
              <StorageStats
                usedStorage={totalUsedStorage}
                totalStorage={5368709120} // 5GB
                fileCount={files?.length}
                downloadCount={totalDownloads}
                accountType="free"
              />

              {/* Download History */}
              <DownloadHistory downloads={downloadHistory} />
            </div>
          </div>

          {/* Quick Stats Cards - Mobile/Tablet View */}
          <div className="xl:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-lg font-semibold text-foreground">{files?.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Download" size={20} color="var(--color-success)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-lg font-semibold text-foreground">{totalDownloads}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="HardDrive" size={20} color="var(--color-warning)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-lg font-semibold text-foreground">
                    {(totalUsedStorage / (1024 * 1024))?.toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} color="var(--color-accent)" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ready Files</p>
                  <p className="text-lg font-semibold text-foreground">
                    {files?.filter(f => f?.status === 'ready')?.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="HelpCircle" size={24} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Need Help with Downloads?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Having trouble downloading your ebooks? Check out our help resources or contact support.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button className="text-sm font-medium text-primary hover:text-primary/80 transition-gentle">
                    Download Troubleshooting →
                  </button>
                  <button className="text-sm font-medium text-primary hover:text-primary/80 transition-gentle">
                    Contact Support →
                  </button>
                  <button className="text-sm font-medium text-primary hover:text-primary/80 transition-gentle">
                    File Format Guide →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DownloadManager;