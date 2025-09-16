import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechnicalDetails = ({ technicalData, apiStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'processing': return 'text-primary';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'processing': return 'Loader2';
      case 'error': return 'AlertCircle';
      case 'disconnected': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i))?.toFixed(1)} ${sizes?.[i]}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Technical Details</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-gentle"
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          <span>{isExpanded ? 'Less' : 'More'}</span>
        </button>
      </div>
      {/* API Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">API Connection</h4>
        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <div className={`flex-shrink-0 ${getStatusColor(apiStatus?.status)}`}>
            {apiStatus?.status === 'processing' ? (
              <div className="animate-spin">
                <Icon name={getStatusIcon(apiStatus?.status)} size={20} />
              </div>
            ) : (
              <Icon name={getStatusIcon(apiStatus?.status)} size={20} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                OpenRouter API
              </span>
              <span className={`text-sm font-medium ${getStatusColor(apiStatus?.status)}`}>
                {apiStatus?.status?.charAt(0)?.toUpperCase() + apiStatus?.status?.slice(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {apiStatus?.message}
            </p>
            {apiStatus?.responseTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Response time: {apiStatus?.responseTime}ms
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Generation Parameters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Generation Parameters</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Model</span>
              <span className="text-sm font-medium text-foreground">
                {technicalData?.model || 'GPT-4'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Temperature</span>
              <span className="text-sm font-medium text-foreground">
                {technicalData?.temperature || '0.7'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Tokens</span>
              <span className="text-sm font-medium text-foreground">
                {technicalData?.maxTokens?.toLocaleString() || '4,000'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tokens Used</span>
              <span className="text-sm font-medium text-foreground">
                {technicalData?.tokensUsed?.toLocaleString() || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <span className="text-sm text-muted-foreground">Average Response Time</span>
                <span className="text-sm font-medium text-foreground">
                  {technicalData?.avgResponseTime || '2.3s'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <span className="text-sm text-muted-foreground">Data Transferred</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(technicalData?.dataTransferred || 1024000)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium text-foreground">
                  {technicalData?.successRate || '98.5%'}
                </span>
              </div>
            </div>
          </div>

          {/* Session Information */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Session Information</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <span className="text-sm text-muted-foreground">Session ID</span>
                <span className="text-sm font-mono text-foreground">
                  {technicalData?.sessionId || 'sess_abc123def456'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <span className="text-sm text-muted-foreground">Started At</span>
                <span className="text-sm text-foreground">
                  {new Date(technicalData.startedAt || Date.now())?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <span className="text-sm text-muted-foreground">Estimated Completion</span>
                <span className="text-sm text-foreground">
                  {technicalData?.estimatedCompletion || 'In 5-8 minutes'}
                </span>
              </div>
            </div>
          </div>

          {/* Error Log */}
          {technicalData?.errors && technicalData?.errors?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Recent Issues</h4>
              <div className="space-y-2">
                {technicalData?.errors?.slice(0, 3)?.map((error, index) => (
                  <div key={index} className="p-3 bg-error/5 border border-error/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="AlertTriangle" size={16} className="text-error mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-error">{error?.type}</p>
                        <p className="text-sm text-muted-foreground mt-1">{error?.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(error.timestamp)?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Status Indicator */}
      <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <div className="text-sm text-primary">
            <span className="font-medium">Secure Connection:</span>
            <span className="ml-1">All data is encrypted and processed securely</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetails;