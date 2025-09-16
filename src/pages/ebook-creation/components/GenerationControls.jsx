import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GenerationControls = ({ 
  formData, 
  isValid, 
  errors, 
  onGenerate,
  isGenerating = false 
}) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const getValidationSummary = () => {
    const requiredFields = [
      { key: 'title', label: 'Title' },
      { key: 'topic', label: 'Topic Description' },
      { key: 'genre', label: 'Genre' },
      { key: 'audience', label: 'Target Audience' },
      { key: 'length', label: 'Ebook Length' },
      { key: 'writingStyle', label: 'Writing Style' },
      { key: 'complexity', label: 'Content Complexity' }
    ];

    const missingFields = requiredFields?.filter(field => 
      !formData?.[field?.key] || formData?.[field?.key] === ''
    );

    const hasErrors = Object.keys(errors)?.length > 0;

    return {
      missingFields,
      hasErrors,
      isComplete: missingFields?.length === 0 && !hasErrors
    };
  };

  const handleGenerate = () => {
    const validation = getValidationSummary();
    
    if (!validation?.isComplete) {
      return;
    }

    if (onGenerate) {
      onGenerate(formData);
    } else {
      // Default navigation to generation progress
      navigate('/generation-progress', { 
        state: { 
          ebookData: formData,
          timestamp: new Date()?.toISOString()
        } 
      });
    }
  };

  const handlePreviewSpecs = () => {
    setShowPreview(!showPreview);
  };

  const validation = getValidationSummary();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Generate Ebook</h3>
      </div>
      {/* Validation Status */}
      <div className="mb-6">
        {validation?.isComplete ? (
          <div className="flex items-start space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
            <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            <div>
              <h4 className="text-sm font-medium text-success">Ready to Generate</h4>
              <p className="text-sm text-muted-foreground mt-1">
                All required specifications have been provided. Your ebook is ready for AI generation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {validation?.missingFields?.length > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                <div>
                  <h4 className="text-sm font-medium text-warning">Missing Required Fields</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please complete the following fields:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    {validation?.missingFields?.map(field => (
                      <li key={field?.key} className="flex items-center space-x-1">
                        <Icon name="Minus" size={12} />
                        <span>{field?.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {validation?.hasErrors && (
              <div className="flex items-start space-x-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                <Icon name="AlertCircle" size={20} color="var(--color-error)" />
                <div>
                  <h4 className="text-sm font-medium text-error">Validation Errors</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please fix the validation errors in the form above.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Specification Preview */}
      {showPreview && validation?.isComplete && (
        <div className="mb-6 p-4 bg-muted/20 border border-border rounded-lg">
          <h4 className="text-sm font-semibold text-foreground mb-3">Specification Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <span className="ml-2 text-foreground font-medium">{formData?.title}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Genre:</span>
                <span className="ml-2 text-foreground capitalize">{formData?.genre}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Length:</span>
                <span className="ml-2 text-foreground capitalize">
                  {formData?.length === 'custom' 
                    ? `${formData?.customWordCount?.toLocaleString()} words`
                    : formData?.length
                  }
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Audience:</span>
                <span className="ml-2 text-foreground capitalize">{formData?.audience}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Style:</span>
                <span className="ml-2 text-foreground capitalize">{formData?.writingStyle}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Complexity:</span>
                <span className="ml-2 text-foreground capitalize">{formData?.complexity}</span>
              </div>
            </div>
            
            {formData?.topic && (
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-muted-foreground">Topic:</span>
                <p className="mt-1 text-foreground text-xs leading-relaxed">
                  {formData?.topic?.length > 150 
                    ? `${formData?.topic?.substring(0, 150)}...`
                    : formData?.topic
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={handleGenerate}
          disabled={!validation?.isComplete || isGenerating}
          loading={isGenerating}
          iconName="Zap"
          iconPosition="left"
        >
          {isGenerating ? 'Generating Ebook...' : 'Generate Ebook with AI'}
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="default"
            onClick={handlePreviewSpecs}
            disabled={!validation?.isComplete}
            iconName={showPreview ? "EyeOff" : "Eye"}
            iconPosition="left"
            className="flex-1"
          >
            {showPreview ? 'Hide Preview' : 'Preview Specs'}
          </Button>

          <Button
            variant="ghost"
            size="default"
            onClick={() => navigate('/download-manager')}
            iconName="Library"
            iconPosition="left"
            className="flex-1"
          >
            My Library
          </Button>
        </div>
      </div>
      {/* Generation Info */}
      <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
          <div className="text-sm">
            <p className="text-primary font-medium mb-1">Generation Process</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• AI will analyze your specifications and create structured content</li>
              <li>• Generation typically takes 5-15 minutes depending on length</li>
              <li>• You can monitor progress and cancel if needed</li>
              <li>• Generated content will be available for preview and download</li>
            </ul>
          </div>
        </div>
      </div>
      {/* API Status Indicator */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>AI Service Available</span>
        </div>
        <span>OpenRouter API Connected</span>
      </div>
    </div>
  );
};

export default GenerationControls;