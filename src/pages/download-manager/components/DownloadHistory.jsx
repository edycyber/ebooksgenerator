import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const DownloadHistory = ({ downloads = [] }) => {
  const [timeFilter, setTimeFilter] = useState('all');

  const timeFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const filterDownloadsByTime = (downloads, filter) => {
    if (filter === 'all') return downloads;
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek?.setDate(startOfDay?.getDate() - startOfDay?.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return downloads?.filter(download => {
      const downloadDate = new Date(download.downloadedAt);
      
      switch (filter) {
        case 'today':
          return downloadDate >= startOfDay;
        case 'week':
          return downloadDate >= startOfWeek;
        case 'month':
          return downloadDate >= startOfMonth;
        default:
          return true;
      }
    });
  };

  const filteredDownloads = filterDownloadsByTime(downloads, timeFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getFormatIcon = (format) => {
    const icons = {
      pdf: 'FileText',
      docx: 'FileText',
      epub: 'Book',
      txt: 'File'
    };
    return icons?.[format] || 'File';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'failed':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'downloading':
        return <Icon name="Download" size={16} className="text-primary animate-pulse" />;
      default:
        return <Icon name="Clock" size={16} className="text-muted-foreground" />;
    }
  };

  // Group downloads by date
  const groupedDownloads = filteredDownloads?.reduce((groups, download) => {
    const date = new Date(download.downloadedAt)?.toDateString();
    if (!groups?.[date]) {
      groups[date] = [];
    }
    groups?.[date]?.push(download);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedDownloads)?.sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="History" size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Download History</h3>
          </div>
          <Select
            options={timeFilterOptions}
            value={timeFilter}
            onChange={setTimeFilter}
            className="w-32"
          />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sortedDates?.length > 0 ? (
          <div className="divide-y divide-border">
            {sortedDates?.map(date => (
              <div key={date} className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {new Date(date)?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                <div className="space-y-3">
                  {groupedDownloads?.[date]?.map((download) => (
                    <div key={download?.id} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon 
                          name={getFormatIcon(download?.format)} 
                          size={16} 
                          color="var(--color-primary)" 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {download?.fileName}
                          </p>
                          {getStatusIcon(download?.status)}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {download?.format?.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(download?.downloadedAt)}
                          </span>
                          {download?.fileSize && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {(download?.fileSize / (1024 * 1024))?.toFixed(1)} MB
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {download?.status === 'completed' && (
                        <button 
                          className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-gentle"
                          title="Download again"
                        >
                          <Icon name="Download" size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="History" size={20} className="text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">No download history</h4>
            <p className="text-xs text-muted-foreground">
              {timeFilter === 'all' ?'Your download history will appear here.' :'No downloads found for the selected time period.'
              }
            </p>
          </div>
        )}
      </div>
      {/* Summary Stats */}
      {filteredDownloads?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filteredDownloads?.length} downloads
            </span>
            <span className="text-muted-foreground">
              {filteredDownloads?.filter(d => d?.status === 'completed')?.length} successful
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;