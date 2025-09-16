import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 0, 
  totalSteps = 4, 
  steps = [],
  status = 'processing',
  onCancel,
  progress = 0,
  estimatedTime = null,
  currentTask = ''
}) => {
  const defaultSteps = [
    { label: 'Analyzing Requirements', description: 'Processing your ebook specifications' },
    { label: 'Generating Content', description: 'Creating chapters and sections' },
    { label: 'Formatting Structure', description: 'Organizing content layout' },
    { label: 'Finalizing Output', description: 'Preparing downloadable files' }
  ];

  const processSteps = steps?.length > 0 ? steps : defaultSteps;

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return status;
    return 'pending';
  };

  const getStepIcon = (stepIndex, stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return <Icon name="Check" size={16} color="var(--color-success)" />;
      case 'processing':
        return (
          <div className="animate-spin">
            <Icon name="Loader2" size={16} color="var(--color-primary)" />
          </div>
        );
      case 'error':
        return <Icon name="AlertCircle" size={16} color="var(--color-error)" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-muted bg-background" />
        );
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Generating Your EBook
          </h3>
          {currentTask && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentTask}
            </p>
          )}
        </div>
        {onCancel && status === 'processing' && (
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-gentle"
          >
            <Icon name="X" size={16} />
            <span>Cancel</span>
          </button>
        )}
      </div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
          {estimatedTime && (
            <span className="text-sm text-muted-foreground">
              ~{formatTime(estimatedTime)} remaining
            </span>
          )}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0%</span>
          <span className="text-xs text-muted-foreground">{progress}%</span>
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>
      {/* Steps */}
      <div className="space-y-4">
        {processSteps?.map((step, index) => {
          const stepStatus = getStepStatus(index);
          return (
            <div
              key={index}
              className={`
                flex items-start space-x-4 p-4 rounded-lg border transition-gentle
                ${stepStatus === 'completed' 
                  ? 'bg-success/5 border-success/20' 
                  : stepStatus === 'processing' ?'bg-primary/5 border-primary/20'
                  : stepStatus === 'error' ?'bg-error/5 border-error/20' :'bg-muted/30 border-border'
                }
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(index, stepStatus)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`
                  text-sm font-medium
                  ${stepStatus === 'completed' 
                    ? 'text-success' 
                    : stepStatus === 'processing' ?'text-primary'
                    : stepStatus === 'error' ?'text-error' :'text-muted-foreground'
                  }
                `}>
                  {step?.label}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {step?.description}
                </p>
                {stepStatus === 'processing' && index === currentStep && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs text-primary font-medium">
                        In progress...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Status Messages */}
      {status === 'error' && (
        <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            <div>
              <h4 className="text-sm font-medium text-error">
                Generation Failed
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                An error occurred during the generation process. Please try again or contact support if the issue persists.
              </p>
            </div>
          </div>
        </div>
      )}
      {status === 'completed' && (
        <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            <div>
              <h4 className="text-sm font-medium text-success">
                Generation Complete
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your ebook has been successfully generated and is ready for preview.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;