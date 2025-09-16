import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ 
  selectedFiles = [], 
  onBulkDownload, 
  onBulkDelete, 
  onClearSelection,
  isProcessing = false 
}) => {
  const [downloadFormat, setDownloadFormat] = useState('zip');

  const formatOptions = [
    { value: 'zip', label: 'ZIP Archive', description: 'All files in a single ZIP' },
    { value: 'individual', label: 'Individual Files', description: 'Download each file separately' }
  ];

  const handleBulkDownload = () => {
    if (onBulkDownload) {
      onBulkDownload(selectedFiles, downloadFormat);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles?.length} selected files? This action cannot be undone.`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedFiles);
      }
    }
  };

  if (selectedFiles?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckSquare" size={16} color="var(--color-primary)" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedFiles?.length} file{selectedFiles?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <button
            onClick={onClearSelection}
            className="text-sm text-muted-foreground hover:text-foreground transition-gentle"
          >
            Clear selection
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Download Format Selection */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Download as:
            </span>
            <Select
              options={formatOptions}
              value={downloadFormat}
              onChange={setDownloadFormat}
              className="w-40"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={handleBulkDownload}
              disabled={isProcessing}
              loading={isProcessing}
            >
              Download All
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={handleBulkDelete}
              disabled={isProcessing}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      {/* Processing Status */}
      {isProcessing && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin">
              <Icon name="Loader2" size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                Processing bulk operation...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {downloadFormat === 'zip' ?'Creating ZIP archive with selected files.' :'Preparing individual file downloads.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Download Tips */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Bulk Download Tips:</p>
            <ul className="text-xs space-y-1">
              <li>• ZIP format is recommended for multiple files</li>
              <li>• Large downloads may take a few minutes to prepare</li>
              <li>• Individual downloads will start automatically in sequence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;