import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChapterNavigation = ({ 
  chapters = [], 
  selectedChapter = 0, 
  onChapterSelect,
  onAddChapter,
  onDeleteChapter,
  onReorderChapter,
  isEditing = false
}) => {
  const handleMoveChapter = (fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < chapters?.length) {
      onReorderChapter(fromIndex, toIndex);
    }
  };

  const getChapterWordCount = (content) => {
    if (!content) return 0;
    const text = content?.replace(/<[^>]*>/g, '');
    return text?.split(/\s+/)?.filter(word => word?.length > 0)?.length;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Chapters</h3>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={onAddChapter}
            >
              Add Chapter
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {chapters?.length} chapters • Click to navigate
        </p>
      </div>
      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto">
        {chapters?.length > 0 ? (
          <div className="p-2">
            {chapters?.map((chapter, index) => (
              <div
                key={index}
                className={`
                  group relative p-3 mb-2 rounded-lg border cursor-pointer transition-gentle
                  ${selectedChapter === index
                    ? 'bg-primary/10 border-primary/30 shadow-subtle'
                    : 'bg-background border-border hover:bg-muted/50 hover:border-muted-foreground/20'
                  }
                `}
                onClick={() => onChapterSelect(index)}
              >
                {/* Chapter Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Chapter {index + 1}
                      </span>
                      {selectedChapter === index && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>
                    <h4 className={`
                      text-sm font-medium truncate
                      ${selectedChapter === index ? 'text-primary' : 'text-foreground'}
                    `}>
                      {chapter?.title || `Untitled Chapter ${index + 1}`}
                    </h4>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                      <span>{getChapterWordCount(chapter?.content)} words</span>
                      <span>•</span>
                      <span>
                        {Math.ceil(getChapterWordCount(chapter?.content) / 250)} min read
                      </span>
                    </div>
                  </div>

                  {/* Chapter Actions */}
                  {isEditing && (
                    <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-gentle">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleMoveChapter(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <Icon name="ChevronUp" size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleMoveChapter(index, 'down');
                        }}
                        disabled={index === chapters?.length - 1}
                        className="p-1 hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <Icon name="ChevronDown" size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDeleteChapter(index);
                        }}
                        disabled={chapters?.length <= 1}
                        className="p-1 hover:bg-error/10 text-error rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete chapter"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Chapter Preview */}
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {chapter?.content 
                      ? chapter?.content?.replace(/<[^>]*>/g, '')?.substring(0, 100) + '...'
                      : 'No content available'
                    }
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        selectedChapter === index ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                      style={{
                        width: `${Math.min(100, (getChapterWordCount(chapter?.content) / 1000) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="text-sm font-medium text-foreground mb-2">No Chapters</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Add chapters to organize your ebook content
              </p>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={onAddChapter}
                >
                  Add First Chapter
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Footer Stats */}
      {chapters?.length > 0 && (
        <div className="border-t border-border p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {chapters?.reduce((total, chapter) => total + getChapterWordCount(chapter?.content), 0)?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Words</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {Math.ceil(chapters?.reduce((total, chapter) => total + getChapterWordCount(chapter?.content), 0) / 250)}
              </div>
              <div className="text-xs text-muted-foreground">Minutes Read</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterNavigation;