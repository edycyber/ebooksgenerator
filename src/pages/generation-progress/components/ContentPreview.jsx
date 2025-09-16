import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentPreview = ({ generatedContent, isGenerating }) => {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!generatedContent || generatedContent?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Content Preview</h3>
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No content yet</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Content will appear here as it's generated</p>
          {isGenerating && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} color="var(--color-primary)" />
              </div>
              <span className="text-sm text-primary">Generating content...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentChapter = generatedContent?.[selectedChapter];

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Content Preview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {generatedContent?.length} chapter{generatedContent?.length !== 1 ? 's' : ''} generated
          </span>
          {isGenerating && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">Live</span>
            </div>
          )}
        </div>
      </div>
      {/* Chapter Navigation */}
      {generatedContent?.length > 1 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {generatedContent?.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setSelectedChapter(index)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-gentle
                  ${selectedChapter === index
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                Chapter {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Content Display */}
      <div className="p-4">
        {currentChapter && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  {currentChapter?.title}
                </h4>
                {currentChapter?.subtitle && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentChapter?.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-muted-foreground">
                  {currentChapter?.wordCount} words
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </Button>
              </div>
            </div>

            <div className={`
              prose prose-sm max-w-none text-foreground
              ${isExpanded ? 'max-h-none' : 'max-h-64 overflow-hidden'}
              transition-all duration-300
            `}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {currentChapter?.content}
              </div>
            </div>

            {!isExpanded && currentChapter?.content?.length > 500 && (
              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent"></div>
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ChevronDown"
                    onClick={() => setIsExpanded(true)}
                  >
                    Show More
                  </Button>
                </div>
              </div>
            )}

            {/* Chapter Metadata */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Generated: {new Date(currentChapter.generatedAt)?.toLocaleTimeString()}</span>
                <span>•</span>
                <span>Status: {currentChapter?.status}</span>
              </div>
              {currentChapter?.status === 'completed' && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Preview Actions */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Content updates automatically as generation progresses</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Copy">
              Copy Text
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export Chapter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;