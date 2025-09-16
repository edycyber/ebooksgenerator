import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WorkflowNavigation from '../../components/ui/WorkflowNavigation';
import ContentEditor from './components/ContentEditor';
import ChapterNavigation from './components/ChapterNavigation';
import PreviewToolbar from './components/PreviewToolbar';
import MetadataPanel from './components/MetadataPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ContentPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock generated ebook content
  const [ebookContent, setEbookContent] = useState({
    title: "The Complete Guide to AI Innovation",
    chapters: [
      {
        title: "Introduction to Artificial Intelligence",
        content: `<h2>Welcome to the Future of AI</h2>
        <p>Artificial Intelligence represents one of the most transformative technologies of our time. From machine learning algorithms that power recommendation systems to neural networks that enable autonomous vehicles, AI is reshaping every aspect of our digital landscape.</p>
        
        <p>This comprehensive guide will take you through the fundamental concepts, practical applications, and future implications of AI technology. Whether you're a business leader looking to implement AI solutions, a developer seeking to understand the technical foundations, or simply curious about how AI will impact society, this book provides the insights you need.</p>
        
        <h3>What You'll Learn</h3>
        <ul>
          <li>Core AI concepts and terminology</li>
          <li>Machine learning fundamentals</li>
          <li>Real-world AI applications across industries</li>
          <li>Ethical considerations and responsible AI development</li>
          <li>Future trends and emerging technologies</li>
        </ul>
        
        <p>The journey into AI begins with understanding its foundations. Let's explore how artificial intelligence evolved from theoretical concepts to practical solutions that power today's most innovative companies.</p>`
      },
      {
        title: "Machine Learning Fundamentals",
        content: `<h2>Understanding Machine Learning</h2>
        <p>Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It's the driving force behind many AI applications we use daily.</p>
        
        <h3>Types of Machine Learning</h3>
        <p><strong>Supervised Learning:</strong> Algorithms learn from labeled training data to make predictions on new, unseen data. Common examples include email spam detection and image recognition.</p>
        
        <p><strong>Unsupervised Learning:</strong> Algorithms find hidden patterns in data without labeled examples. This includes clustering customers for marketing segmentation and anomaly detection in cybersecurity.</p>
        
        <p><strong>Reinforcement Learning:</strong> Algorithms learn through interaction with an environment, receiving rewards or penalties for actions. This approach powers game-playing AI and autonomous vehicle navigation systems.</p>
        
        <h3>Key Algorithms</h3>
        <p>Popular machine learning algorithms include linear regression for prediction, decision trees for classification, and neural networks for complex pattern recognition. Each algorithm has strengths suited to different types of problems and data characteristics.</p>`
      },
      {
        title: "AI in Business Applications",
        content: `<h2>Transforming Business with AI</h2>
        <p>Artificial Intelligence is revolutionizing how businesses operate, make decisions, and serve customers. From startups to Fortune 500 companies, organizations are leveraging AI to gain competitive advantages and drive innovation.</p>
        
        <h3>Customer Service Automation</h3>
        <p>AI-powered chatbots and virtual assistants handle routine customer inquiries 24/7, reducing response times and operational costs while improving customer satisfaction. Advanced natural language processing enables these systems to understand context and provide personalized responses.</p>
        
        <h3>Predictive Analytics</h3>
        <p>Machine learning models analyze historical data to forecast future trends, helping businesses optimize inventory management, predict customer churn, and identify market opportunities. Retail giants use these insights to personalize product recommendations and optimize pricing strategies.</p>
        
        <h3>Process Automation</h3>
        <p>Robotic Process Automation (RPA) combined with AI capabilities automates repetitive tasks across various departments, from finance and HR to supply chain management. This automation frees employees to focus on higher-value strategic activities.</p>
        
        <h3>Decision Support Systems</h3>
        <p>AI systems process vast amounts of data to provide actionable insights for executive decision-making, risk assessment, and strategic planning. Financial institutions use AI for fraud detection and credit scoring, while healthcare organizations leverage AI for diagnostic assistance.</p>`
      },
      {
        title: "Future of AI Technology",
        content: `<h2>The Road Ahead</h2>
        <p>The future of artificial intelligence holds unprecedented possibilities and challenges. As we stand at the threshold of more advanced AI systems, understanding emerging trends and their implications becomes crucial for individuals and organizations alike.</p>
        
        <h3>Emerging Technologies</h3>
        <p><strong>Generative AI:</strong> Large language models and generative systems are creating new possibilities for content creation, code generation, and creative applications. These technologies are democratizing access to AI capabilities across various industries.</p>
        
        <p><strong>Edge AI:</strong> Moving AI processing closer to data sources reduces latency and improves privacy. Edge computing enables real-time AI applications in IoT devices, autonomous vehicles, and smart city infrastructure.</p>
        
        <p><strong>Quantum AI:</strong> The intersection of quantum computing and artificial intelligence promises exponential improvements in processing power for complex optimization problems and machine learning tasks.</p>
        
        <h3>Societal Impact</h3>
        <p>AI's influence extends beyond technology into education, healthcare, transportation, and governance. Preparing for these changes requires thoughtful consideration of ethical implications, workforce adaptation, and regulatory frameworks.</p>
        
        <h3>Conclusion</h3>
        <p>The AI revolution is not a distant future—it's happening now. By understanding these technologies and their applications, we can better navigate the opportunities and challenges that lie ahead. The key to success lies in continuous learning, ethical implementation, and collaborative innovation.</p>`
      }
    ]
  });

  const [selectedChapter, setSelectedChapter] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('document');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(new Date());
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing) {
      setAutoSaveStatus('pending');
      const saveTimer = setTimeout(() => {
        setAutoSaveStatus('saving');
        setTimeout(() => {
          setAutoSaveStatus('saved');
          setLastSaved(new Date());
        }, 1000);
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [ebookContent, isEditing]);

  const handleContentChange = (updatedContent) => {
    setEbookContent(updatedContent);
  };

  const handleChapterSelect = (chapterIndex) => {
    setSelectedChapter(chapterIndex);
    setShowMobileNav(false);
  };

  const handleAddChapter = () => {
    const newChapter = {
      title: `New Chapter ${ebookContent?.chapters?.length + 1}`,
      content: '<p>Start writing your new chapter content here...</p>'
    };
    
    const updatedContent = {
      ...ebookContent,
      chapters: [...ebookContent?.chapters, newChapter]
    };
    
    setEbookContent(updatedContent);
    setSelectedChapter(updatedContent?.chapters?.length - 1);
  };

  const handleDeleteChapter = (chapterIndex) => {
    if (ebookContent?.chapters?.length <= 1) return;
    
    const updatedContent = {
      ...ebookContent,
      chapters: ebookContent?.chapters?.filter((_, index) => index !== chapterIndex)
    };
    
    setEbookContent(updatedContent);
    
    if (selectedChapter >= updatedContent?.chapters?.length) {
      setSelectedChapter(updatedContent?.chapters?.length - 1);
    } else if (selectedChapter > chapterIndex) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleReorderChapter = (fromIndex, toIndex) => {
    const updatedChapters = [...ebookContent?.chapters];
    const [movedChapter] = updatedChapters?.splice(fromIndex, 1);
    updatedChapters?.splice(toIndex, 0, movedChapter);
    
    const updatedContent = {
      ...ebookContent,
      chapters: updatedChapters
    };
    
    setEbookContent(updatedContent);
    
    if (selectedChapter === fromIndex) {
      setSelectedChapter(toIndex);
    } else if (selectedChapter === toIndex) {
      setSelectedChapter(fromIndex);
    }
  };

  const handleDownload = (format, fileName) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDownloading(false);
          setDownloadProgress(null);
          
          // Simulate file download
          const blob = new Blob([JSON.stringify(ebookContent, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.${format}`;
          document.body?.appendChild(a);
          a?.click();
          document.body?.removeChild(a);
          URL.revokeObjectURL(url);
          
          return null;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (type) => {
    switch (type) {
      case 'link':
        navigator.clipboard?.writeText(window.location?.href);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(ebookContent?.title)}&body=${encodeURIComponent('Check out this ebook: ' + window.location?.href)}`;
        break;
      case 'export':
        handleDownload('pdf', ebookContent?.title?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase() || 'ebook');
        break;
    }
  };

  const handleRegenerate = () => {
    navigate('/generation-progress', { 
      state: { 
        regenerate: true, 
        chapterIndex: selectedChapter 
      } 
    });
  };

  const handleWorkflowNavigation = (step, stepIndex) => {
    const routes = ['/ebook-creation', '/generation-progress', '/content-preview', '/download-manager'];
    navigate(routes?.[stepIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <WorkflowNavigation
          currentStep={2}
          onBack={handleWorkflowNavigation}
          onForward={handleWorkflowNavigation}
        />

        <PreviewToolbar
          onDownload={() => handleDownload('docx', ebookContent?.title?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase() || 'ebook')}
          onPrint={handlePrint}
          onShare={handleShare}
          onRegenerate={handleRegenerate}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          autoSaveStatus={autoSaveStatus}
          lastSaved={lastSaved}
          onSave={() => {
            setAutoSaveStatus('saving');
            setTimeout(() => {
              setAutoSaveStatus('saved');
              setLastSaved(new Date());
            }, 1000);
          }}
        />

        <div className="flex h-[calc(100vh-200px)]">
          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-prominent flex items-center justify-center"
          >
            <Icon name={showMobileNav ? "X" : "Menu"} size={20} />
          </button>

          {/* Chapter Navigation - Desktop Sidebar */}
          <div className="hidden lg:block w-80 border-r border-border">
            <ChapterNavigation
              chapters={ebookContent?.chapters}
              selectedChapter={selectedChapter}
              onChapterSelect={handleChapterSelect}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onReorderChapter={handleReorderChapter}
              isEditing={isEditing}
            />
          </div>

          {/* Mobile Chapter Navigation */}
          {showMobileNav && (
            <div className="lg:hidden fixed inset-0 z-40 bg-background">
              <div className="pt-16">
                <ChapterNavigation
                  chapters={ebookContent?.chapters}
                  selectedChapter={selectedChapter}
                  onChapterSelect={handleChapterSelect}
                  onAddChapter={handleAddChapter}
                  onDeleteChapter={handleDeleteChapter}
                  onReorderChapter={handleReorderChapter}
                  isEditing={isEditing}
                />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex">
            {/* Content Editor */}
            <div className="flex-1">
              <ContentEditor
                content={ebookContent}
                onContentChange={handleContentChange}
                selectedChapter={selectedChapter}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
              />
            </div>

            {/* Metadata Panel - Desktop Only */}
            <div className="hidden xl:block w-80 border-l border-border">
              <MetadataPanel
                metadata={{
                  title: ebookContent?.title,
                  author: "Dr. Sarah Chen",
                  description: "A comprehensive exploration of artificial intelligence technologies and their transformative impact on modern business and society.",
                  genre: "Technology",
                  language: "English",
                  pages: 156,
                  wordCount: ebookContent?.chapters?.reduce((total, chapter) => {
                    const text = chapter?.content?.replace(/<[^>]*>/g, '');
                    return total + text?.split(/\s+/)?.filter(word => word?.length > 0)?.length;
                  }, 0),
                  createdAt: "2025-01-16T15:06:24.977Z",
                  lastModified: lastSaved?.toISOString(),
                  version: "1.0",
                  tags: ["AI", "Technology", "Innovation", "Business"]
                }}
                onMetadataChange={(metadata) => {
                  setEbookContent(prev => ({ ...prev, title: metadata?.title }));
                }}
                onDownload={handleDownload}
                downloadProgress={downloadProgress}
                isDownloading={isDownloading}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>

        {/* Mobile Metadata Panel - Bottom Sheet */}
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-prominent">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {ebookContent?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {ebookContent?.chapters?.length} chapters • Ready for download
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              onClick={() => handleDownload('docx', ebookContent?.title?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase() || 'ebook')}
              loading={isDownloading}
            >
              {isDownloading ? `${Math.round(downloadProgress || 0)}%` : 'Download'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;