import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';
import DownloadAction from '../../../components/ui/DownloadAction';

const MetadataPanel = ({
  metadata = {},
  onMetadataChange,
  onDownload,
  downloadProgress = null,
  isDownloading = false,
  isEditing = false
}) => {
  const [localMetadata, setLocalMetadata] = useState({
    title: "The Complete Guide to AI Innovation",
    author: "Dr. Sarah Chen",
    description: "A comprehensive exploration of artificial intelligence technologies and their transformative impact on modern business and society.",
    genre: "Technology",
    language: "English",
    pages: 156,
    wordCount: 42850,
    createdAt: "2025-01-16T15:06:24.977Z",
    lastModified: "2025-01-16T15:06:24.977Z",
    version: "1.0",
    tags: ["AI", "Technology", "Innovation", "Business"],
    ...metadata
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleMetadataUpdate = (field, value) => {
    const updated = { ...localMetadata, [field]: value };
    setLocalMetadata(updated);
    onMetadataChange(updated);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReadingTime = (wordCount) => {
    return Math.ceil(wordCount / 250);
  };

  const availableFormats = ['pdf', 'epub', 'docx'];

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">Book Details</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Metadata and download options
        </p>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Basic Information</h4>
          
          <Input
            label="Title"
            type="text"
            value={localMetadata?.title}
            onChange={(e) => handleMetadataUpdate('title', e?.target?.value)}
            disabled={!isEditing}
            className="mb-0"
          />

          <Input
            label="Author"
            type="text"
            value={localMetadata?.author}
            onChange={(e) => handleMetadataUpdate('author', e?.target?.value)}
            disabled={!isEditing}
            className="mb-0"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={localMetadata?.description}
              onChange={(e) => handleMetadataUpdate('description', e?.target?.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed resize-none"
              placeholder="Book description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Genre"
              type="text"
              value={localMetadata?.genre}
              onChange={(e) => handleMetadataUpdate('genre', e?.target?.value)}
              disabled={!isEditing}
              className="mb-0"
            />
            <Input
              label="Language"
              type="text"
              value={localMetadata?.language}
              onChange={(e) => handleMetadataUpdate('language', e?.target?.value)}
              disabled={!isEditing}
              className="mb-0"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Statistics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="FileText" size={16} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Pages</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {localMetadata?.pages}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Type" size={16} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Words</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {localMetadata?.wordCount?.toLocaleString()}
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Clock" size={16} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Read Time</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {getReadingTime(localMetadata?.wordCount)} min
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Calendar" size={16} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Version</span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {localMetadata?.version}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Details */}
        <div className="space-y-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-gentle"
          >
            <Icon name={showAdvanced ? "ChevronDown" : "ChevronRight"} size={16} />
            <span>Advanced Details</span>
          </button>

          {showAdvanced && (
            <div className="space-y-3 pl-6">
              <div className="text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">
                  {formatDate(localMetadata?.createdAt)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Last Modified:</span>
                <span className="ml-2 text-foreground">
                  {formatDate(localMetadata?.lastModified)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {localMetadata?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Download</h4>
          
          <DownloadAction
            fileName={localMetadata?.title?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase() || 'ebook'}
            fileSize={localMetadata?.wordCount * 6} // Approximate file size
            availableFormats={availableFormats}
            onDownload={onDownload}
            downloadProgress={downloadProgress}
            isDownloading={isDownloading}
            metadata={{
              author: localMetadata?.author,
              pages: localMetadata?.pages,
              wordCount: localMetadata?.wordCount,
              createdAt: localMetadata?.createdAt
            }}
            showPreview={false}
            className="mb-0"
          />
        </div>
      </div>
    </div>
  );
};

export default MetadataPanel;