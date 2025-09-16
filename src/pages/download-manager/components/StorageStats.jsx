import React from 'react';
import Icon from '../../../components/AppIcon';

const StorageStats = ({ 
  usedStorage = 0, 
  totalStorage = 5368709120, // 5GB in bytes
  fileCount = 0,
  downloadCount = 0,
  accountType = 'free'
}) => {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i))?.toFixed(1)} ${sizes?.[i]}`;
  };

  const usagePercentage = Math.round((usedStorage / totalStorage) * 100);
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 95;

  const getStorageColor = () => {
    if (isAtLimit) return 'bg-error';
    if (isNearLimit) return 'bg-warning';
    return 'bg-primary';
  };

  const stats = [
    {
      label: 'Total Files',
      value: fileCount?.toLocaleString(),
      icon: 'FileText',
      color: 'text-primary'
    },
    {
      label: 'Total Downloads',
      value: downloadCount?.toLocaleString(),
      icon: 'Download',
      color: 'text-success'
    },
    {
      label: 'Account Type',
      value: accountType?.charAt(0)?.toUpperCase() + accountType?.slice(1),
      icon: 'Crown',
      color: accountType === 'premium' ? 'text-accent' : 'text-muted-foreground'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Storage Usage</h3>
        <Icon name="HardDrive" size={20} className="text-muted-foreground" />
      </div>
      {/* Storage Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {formatBytes(usedStorage)} used
          </span>
          <span className="text-sm text-muted-foreground">
            {formatBytes(totalStorage)} total
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getStorageColor()}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {usagePercentage}% used
          </span>
          {isNearLimit && (
            <span className={`text-xs font-medium ${isAtLimit ? 'text-error' : 'text-warning'}`}>
              {isAtLimit ? 'Storage Full' : 'Nearly Full'}
            </span>
          )}
        </div>
      </div>
      {/* Warning Messages */}
      {isNearLimit && (
        <div className={`p-3 rounded-lg border mb-6 ${
          isAtLimit 
            ? 'bg-error/5 border-error/20' :'bg-warning/5 border-warning/20'
        }`}>
          <div className="flex items-start space-x-2">
            <Icon 
              name={isAtLimit ? 'AlertCircle' : 'AlertTriangle'} 
              size={16} 
              className={isAtLimit ? 'text-error' : 'text-warning'}
            />
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                isAtLimit ? 'text-error' : 'text-warning'
              }`}>
                {isAtLimit ? 'Storage Limit Reached' : 'Storage Nearly Full'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isAtLimit 
                  ? 'Delete some files or upgrade your plan to continue.'
                  : 'Consider cleaning up old files or upgrading your plan.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Stats Grid */}
      <div className="space-y-4">
        {stats?.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted/30 rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={16} className={stat?.color} />
              </div>
              <span className="text-sm text-muted-foreground">{stat?.label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{stat?.value}</span>
          </div>
        ))}
      </div>
      {/* Upgrade Prompt for Free Users */}
      {accountType === 'free' && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Zap" size={18} color="var(--color-primary)" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-primary mb-1">
                Upgrade to Premium
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get unlimited storage, faster generation, and priority support.
              </p>
              <button className="text-xs font-medium text-primary hover:text-primary/80 transition-gentle">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-gentle">
            <Icon name="Trash2" size={16} />
            <span>Clean Up Old Files</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-gentle">
            <Icon name="Archive" size={16} />
            <span>Archive Downloads</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-gentle">
            <Icon name="Settings" size={16} />
            <span>Storage Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageStats;