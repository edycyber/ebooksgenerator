import React from 'react';
import Icon from '../../../components/AppIcon';

const GenerationStats = ({ stats, isGenerating }) => {
  const statItems = [
    {
      label: 'Chapters Generated',
      value: stats?.chaptersGenerated,
      total: stats?.totalChapters,
      icon: 'BookOpen',
      color: 'text-primary'
    },
    {
      label: 'Words Written',
      value: stats?.wordsGenerated?.toLocaleString() || '0',
      total: stats?.targetWords?.toLocaleString() || '0',
      icon: 'FileText',
      color: 'text-secondary'
    },
    {
      label: 'API Calls Made',
      value: stats?.apiCalls,
      total: stats?.estimatedApiCalls,
      icon: 'Zap',
      color: 'text-accent'
    },
    {
      label: 'Processing Time',
      value: stats?.processingTime,
      icon: 'Clock',
      color: 'text-muted-foreground'
    }
  ];

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Generation Statistics</h3>
        {isGenerating && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-primary font-medium">Live</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statItems?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-background flex items-center justify-center ${item?.color}`}>
              <Icon name={item?.icon} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item?.label}</p>
              <div className="flex items-center space-x-2 mt-1">
                {item?.total ? (
                  <>
                    <span className="text-lg font-semibold text-foreground">
                      {item?.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {item?.total}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold text-foreground">
                    {item?.label === 'Processing Time' ? formatTime(item?.value) : item?.value}
                  </span>
                )}
              </div>
              {item?.total && (
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((parseInt(String(item?.value || '0')?.replace(/,/g, '')) / parseInt(String(item?.total || '0')?.replace(/,/g, ''))) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-primary">
            <p className="font-medium">Generation Quality</p>
            <p className="mt-1 opacity-90">
              AI is optimizing content structure and maintaining consistency across chapters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationStats;