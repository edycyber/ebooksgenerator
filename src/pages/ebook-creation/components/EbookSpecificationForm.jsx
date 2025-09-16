import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const EbookSpecificationForm = ({ 
  formData, 
  onFormChange, 
  errors = {},
  onValidationChange 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    structure: false,
    style: false,
    advanced: false
  });

  const genreOptions = [
    { value: 'fiction', label: 'Fiction', description: 'Creative storytelling and narratives' },
    { value: 'non-fiction', label: 'Non-Fiction', description: 'Factual and informational content' },
    { value: 'business', label: 'Business', description: 'Professional and entrepreneurial topics' },
    { value: 'self-help', label: 'Self-Help', description: 'Personal development and improvement' },
    { value: 'educational', label: 'Educational', description: 'Learning and instructional materials' },
    { value: 'technical', label: 'Technical', description: 'Specialized technical documentation' },
    { value: 'health', label: 'Health & Wellness', description: 'Medical and wellness information' },
    { value: 'travel', label: 'Travel', description: 'Travel guides and experiences' },
    { value: 'cooking', label: 'Cooking', description: 'Recipes and culinary guides' },
    { value: 'biography', label: 'Biography', description: 'Life stories and memoirs' }
  ];

  const audienceOptions = [
    { value: 'general', label: 'General Audience', description: 'Broad appeal for all readers' },
    { value: 'children', label: 'Children (5-12)', description: 'Age-appropriate content for kids' },
    { value: 'teens', label: 'Teenagers (13-17)', description: 'Young adult focused content' },
    { value: 'adults', label: 'Adults (18+)', description: 'Mature content for adults' },
    { value: 'professionals', label: 'Professionals', description: 'Industry-specific expertise' },
    { value: 'students', label: 'Students', description: 'Academic and learning focused' },
    { value: 'seniors', label: 'Seniors (65+)', description: 'Content for older adults' }
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short (5,000-10,000 words)', description: '20-40 pages, quick read' },
    { value: 'medium', label: 'Medium (10,000-25,000 words)', description: '40-100 pages, standard length' },
    { value: 'long', label: 'Long (25,000-50,000 words)', description: '100-200 pages, comprehensive' },
    { value: 'novel', label: 'Novel (50,000+ words)', description: '200+ pages, full-length book' },
    { value: 'custom', label: 'Custom Length', description: 'Specify exact word count' }
  ];

  const writingStyleOptions = [
    { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable tone' },
    { value: 'formal', label: 'Formal', description: 'Professional and structured writing' },
    { value: 'academic', label: 'Academic', description: 'Scholarly and research-based' },
    { value: 'creative', label: 'Creative', description: 'Imaginative and artistic expression' },
    { value: 'technical', label: 'Technical', description: 'Precise and detailed explanations' },
    { value: 'persuasive', label: 'Persuasive', description: 'Compelling and convincing tone' }
  ];

  const complexityOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Simple language and concepts' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity and depth' },
    { value: 'advanced', label: 'Advanced', description: 'Complex ideas and terminology' },
    { value: 'expert', label: 'Expert', description: 'Highly specialized content' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    onFormChange(updatedData);
    
    // Basic validation
    const newErrors = { ...errors };
    if (field === 'title' && (!value || value?.trim()?.length < 3)) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (field === 'title') {
      delete newErrors?.title;
    }
    
    if (field === 'topic' && (!value || value?.trim()?.length < 10)) {
      newErrors.topic = 'Topic description must be at least 10 characters long';
    } else if (field === 'topic') {
      delete newErrors?.topic;
    }
    
    if (field === 'customWordCount' && value && (value < 1000 || value > 200000)) {
      newErrors.customWordCount = 'Word count must be between 1,000 and 200,000';
    } else if (field === 'customWordCount') {
      delete newErrors?.customWordCount;
    }
    
    onValidationChange(newErrors);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const SectionHeader = ({ title, section, icon, description }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-gentle border border-border"
    >
      <div className="flex items-center space-x-3">
        <Icon name={icon} size={20} color="var(--color-primary)" />
        <div className="text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Icon 
        name={expandedSections?.[section] ? "ChevronUp" : "ChevronDown"} 
        size={16} 
        className="text-muted-foreground" 
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <SectionHeader
          title="Basic Information"
          section="basic"
          icon="FileText"
          description="Essential details about your ebook"
        />
        
        {expandedSections?.basic && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <Input
              label="Ebook Title"
              type="text"
              placeholder="Enter your ebook title"
              value={formData?.title || ''}
              onChange={(e) => handleInputChange('title', e?.target?.value)}
              error={errors?.title}
              required
              description="A compelling title that captures your ebook's essence"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Topic Description *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe what your ebook should cover. Be specific about the main topics, key points, and any particular aspects you want to emphasize..."
                value={formData?.topic || ''}
                onChange={(e) => handleInputChange('topic', e?.target?.value)}
                required
              />
              {errors?.topic && (
                <p className="text-sm text-error">{errors?.topic}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Provide detailed information to help AI generate relevant content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Genre"
                options={genreOptions}
                value={formData?.genre || ''}
                onChange={(value) => handleInputChange('genre', value)}
                placeholder="Select genre"
                searchable
                required
              />

              <Select
                label="Target Audience"
                options={audienceOptions}
                value={formData?.audience || ''}
                onChange={(value) => handleInputChange('audience', value)}
                placeholder="Select audience"
                searchable
                required
              />
            </div>
          </div>
        )}
      </div>
      {/* Structure & Length */}
      <div className="space-y-4">
        <SectionHeader
          title="Structure & Length"
          section="structure"
          icon="Layout"
          description="Define the size and organization of your ebook"
        />
        
        {expandedSections?.structure && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <Select
              label="Ebook Length"
              options={lengthOptions}
              value={formData?.length || ''}
              onChange={(value) => handleInputChange('length', value)}
              placeholder="Select length"
              required
            />

            {formData?.length === 'custom' && (
              <Input
                label="Custom Word Count"
                type="number"
                placeholder="Enter word count (1,000 - 200,000)"
                value={formData?.customWordCount || ''}
                onChange={(e) => handleInputChange('customWordCount', parseInt(e?.target?.value))}
                error={errors?.customWordCount}
                min={1000}
                max={200000}
                required
              />
            )}

            <Input
              label="Number of Chapters"
              type="number"
              placeholder="Enter number of chapters (1-50)"
              value={formData?.chapters || ''}
              onChange={(e) => handleInputChange('chapters', parseInt(e?.target?.value))}
              min={1}
              max={50}
              description="Leave empty for AI to determine optimal chapter structure"
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Chapter Structure Preferences
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Include table of contents"
                  checked={formData?.includeTableOfContents || false}
                  onChange={(e) => handleInputChange('includeTableOfContents', e?.target?.checked)}
                />
                <Checkbox
                  label="Add chapter summaries"
                  checked={formData?.includeChapterSummaries || false}
                  onChange={(e) => handleInputChange('includeChapterSummaries', e?.target?.checked)}
                />
                <Checkbox
                  label="Include introduction and conclusion"
                  checked={formData?.includeIntroConclusion || false}
                  onChange={(e) => handleInputChange('includeIntroConclusion', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Writing Style */}
      <div className="space-y-4">
        <SectionHeader
          title="Writing Style"
          section="style"
          icon="PenTool"
          description="Customize the tone and approach of your content"
        />
        
        {expandedSections?.style && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Writing Style"
                options={writingStyleOptions}
                value={formData?.writingStyle || ''}
                onChange={(value) => handleInputChange('writingStyle', value)}
                placeholder="Select style"
                required
              />

              <Select
                label="Content Complexity"
                options={complexityOptions}
                value={formData?.complexity || ''}
                onChange={(value) => handleInputChange('complexity', value)}
                placeholder="Select complexity"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Content Features
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Checkbox
                  label="Include examples and case studies"
                  checked={formData?.includeExamples || false}
                  onChange={(e) => handleInputChange('includeExamples', e?.target?.checked)}
                />
                <Checkbox
                  label="Add actionable tips and advice"
                  checked={formData?.includeActionableTips || false}
                  onChange={(e) => handleInputChange('includeActionableTips', e?.target?.checked)}
                />
                <Checkbox
                  label="Include quotes and references"
                  checked={formData?.includeQuotes || false}
                  onChange={(e) => handleInputChange('includeQuotes', e?.target?.checked)}
                />
                <Checkbox
                  label="Add exercises or worksheets"
                  checked={formData?.includeExercises || false}
                  onChange={(e) => handleInputChange('includeExercises', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Advanced Options */}
      <div className="space-y-4">
        <SectionHeader
          title="Advanced Options"
          section="advanced"
          icon="Settings"
          description="Fine-tune generation parameters and output preferences"
        />
        
        {expandedSections?.advanced && (
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <Input
              label="Author Name"
              type="text"
              placeholder="Enter author name (optional)"
              value={formData?.authorName || ''}
              onChange={(e) => handleInputChange('authorName', e?.target?.value)}
              description="Will be included in the ebook metadata"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Additional Instructions
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Any specific requirements, topics to avoid, or special instructions for the AI..."
                value={formData?.additionalInstructions || ''}
                onChange={(e) => handleInputChange('additionalInstructions', e?.target?.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Provide specific guidance for content generation
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Output Preferences
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Generate bibliography and sources"
                  checked={formData?.includeBibliography || false}
                  onChange={(e) => handleInputChange('includeBibliography', e?.target?.checked)}
                />
                <Checkbox
                  label="Add glossary of terms"
                  checked={formData?.includeGlossary || false}
                  onChange={(e) => handleInputChange('includeGlossary', e?.target?.checked)}
                />
                <Checkbox
                  label="Include index"
                  checked={formData?.includeIndex || false}
                  onChange={(e) => handleInputChange('includeIndex', e?.target?.checked)}
                />
                <Checkbox
                  label="Add appendices"
                  checked={formData?.includeAppendices || false}
                  onChange={(e) => handleInputChange('includeAppendices', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookSpecificationForm;