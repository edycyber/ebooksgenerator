import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WorkflowNavigation from '../../components/ui/WorkflowNavigation';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import GenerationStats from './components/GenerationStats';
import ActivityFeed from './components/ActivityFeed';
import ContentPreview from './components/ContentPreview';
import TechnicalDetails from './components/TechnicalDetails';
import GenerationControls from './components/GenerationControls';
import Icon from '../../components/AppIcon';

const GenerationProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Generation state
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('processing');
  const [estimatedTime, setEstimatedTime] = useState(420); // 7 minutes in seconds
  const [currentTask, setCurrentTask] = useState('Analyzing ebook requirements and structure...');

  // Mock data for demonstration
  const [generationStats, setGenerationStats] = useState({
    chaptersGenerated: 2,
    totalChapters: 8,
    wordsGenerated: 3250,
    targetWords: 15000,
    apiCalls: 12,
    estimatedApiCalls: 45,
    processingTime: 180
  });

  const [activities, setActivities] = useState([
    {
      type: 'info',
      status: 'success',
      title: 'Generation Started',
      description: 'AI ebook generation process initiated successfully',
      timestamp: new Date(Date.now() - 300000),
      details: 'Session ID: sess_abc123def456'
    },
    {
      type: 'outline',
      status: 'success',
      title: 'Outline Created',
      description: 'Generated comprehensive ebook structure with 8 chapters',
      timestamp: new Date(Date.now() - 240000),
      details: 'Chapters: Introduction, 7 main topics, Conclusion'
    },
    {
      type: 'chapter',
      status: 'success',
      title: 'Chapter 1 Completed',
      description: 'Introduction chapter generated (1,200 words)',
      timestamp: new Date(Date.now() - 180000),
      details: 'Word count: 1,200 | Processing time: 45s'
    },
    {
      type: 'chapter',
      status: 'success',
      title: 'Chapter 2 Completed',
      description: 'Getting Started chapter generated (2,050 words)',
      timestamp: new Date(Date.now() - 120000),
      details: 'Word count: 2,050 | Processing time: 52s'
    },
    {
      type: 'api',
      status: 'processing',
      title: 'Processing Chapter 3',
      description: 'Generating content for Advanced Techniques chapter',
      timestamp: new Date(Date.now() - 30000),
      details: 'API calls: 3/5 | Estimated completion: 2 minutes'
    }
  ]);

  const [generatedContent, setGeneratedContent] = useState([
    {
      title: 'Introduction to AI-Powered Content Creation',
      subtitle: 'Understanding the fundamentals of artificial intelligence in writing',
      content: `Welcome to the fascinating world of AI-powered content creation. In this comprehensive guide, we'll explore how artificial intelligence is revolutionizing the way we approach writing, content generation, and creative expression.\n\nArtificial Intelligence has emerged as one of the most transformative technologies of our time, and its applications in content creation are both exciting and practical. From generating blog posts and articles to creating entire books, AI tools are empowering writers, marketers, and content creators to produce high-quality content more efficiently than ever before.\n\nThis ebook will take you on a journey through the various aspects of AI content creation, providing you with practical insights, real-world examples, and actionable strategies that you can implement immediately. Whether you're a seasoned writer looking to enhance your productivity or a newcomer to the field of content creation, this guide will provide you with the knowledge and tools you need to succeed.\n\nThroughout this book, we'll cover essential topics including understanding AI writing models, choosing the right tools for your needs, crafting effective prompts, maintaining quality and authenticity, and integrating AI into your existing workflow. By the end of this guide, you'll have a comprehensive understanding of how to leverage AI technology to create compelling, engaging, and valuable content.`,
      wordCount: 1200,
      status: 'completed',
      generatedAt: new Date(Date.now() - 180000)
    },
    {
      title: 'Getting Started with AI Writing Tools',
      subtitle: 'A practical guide to choosing and using AI writing platforms',
      content: `Now that we've established the foundation of AI-powered content creation, let's dive into the practical aspects of getting started with AI writing tools. The landscape of AI writing platforms is vast and constantly evolving, with new tools and features being introduced regularly.\n\nChoosing the right AI writing tool depends on several factors including your specific needs, budget, technical expertise, and the type of content you plan to create. Some tools excel at long-form content like articles and ebooks, while others are optimized for short-form content such as social media posts and marketing copy.\n\nPopular AI writing platforms include GPT-based tools, specialized content generators, and integrated writing assistants. Each platform has its unique strengths and capabilities. For instance, some tools offer advanced customization options and fine-tuning capabilities, while others focus on simplicity and ease of use.\n\nWhen evaluating AI writing tools, consider factors such as output quality, customization options, integration capabilities, pricing structure, and customer support. It's also important to understand the limitations of each tool and how they align with your content creation goals.\n\nTo get the most out of any AI writing tool, it's essential to understand how to craft effective prompts. The quality of your input directly influences the quality of the output. Clear, specific, and well-structured prompts will yield better results than vague or ambiguous instructions.`,
      wordCount: 2050,
      status: 'completed',
      generatedAt: new Date(Date.now() - 120000)
    }
  ]);

  const [technicalData, setTechnicalData] = useState({
    model: 'GPT-4 Turbo',
    temperature: 0.7,
    maxTokens: 4000,
    tokensUsed: 8750,
    avgResponseTime: 2300,
    dataTransferred: 1024000,
    successRate: '98.5%',
    sessionId: 'sess_abc123def456',
    startedAt: Date.now() - 300000,
    estimatedCompletion: 'In 5-8 minutes',
    errors: []
  });

  const [apiStatus, setApiStatus] = useState({
    status: 'processing',
    message: 'Connected to OpenRouter API - Processing requests',
    responseTime: 2300
  });

  // Simulate generation progress
  useEffect(() => {
    if (!isGenerating || isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 3, 100);
        
        // Update current step based on progress
        if (newProgress >= 25 && currentStep === 1) {
          setCurrentStep(2);
          setCurrentTask('Generating chapter content using AI models...');
        } else if (newProgress >= 60 && currentStep === 2) {
          setCurrentStep(3);
          setCurrentTask('Formatting and structuring content...');
        } else if (newProgress >= 90 && currentStep === 3) {
          setCurrentStep(4);
          setCurrentTask('Finalizing ebook and preparing download...');
        }

        // Complete generation
        if (newProgress >= 100) {
          setIsGenerating(false);
          setGenerationStatus('completed');
          setCurrentTask('Generation completed successfully!');
          clearInterval(interval);
        }

        return newProgress;
      });

      // Update stats
      setGenerationStats(prev => ({
        ...prev,
        processingTime: prev?.processingTime + 1,
        wordsGenerated: Math.min(prev?.wordsGenerated + Math.floor(Math.random() * 50), prev?.targetWords),
        apiCalls: Math.min(prev?.apiCalls + (Math.random() > 0.8 ? 1 : 0), prev?.estimatedApiCalls)
      }));

      // Update estimated time
      setEstimatedTime(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating, isPaused, currentStep]);

  // Add new activities periodically
  useEffect(() => {
    if (!isGenerating || isPaused) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity = {
          type: 'api',
          status: 'success',
          title: `API Request Completed`,
          description: `Successfully processed content generation request`,
          timestamp: new Date(),
          details: `Response time: ${Math.floor(Math.random() * 1000 + 1500)}ms`
        };

        setActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isGenerating, isPaused]);

  const handleCancel = () => {
    setIsGenerating(false);
    setGenerationStatus('cancelled');
    setCurrentTask('Generation cancelled by user');
    navigate('/ebook-creation');
  };

  const handlePause = () => {
    setIsPaused(true);
    setCurrentTask('Generation paused - Resume anytime');
  };

  const handleResume = () => {
    setIsPaused(false);
    setCurrentTask('Resuming content generation...');
  };

  const handleRetry = () => {
    setIsGenerating(true);
    setIsPaused(false);
    setProgress(0);
    setCurrentStep(0);
    setGenerationStatus('processing');
    setCurrentTask('Restarting ebook generation...');
  };

  const handleViewPreview = () => {
    navigate('/content-preview');
  };

  const handleWorkflowNavigation = (step, stepIndex) => {
    if (stepIndex === 0) {
      navigate('/ebook-creation');
    } else if (stepIndex === 2) {
      navigate('/content-preview');
    } else if (stepIndex === 3) {
      navigate('/download-manager');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <WorkflowNavigation
          currentStep={1}
          canNavigateBack={true}
          canNavigateForward={generationStatus === 'completed'}
          onBack={handleWorkflowNavigation}
          onForward={handleWorkflowNavigation}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="Zap" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Generation Progress</h1>
                <p className="text-muted-foreground">
                  AI is creating your ebook - Track progress and monitor generation
                </p>
              </div>
            </div>
          </div>

          {/* Main Progress Section */}
          <div className="mb-8">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={4}
              status={generationStatus}
              onCancel={handleCancel}
              progress={progress}
              estimatedTime={estimatedTime}
              currentTask={currentTask}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Stats and Controls */}
            <div className="space-y-6">
              <GenerationStats 
                stats={generationStats}
                isGenerating={isGenerating && !isPaused}
              />
              <GenerationControls
                isGenerating={isGenerating}
                onCancel={handleCancel}
                onPause={handlePause}
                onResume={handleResume}
                isPaused={isPaused}
                canRetry={generationStatus === 'error'}
                onRetry={handleRetry}
                onViewPreview={handleViewPreview}
                hasContent={generatedContent?.length > 0}
              />
            </div>

            {/* Middle Column - Activity Feed */}
            <div>
              <ActivityFeed 
                activities={activities}
                isGenerating={isGenerating && !isPaused}
              />
            </div>

            {/* Right Column - Technical Details */}
            <div>
              <TechnicalDetails
                technicalData={technicalData}
                apiStatus={apiStatus}
              />
            </div>
          </div>

          {/* Content Preview Section */}
          <div className="mb-8">
            <ContentPreview
              generatedContent={generatedContent}
              isGenerating={isGenerating && !isPaused}
            />
          </div>

          {/* Status Messages */}
          {generationStatus === 'completed' && (
            <div className="bg-success/5 border border-success/20 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={24} color="var(--color-success)" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-success mb-2">
                    Generation Complete!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your ebook has been successfully generated with {generatedContent?.length} chapters 
                    and {generationStats?.wordsGenerated?.toLocaleString()} words. You can now preview 
                    the content and download your ebook in various formats.
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/content-preview')}
                      className="flex items-center space-x-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-gentle"
                    >
                      <Icon name="Eye" size={16} />
                      <span>Preview Content</span>
                    </button>
                    <button
                      onClick={() => navigate('/download-manager')}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-gentle"
                    >
                      <Icon name="Download" size={16} />
                      <span>Download Ebook</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {generationStatus === 'error' && (
            <div className="bg-error/5 border border-error/20 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={24} color="var(--color-error)" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-error mb-2">
                    Generation Failed
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    An error occurred during the ebook generation process. This could be due to 
                    API limitations, network issues, or content policy restrictions. Your progress 
                    has been saved and you can retry the generation.
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleRetry}
                      className="flex items-center space-x-2 px-4 py-2 bg-error text-error-foreground rounded-lg hover:bg-error/90 transition-gentle"
                    >
                      <Icon name="RotateCcw" size={16} />
                      <span>Retry Generation</span>
                    </button>
                    <button
                      onClick={() => navigate('/ebook-creation')}
                      className="flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-gentle"
                    >
                      <Icon name="ArrowLeft" size={16} />
                      <span>Back to Setup</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GenerationProgress;