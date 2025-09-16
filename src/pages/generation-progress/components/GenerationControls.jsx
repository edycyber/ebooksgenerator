import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationControls = ({ 
  isGenerating, 
  onCancel, 
  onPause, 
  onResume, 
  isPaused,
  canRetry,
  onRetry,
  onViewPreview,
  hasContent
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    if (onCancel) onCancel();
  };

  const handleCancelDialog = () => {
    setShowCancelDialog(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Generation Controls</h3>
          <div className="flex items-center space-x-2">
            {isGenerating && !isPaused && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">Active</span>
              </div>
            )}
            {isPaused && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-warning font-medium">Paused</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="space-y-3">
          {isGenerating && !isPaused && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Pause"
                iconPosition="left"
                onClick={onPause}
                className="flex-1"
              >
                Pause Generation
              </Button>
              <Button
                variant="destructive"
                iconName="X"
                iconPosition="left"
                onClick={handleCancelClick}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}

          {isPaused && (
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                iconName="Play"
                iconPosition="left"
                onClick={onResume}
                className="flex-1"
              >
                Resume Generation
              </Button>
              <Button
                variant="destructive"
                iconName="X"
                iconPosition="left"
                onClick={handleCancelClick}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}

          {!isGenerating && canRetry && (
            <Button
              variant="default"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={onRetry}
              fullWidth
            >
              Retry Generation
            </Button>
          )}

          {hasContent && (
            <Button
              variant="outline"
              iconName="Eye"
              iconPosition="left"
              onClick={onViewPreview}
              fullWidth
            >
              View Full Preview
            </Button>
          )}
        </div>

        {/* Status Information */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Generation Status</p>
              {isGenerating && !isPaused && (
                <p>Your ebook is being generated. You can pause or cancel at any time without losing progress.</p>
              )}
              {isPaused && (
                <p>Generation is paused. Resume to continue or cancel to stop the process.</p>
              )}
              {!isGenerating && !canRetry && (
                <p>Generation completed successfully. You can now preview and download your ebook.</p>
              )}
              {!isGenerating && canRetry && (
                <p>Generation encountered an issue. You can retry the process or contact support.</p>
              )}
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-primary" />
            <div className="text-sm text-primary">
              <span className="font-medium">Session Protected:</span>
              <span className="ml-1">Your progress is automatically saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-prominent max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Cancel Generation?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Are you sure you want to cancel the ebook generation? This action cannot be undone, 
                    but any completed content will be saved.
                  </p>
                </div>
              </div>

              <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-warning">
                    <p className="font-medium">What happens when you cancel:</p>
                    <ul className="mt-1 space-y-1 text-sm opacity-90">
                      <li>• Current generation process will stop immediately</li>
                      <li>• Completed chapters will be preserved</li>
                      <li>• You can start a new generation anytime</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancelDialog}
                  className="flex-1"
                >
                  Keep Generating
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmCancel}
                  className="flex-1"
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerationControls;