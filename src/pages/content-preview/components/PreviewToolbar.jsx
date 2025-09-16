import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PreviewToolbar = ({
  onDownload,
  onPrint,
  onShare,
  onRegenerate,
  onSave,
  isEditing,
  onToggleEdit,
  viewMode = 'document',
  onViewModeChange,
  zoomLevel = 100,
  onZoomChange,
  autoSaveStatus = 'saved',
  lastSaved = null
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const viewModeOptions = [
    { value: 'document', label: 'Document View', description: 'Standard document layout' },
    { value: 'reader', label: 'Reader View', description: 'Optimized for reading' },
    { value: 'print', label: 'Print Preview', description: 'How it will look when printed' }
  ];

  const zoomOptions = [
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
    { value: 125, label: '125%' },
    { value: 150, label: '150%' },
    { value: 200, label: '200%' }
  ];

  const getAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <Icon name="Loader2" size={14} className="animate-spin text-primary" />;
      case 'saved':
        return <Icon name="Check" size={14} className="text-success" />;
      case 'error':
        return <Icon name="AlertCircle" size={14} className="text-error" />;
      default:
        return <Icon name="Clock" size={14} className="text-muted-foreground" />;
    }
  };

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const saved = new Date(timestamp);
    const diffInMinutes = Math.floor((now - saved) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return saved?.toLocaleDateString();
  };

  return (
    <div className="bg-card border-b border-border shadow-subtle">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - View Controls */}
        <div className="flex items-center space-x-4">
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={onViewModeChange}
            className="w-40"
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ZoomOut"
              onClick={() => onZoomChange(Math.max(50, zoomLevel - 25))}
              disabled={zoomLevel <= 50}
            />
            <Select
              options={zoomOptions}
              value={zoomLevel}
              onChange={onZoomChange}
              className="w-20"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="ZoomIn"
              onClick={() => onZoomChange(Math.min(200, zoomLevel + 25))}
              disabled={zoomLevel >= 200}
            />
          </div>
        </div>

        {/* Center Section - Auto-save Status */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {getAutoSaveIcon()}
          <span>
            {autoSaveStatus === 'saving' && 'Saving...'}
            {autoSaveStatus === 'saved' && `Saved ${formatLastSaved(lastSaved)}`}
            {autoSaveStatus === 'error' && 'Save failed'}
            {autoSaveStatus === 'pending' && 'Unsaved changes'}
          </span>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            onClick={onRegenerate}
          >
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Printer"
            onClick={onPrint}
          >
            Print
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              Share
            </Button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-prominent z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      onShare('link');
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-gentle flex items-center space-x-2"
                  >
                    <Icon name="Link" size={16} />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={() => {
                      onShare('email');
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-gentle flex items-center space-x-2"
                  >
                    <Icon name="Mail" size={16} />
                    <span>Email</span>
                  </button>
                  <button
                    onClick={() => {
                      onShare('export');
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-gentle flex items-center space-x-2"
                  >
                    <Icon name="FileDown" size={16} />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            iconName={isEditing ? "Check" : "Edit"}
            onClick={onToggleEdit}
          >
            {isEditing ? 'Done' : 'Edit'}
          </Button>

          <Button
            variant="default"
            size="sm"
            iconName="Download"
            onClick={onDownload}
          >
            Download
          </Button>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default PreviewToolbar;