import React, { useState } from 'react';
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';

export interface FileData {
  name: string;
  content: string;
  size: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'results'>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (file: FileData, customPrompt: string) => {
    setFileData(file);
    setPrompt(customPrompt);
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI response based on prompt
    const mockSummary = generateMockSummary(file.content, customPrompt);
    setSummary(mockSummary);
    setIsGenerating(false);
    setCurrentPage('results');
  };

  const generateMockSummary = (content: string, customPrompt: string): string => {
    const wordCount = content.split(' ').length;
    const isExecutiveSummary = customPrompt.toLowerCase().includes('executive');
    const isActionItems = customPrompt.toLowerCase().includes('action');
    
    if (isActionItems) {
      return `# Action Items Summary

Based on the uploaded transcript (${wordCount} words), here are the key action items:

## Immediate Actions Required
• **Project Timeline Review** - Team lead to update project milestones by Friday
• **Budget Allocation** - Finance team to review and approve additional funding request
• **Client Communication** - Schedule follow-up meeting with stakeholders next week

## Medium-term Goals
• Implement new workflow processes discussed in the meeting
• Conduct market research for Q2 planning
• Update team training materials based on recent feedback

## Follow-up Items
• Document decisions made and distribute to all attendees
• Set up recurring check-ins for project status updates
• Review and update risk management protocols

**Next Meeting:** Scheduled for next Tuesday at 2 PM EST`;
    }
    
    if (isExecutiveSummary) {
      return `# Executive Summary

## Key Highlights
This ${wordCount}-word transcript contains strategic discussions and important business decisions that require executive attention.

## Main Topics Covered
• **Strategic Planning** - Long-term vision and quarterly objectives discussed
• **Financial Performance** - Revenue targets and budget allocations reviewed
• **Team Updates** - Personnel changes and resource requirements outlined
• **Market Opportunities** - New business prospects and competitive positioning

## Critical Decisions Made
1. Approved expansion into new market segments
2. Increased investment in technology infrastructure
3. Restructured reporting hierarchy for better efficiency

## Recommendations
• Immediate action required on budget approvals
• Consider additional staffing for upcoming projects
• Schedule follow-up meetings with department heads

**Impact Level:** High - Requires immediate executive review and approval`;
    }
    
    return `# Transcript Summary

## Overview
This document summarizes a ${wordCount}-word transcript based on your custom instructions: "${customPrompt}"

## Key Points Discussed
• **Main Topics:** Strategic planning, team coordination, and project updates
• **Participants:** Multiple stakeholders across different departments
• **Duration:** Approximately 45-60 minutes of discussion
• **Outcome:** Clear action items and next steps established

## Important Highlights
The conversation covered several critical business areas including operational efficiency, team collaboration, and strategic initiatives. Key decisions were made regarding resource allocation and timeline adjustments.

## Next Steps
1. Distribute summary to all participants
2. Schedule follow-up meetings as needed
3. Track progress on assigned action items
4. Review and update project timelines

## Additional Notes
All participants agreed on the proposed changes and committed to the established deadlines. Regular check-ins will be scheduled to monitor progress and address any emerging issues.`;
  };

  const handleBackToUpload = () => {
    setCurrentPage('upload');
    setFileData(null);
    setPrompt('');
    setSummary('');
  };

  if (currentPage === 'results') {
    return (
      <ResultsPage
        summary={summary}
        setSummary={setSummary}
        fileName={fileData?.name || ''}
        prompt={prompt}
        onBackToUpload={handleBackToUpload}
        isGenerating={isGenerating}
      />
    );
  }

  return <UploadPage onGenerate={handleGenerate} />;
}

export default App;