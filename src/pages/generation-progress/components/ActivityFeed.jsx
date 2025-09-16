import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, isGenerating }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'outline': 'FileText',
      'chapter': 'BookOpen',
      'content': 'Edit3',
      'format': 'Layout',
      'api': 'Zap',
      'error': 'AlertCircle',
      'success': 'CheckCircle',
      'info': 'Info'
    };
    return icons?.[type] || 'Circle';
  };

  const getActivityColor = (type, status) => {
    if (status === 'error') return 'text-error';
    if (status === 'success') return 'text-success';
    if (status === 'processing') return 'text-primary';
    
    const colors = {
      'outline': 'text-secondary',
      'chapter': 'text-primary',
      'content': 'text-accent',
      'format': 'text-success',
      'api': 'text-primary',
      'error': 'text-error',
      'success': 'text-success',
      'info': 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Activity Feed</h3>
        {isGenerating && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin">
              <Icon name="Loader2" size={16} color="var(--color-primary)" />
            </div>
            <span className="text-sm text-primary font-medium">Processing</span>
          </div>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Clock" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Waiting for generation to start...</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activities?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  activity?.status === 'processing' ? 'bg-primary/10' :
                  activity?.status === 'success' ? 'bg-success/10' :
                  activity?.status === 'error'? 'bg-error/10' : 'bg-muted'
                }`}>
                  {activity?.status === 'processing' ? (
                    <div className="animate-spin">
                      <Icon name="Loader2" size={12} color="var(--color-primary)" />
                    </div>
                  ) : (
                    <Icon 
                      name={getActivityIcon(activity?.type)} 
                      size={12} 
                      className={getActivityColor(activity?.type, activity?.status)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity?.title}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatTimestamp(activity?.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity?.description}
                  </p>
                  {activity?.details && (
                    <div className="mt-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                      {activity?.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isGenerating && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Monitoring generation progress...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;