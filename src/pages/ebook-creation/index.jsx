import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WorkflowNavigation from '../../components/ui/WorkflowNavigation';
import EbookSpecificationForm from './components/EbookSpecificationForm';
import GenerationEstimator from './components/GenerationEstimator';
import GenerationControls from './components/GenerationControls';
import Icon from '../../components/AppIcon';

const EbookCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    genre: '',
    audience: '',
    length: '',
    customWordCount: '',
    chapters: '',
    writingStyle: '',
    complexity: '',
    authorName: '',
    additionalInstructions: '',
    includeTableOfContents: true,
    includeChapterSummaries: false,
    includeIntroConclusion: true,
    includeExamples: false,
    includeActionableTips: false,
    includeQuotes: false,
    includeExercises: false,
    includeBibliography: false,
    includeGlossary: false,
    includeIndex: false,
    includeAppendices: false
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('ebookCreationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    // Check if returning from generation progress with data
    if (location?.state?.ebookData) {
      setFormData(prev => ({ ...prev, ...location?.state?.ebookData }));
    }
  }, [location?.state]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('ebookCreationData', JSON.stringify(formData));
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleFormChange = (updatedData) => {
    setFormData(updatedData);
  };

  const handleValidationChange = (newErrors) => {
    setErrors(newErrors);
  };

  const validateForm = () => {
    const requiredFields = [
      'title', 'topic', 'genre', 'audience', 'length', 'writingStyle', 'complexity'
    ];

    const newErrors = {};
    
    requiredFields?.forEach(field => {
      if (!formData?.[field] || formData?.[field] === '') {
        newErrors[field] = `${field?.charAt(0)?.toUpperCase() + field?.slice(1)} is required`;
      }
    });

    // Additional validation
    if (formData?.title && formData?.title?.trim()?.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (formData?.topic && formData?.topic?.trim()?.length < 10) {
      newErrors.topic = 'Topic description must be at least 10 characters long';
    }

    if (formData?.length === 'custom') {
      if (!formData?.customWordCount || formData?.customWordCount < 1000 || formData?.customWordCount > 200000) {
        newErrors.customWordCount = 'Custom word count must be between 1,000 and 200,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const isFormValid = () => {
    const requiredFields = [
      'title', 'topic', 'genre', 'audience', 'length', 'writingStyle', 'complexity'
    ];
    
    const hasRequiredFields = requiredFields?.every(field => 
      formData?.[field] && formData?.[field] !== ''
    );
    
    const hasNoErrors = Object.keys(errors)?.length === 0;
    
    const customLengthValid = formData?.length !== 'custom' || 
      (formData?.customWordCount && formData?.customWordCount >= 1000 && formData?.customWordCount <= 200000);

    return hasRequiredFields && hasNoErrors && customLengthValid;
  };

  const handleGenerate = async (ebookData) => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to generation progress with form data
      navigate('/generation-progress', {
        state: {
          ebookData: ebookData,
          timestamp: new Date()?.toISOString(),
          estimatedTime: calculateEstimatedTime(ebookData)
        }
      });
    } catch (error) {
      console.error('Error starting generation:', error);
      setIsGenerating(false);
    }
  };

  const calculateEstimatedTime = (data) => {
    let baseTime = 5; // Base 5 minutes
    
    switch (data?.length) {
      case 'short': baseTime = 3; break;
      case 'medium': baseTime = 7; break;
      case 'long': baseTime = 12; break;
      case 'novel': baseTime = 20; break;
      case 'custom':
        baseTime = Math.ceil((data?.customWordCount || 10000) / 2000);
        break;
    }

    // Add complexity factor
    const complexityMultipliers = {
      beginner: 0.8,
      intermediate: 1.0,
      advanced: 1.3,
      expert: 1.6
    };
    
    baseTime *= complexityMultipliers?.[data?.complexity] || 1.0;
    
    return Math.max(2, Math.ceil(baseTime)); // Minimum 2 minutes
  };

  const handleWorkflowNavigation = (step, stepIndex) => {
    if (stepIndex === 1) { // Generation Progress
      if (isFormValid()) {
        handleGenerate(formData);
      }
    } else if (stepIndex === 2) { // Content Preview
      navigate('/content-preview');
    } else if (stepIndex === 3) { // Download Manager
      navigate('/download-manager');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <WorkflowNavigation
          currentStep={0}
          canNavigateBack={false}
          canNavigateForward={isFormValid()}
          onForward={handleWorkflowNavigation}
          onBack={() => {}} // Add this required prop
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create Your Ebook</h1>
                <p className="text-muted-foreground">
                  Specify your requirements and let AI generate your complete ebook
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>Estimated completion: 5-15 minutes after generation starts</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
                <div className="flex items-center space-x-2 mb-6">
                  <Icon name="Settings" size={20} color="var(--color-primary)" />
                  <h2 className="text-lg font-semibold text-foreground">Ebook Specifications</h2>
                </div>

                <EbookSpecificationForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={errors}
                  onValidationChange={handleValidationChange}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Generation Estimator */}
              <GenerationEstimator
                formData={formData}
                isValid={isFormValid()}
              />

              {/* Generation Controls */}
              <GenerationControls
                formData={formData}
                isValid={isFormValid()}
                errors={errors}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-muted/20 border border-border rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Need Help Getting Started?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Writing Effective Topic Descriptions</h4>
                    <ul className="space-y-1">
                      <li>• Be specific about your main subject</li>
                      <li>• Include key points you want covered</li>
                      <li>• Mention your target outcome or goal</li>
                      <li>• Specify any particular angle or perspective</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Choosing the Right Settings</h4>
                    <ul className="space-y-1">
                      <li>• Match complexity to your audience level</li>
                      <li>• Consider your intended use case</li>
                      <li>• Select appropriate length for your topic</li>
                      <li>• Use advanced options for specialized needs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EbookCreation;