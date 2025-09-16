import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const DownloadAction = ({
  fileName = 'ebook',
  fileSize = null,
  availableFormats = ['pdf', 'epub', 'docx'],
  onDownload,
  downloadProgress = null,
  isDownloading = false,
  metadata = null,
  showPreview = true,
  className = ''
}) => {
  const [selectedFormat, setSelectedFormat] = useState(availableFormats?.[0] || 'pdf');
  const [showMetadata, setShowMetadata] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF', description: 'Portable Document Format' },
    { value: 'epub', label: 'EPUB', description: 'Electronic Publication' },
    { value: 'docx', label: 'DOCX', description: 'Microsoft Word Document' },
    { value: 'txt', label: 'TXT', description: 'Plain Text File' },
    { value: 'html', label: 'HTML', description: 'Web Page Format' }
  ]?.filter(format => availableFormats?.includes(format?.value));

  const getFormatIcon = (format) => {
    const icons = {
      pdf: 'FileText',
      epub: 'Book',
      docx: 'FileText',
      txt: 'File',
      html: 'Globe'
    };
    return icons?.[format] || 'File';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i))?.toFixed(1)} ${sizes?.[i]}`;
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(selectedFormat, fileName);
    }
  };

  const getDownloadButtonText = () => {
    if (isDownloading) {
      return downloadProgress !== null 
        ? `Downloading... ${downloadProgress}%`
        : 'Preparing Download...';
    }
    return `Download ${selectedFormat?.toUpperCase()}`;
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-moderate ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getFormatIcon(selectedFormat)} size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {fileName}
            </h3>
            <div className="flex items-center space-x-3 mt-1">
              {fileSize && (
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(fileSize)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                Ready for download
              </span>
            </div>
          </div>
        </div>

        {metadata && (
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-gentle"
          >
            <Icon name="Info" size={14} />
            <span>Details</span>
          </button>
        )}
      </div>
      {/* Metadata */}
      {showMetadata && metadata && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {metadata?.author && (
              <div>
                <span className="text-muted-foreground">Author:</span>
                <span className="ml-2 text-foreground">{metadata?.author}</span>
              </div>
            )}
            {metadata?.pages && (
              <div>
                <span className="text-muted-foreground">Pages:</span>
                <span className="ml-2 text-foreground">{metadata?.pages}</span>
              </div>
            )}
            {metadata?.wordCount && (
              <div>
                <span className="text-muted-foreground">Words:</span>
                <span className="ml-2 text-foreground">{metadata?.wordCount?.toLocaleString()}</span>
              </div>
            )}
            {metadata?.createdAt && (
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">
                  {new Date(metadata.createdAt)?.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Format Selection */}
      <div className="mb-4">
        <Select
          label="Download Format"
          options={formatOptions}
          value={selectedFormat}
          onChange={setSelectedFormat}
          className="mb-0"
        />
      </div>
      {/* Download Progress */}
      {isDownloading && downloadProgress !== null && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Downloading...
            </span>
            <span className="text-sm text-muted-foreground">
              {downloadProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="default"
          onClick={handleDownload}
          disabled={isDownloading}
          loading={isDownloading}
          iconName="Download"
          iconPosition="left"
          className="flex-1"
        >
          {getDownloadButtonText()}
        </Button>

        {showPreview && (
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            onClick={() => {
              // Preview functionality would be handled by parent component
            }}
          >
            Preview
          </Button>
        )}
      </div>
      {/* Format Info */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">
              {formatOptions?.find(f => f?.value === selectedFormat)?.label} Format
            </p>
            <p>
              {formatOptions?.find(f => f?.value === selectedFormat)?.description}
              {selectedFormat === 'pdf' && ' - Best for printing and sharing'}
              {selectedFormat === 'epub' && ' - Ideal for e-readers and mobile devices'}
              {selectedFormat === 'docx' && ' - Perfect for further editing'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAction;