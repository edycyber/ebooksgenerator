import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const GenerationEstimator = ({ formData, isValid }) => {
  const [estimates, setEstimates] = useState({
    wordCount: 0,
    pages: 0,
    chapters: 0,
    estimatedTime: 0,
    apiCost: 0,
    complexity: 'medium'
  });

  useEffect(() => {
    calculateEstimates();
  }, [formData]);

  const calculateEstimates = () => {
    let wordCount = 0;
    let estimatedTime = 0;
    let apiCost = 0;

    // Calculate word count based on length selection
    switch (formData?.length) {
      case 'short':
        wordCount = 7500; // Average of 5,000-10,000
        break;
      case 'medium':
        wordCount = 17500; // Average of 10,000-25,000
        break;
      case 'long':
        wordCount = 37500; // Average of 25,000-50,000
        break;
      case 'novel':
        wordCount = 75000; // 50,000+ words
        break;
      case 'custom':
        wordCount = formData?.customWordCount || 10000;
        break;
      default:
        wordCount = 10000;
    }

    // Calculate pages (assuming ~250 words per page)
    const pages = Math.ceil(wordCount / 250);

    // Calculate chapters
    let chapters = formData?.chapters || Math.max(1, Math.ceil(wordCount / 2500));

    // Calculate estimated generation time (in minutes)
    // Base time + complexity factors
    let baseTime = Math.ceil(wordCount / 1000) * 2; // 2 minutes per 1000 words
    
    // Adjust for complexity
    const complexityMultipliers = {
      beginner: 0.8,
      intermediate: 1.0,
      advanced: 1.3,
      expert: 1.6
    };
    
    const complexityMultiplier = complexityMultipliers?.[formData?.complexity] || 1.0;
    estimatedTime = Math.ceil(baseTime * complexityMultiplier);

    // Add time for additional features
    if (formData?.includeExamples) estimatedTime += Math.ceil(chapters * 0.5);
    if (formData?.includeQuotes) estimatedTime += Math.ceil(chapters * 0.3);
    if (formData?.includeBibliography) estimatedTime += 2;
    if (formData?.includeGlossary) estimatedTime += 3;

    // Calculate API cost estimate (mock calculation)
    const baseTokens = wordCount * 1.3; // Rough token estimation
    const costPerToken = 0.00002; // Mock cost per token
    apiCost = baseTokens * costPerToken;

    setEstimates({
      wordCount,
      pages,
      chapters,
      estimatedTime,
      apiCost,
      complexity: formData?.complexity || 'intermediate'
    });
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      beginner: 'text-success',
      intermediate: 'text-warning',
      advanced: 'text-error',
      expert: 'text-error'
    };
    return colors?.[complexity] || 'text-muted-foreground';
  };

  const getComplexityIcon = (complexity) => {
    const icons = {
      beginner: 'TrendingUp',
      intermediate: 'BarChart3',
      advanced: 'TrendingUp',
      expert: 'Zap'
    };
    return icons?.[complexity] || 'BarChart3';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Calculator" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Generation Estimates</h3>
      </div>
      {!isValid && (
        <div className="mb-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
            <p className="text-sm text-warning">
              Complete the required fields to see accurate estimates
            </p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="FileText" size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Words</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {estimates?.wordCount?.toLocaleString()}
            </p>
          </div>

          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="BookOpen" size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Pages</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {estimates?.pages}
            </p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="List" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Chapters</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {estimates?.chapters}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Est. Generation Time</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatTime(estimates?.estimatedTime)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getComplexityIcon(estimates?.complexity)} 
                size={16} 
                className="text-muted-foreground" 
              />
              <span className="text-sm text-foreground">Complexity Level</span>
            </div>
            <span className={`text-sm font-medium capitalize ${getComplexityColor(estimates?.complexity)}`}>
              {estimates?.complexity}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Est. API Cost</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              ${estimates?.apiCost?.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
            <div className="text-sm">
              <p className="text-primary font-medium mb-1">Estimation Notes</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Generation time may vary based on API response speed</li>
                <li>• Word count includes all content and formatting</li>
                <li>• Page count assumes standard formatting (~250 words/page)</li>
                <li>• API costs are estimates and may vary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quality Indicators */}
        {isValid && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Content Quality Indicators</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Topic Detail Level</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5]?.map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= (formData?.topic?.length > 100 ? 5 : formData?.topic?.length > 50 ? 3 : 1)
                          ? 'bg-success' :'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Specification Completeness</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5]?.map((level) => {
                    const completeness = Object.keys(formData)?.filter(key => 
                      formData?.[key] && formData?.[key] !== ''
                    )?.length;
                    return (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= Math.min(5, Math.ceil(completeness / 2))
                            ? 'bg-primary' :'bg-muted'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationEstimator;