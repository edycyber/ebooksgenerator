import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentEditor = ({ 
  content, 
  onContentChange, 
  selectedChapter = 0,
  isEditing = false,
  onToggleEdit
}) => {
  const [localContent, setLocalContent] = useState(content);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [findResults, setFindResults] = useState([]);
  const [currentFindIndex, setCurrentFindIndex] = useState(0);
  const editorRef = useRef(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleContentEdit = (chapterIndex, newText) => {
    const updatedContent = { ...localContent };
    updatedContent.chapters[chapterIndex].content = newText;
    setLocalContent(updatedContent);
    onContentChange(updatedContent);
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    
    const results = [];
    localContent?.chapters?.forEach((chapter, chapterIndex) => {
      const regex = new RegExp(searchTerm, 'gi');
      let match;
      while ((match = regex?.exec(chapter?.content)) !== null) {
        results?.push({
          chapterIndex,
          position: match?.index,
          text: match?.[0]
        });
      }
    });
    
    setFindResults(results);
    setCurrentFindIndex(0);
  };

  const handleReplaceAll = () => {
    if (!searchTerm || !replaceTerm) return;
    
    const updatedContent = { ...localContent };
    updatedContent.chapters = updatedContent?.chapters?.map(chapter => ({
      ...chapter,
      content: chapter?.content?.replace(new RegExp(searchTerm, 'gi'), replaceTerm)
    }));
    
    setLocalContent(updatedContent);
    onContentChange(updatedContent);
    setFindResults([]);
    setSearchTerm('');
    setReplaceTerm('');
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const insertHeading = (level) => {
    const selection = window.getSelection();
    if (selection?.rangeCount > 0) {
      const range = selection?.getRangeAt(0);
      const heading = document.createElement(`h${level}`);
      heading.className = level === 1 ? 'text-2xl font-bold mb-4' : 
                         level === 2 ? 'text-xl font-semibold mb-3': 'text-lg font-medium mb-2';
      
      try {
        range?.surroundContents(heading);
      } catch (e) {
        heading.textContent = selection?.toString();
        range?.deleteContents();
        range?.insertNode(heading);
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate h-full flex flex-col">
      {/* Editor Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Content Editor</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Search"
              onClick={() => setShowSearchReplace(!showSearchReplace)}
            >
              Find & Replace
            </Button>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              iconName={isEditing ? "Check" : "Edit"}
              onClick={onToggleEdit}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Search & Replace Panel */}
        {showSearchReplace && (
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Find
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Search text..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Search"
                    onClick={handleSearch}
                  >
                    Find
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Replace
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Replace with..."
                  />
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Replace"
                    onClick={handleReplaceAll}
                    disabled={!searchTerm || !replaceTerm}
                  >
                    Replace All
                  </Button>
                </div>
              </div>
            </div>
            {findResults?.length > 0 && (
              <div className="mt-3 text-sm text-muted-foreground">
                Found {findResults?.length} matches
              </div>
            )}
          </div>
        )}

        {/* Formatting Toolbar */}
        {isEditing && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 border-r border-border pr-3">
              <button
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-muted rounded transition-gentle"
                title="Bold"
              >
                <Icon name="Bold" size={16} />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-muted rounded transition-gentle"
                title="Italic"
              >
                <Icon name="Italic" size={16} />
              </button>
              <button
                onClick={() => formatText('underline')}
                className="p-2 hover:bg-muted rounded transition-gentle"
                title="Underline"
              >
                <Icon name="Underline" size={16} />
              </button>
            </div>

            <div className="flex items-center space-x-1 border-r border-border pr-3">
              <button
                onClick={() => insertHeading(1)}
                className="px-3 py-2 text-sm font-medium hover:bg-muted rounded transition-gentle"
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => insertHeading(2)}
                className="px-3 py-2 text-sm font-medium hover:bg-muted rounded transition-gentle"
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => insertHeading(3)}
                className="px-3 py-2 text-sm font-medium hover:bg-muted rounded transition-gentle"
                title="Heading 3"
              >
                H3
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('insertUnorderedList')}
                className="p-2 hover:bg-muted rounded transition-gentle"
                title="Bullet List"
              >
                <Icon name="List" size={16} />
              </button>
              <button
                onClick={() => formatText('insertOrderedList')}
                className="p-2 hover:bg-muted rounded transition-gentle"
                title="Numbered List"
              >
                <Icon name="ListOrdered" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {localContent?.chapters && localContent?.chapters?.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {/* Chapter Title */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {localContent?.chapters?.[selectedChapter]?.title || `Chapter ${selectedChapter + 1}`}
                </h1>
                <div className="w-16 h-1 bg-primary rounded-full"></div>
              </div>

              {/* Chapter Content */}
              <div
                ref={editorRef}
                className={`
                  prose prose-lg max-w-none text-foreground
                  ${isEditing ? 'border border-dashed border-primary/30 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/20' : ''}
                `}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  if (isEditing) {
                    handleContentEdit(selectedChapter, e?.target?.innerHTML);
                  }
                }}
                dangerouslySetInnerHTML={{
                  __html: localContent?.chapters?.[selectedChapter]?.content || 'No content available'
                }}
              />

              {/* Chapter Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  iconName="ChevronLeft"
                  iconPosition="left"
                  disabled={selectedChapter === 0}
                  onClick={() => {
                    // This would be handled by parent component
                  }}
                >
                  Previous Chapter
                </Button>

                <span className="text-sm text-muted-foreground">
                  Chapter {selectedChapter + 1} of {localContent?.chapters?.length}
                </span>

                <Button
                  variant="outline"
                  iconName="ChevronRight"
                  iconPosition="right"
                  disabled={selectedChapter === localContent?.chapters?.length - 1}
                  onClick={() => {
                    // This would be handled by parent component
                  }}
                >
                  Next Chapter
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Content Available</h3>
                <p className="text-muted-foreground">
                  Generate content first to preview and edit your ebook.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;