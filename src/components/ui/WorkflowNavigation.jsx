import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const WorkflowNavigation = ({ 
  currentStep = 0,
  canNavigateBack = true,
  canNavigateForward = false,
  onBack,
  onForward,
  customSteps = null
}) => {
  const location = useLocation();

  const defaultWorkflowSteps = [
    {
      key: 'create',
      label: 'Create',
      path: '/ebook-creation',
      icon: 'FileText',
      description: 'Define ebook specifications'
    },
    {
      key: 'progress',
      label: 'Generate',
      path: '/generation-progress',
      icon: 'Zap',
      description: 'AI content generation'
    },
    {
      key: 'preview',
      label: 'Preview',
      path: '/content-preview',
      icon: 'Eye',
      description: 'Review and edit content'
    },
    {
      key: 'download',
      label: 'Download',
      path: '/download-manager',
      icon: 'Download',
      description: 'Get your finished ebook'
    }
  ];

  const workflowSteps = customSteps || defaultWorkflowSteps;

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const isStepAccessible = (stepIndex) => {
    return stepIndex <= currentStep;
  };

  const handleStepClick = (step, stepIndex) => {
    if (!isStepAccessible(stepIndex)) return;
    
    // Custom navigation handlers take precedence
    if (stepIndex < currentStep && onBack) {
      onBack(step, stepIndex);
    } else if (stepIndex > currentStep && onForward) {
      onForward(step, stepIndex);
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Breadcrumb Style Navigation */}
        <nav className="flex items-center space-x-2 overflow-x-auto">
          {workflowSteps?.map((step, index) => {
            const status = getStepStatus(index);
            const isAccessible = isStepAccessible(index);
            const isLast = index === workflowSteps?.length - 1;

            return (
              <React.Fragment key={step?.key}>
                <div
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-gentle whitespace-nowrap
                    ${status === 'current' ?'bg-primary text-primary-foreground shadow-subtle'
                      : status === 'completed' ?'bg-success/10 text-success hover:bg-success/20 cursor-pointer'
                      : isAccessible
                      ? 'text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer'
                      : 'text-muted-foreground/50 cursor-not-allowed'
                    }
                  `}
                  onClick={() => handleStepClick(step, index)}
                  role={isAccessible ? 'button' : 'text'}
                  tabIndex={isAccessible ? 0 : -1}
                  title={step?.description}
                >
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} />
                    ) : status === 'current' ? (
                      <Icon name={step?.icon} size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <span className="hidden sm:inline">{step?.label}</span>
                </div>
                {!isLast && (
                  <Icon 
                    name="ChevronRight" 
                    size={16} 
                    className="text-muted-foreground flex-shrink-0" 
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Mobile Step Indicator */}
        <div className="sm:hidden mt-3 flex items-center justify-center space-x-2">
          {workflowSteps?.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-gentle
                ${getStepStatus(index) === 'current' ?'bg-primary'
                  : getStepStatus(index) === 'completed' ?'bg-success' :'bg-muted'
                }
              `}
            />
          ))}
        </div>

        {/* Current Step Info */}
        <div className="mt-4 text-center sm:text-left">
          <h2 className="text-lg font-semibold text-foreground">
            {workflowSteps?.[currentStep]?.label}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {workflowSteps?.[currentStep]?.description}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-4">
          <div>
            {canNavigateBack && currentStep > 0 && (
              <button
                onClick={() => onBack && onBack(workflowSteps?.[currentStep - 1], currentStep - 1)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-gentle"
              >
                <Icon name="ChevronLeft" size={16} />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {workflowSteps?.length}</span>
          </div>

          <div>
            {canNavigateForward && currentStep < workflowSteps?.length - 1 && (
              <button
                onClick={() => onForward && onForward(workflowSteps?.[currentStep + 1], currentStep + 1)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-gentle"
              >
                <span>Continue</span>
                <Icon name="ChevronRight" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNavigation;