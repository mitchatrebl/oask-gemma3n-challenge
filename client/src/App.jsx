/*
OASK CLIENT APPLICATION - MAIN COMPONENT
========================================

This is the core React component for OASK (Offline AI Survival Kit).
It provides a comprehensive web interface for interacting with the
Gemma 3n AI model through a modern, feature-rich chat application.

KEY FEATURES:
============
💬 Advanced Chat System:
   - Multiple conversation management
   - Conversation categorization and organization
   - Chat history persistence
   - Real-time message streaming
   - Conversation search and filtering

🎨 Multimodal Interface:
   - Text input with rich formatting
   - Image upload and processing
   - Drag-and-drop image support
   - Image preview and management
   - Mixed content conversations (text + images)

🤖 AI Personality System:
   - Multiple personality profiles
   - Custom personality creation
   - Context-aware responses
   - Personality switching mid-conversation
   - Persistent personality settings

🔧 Advanced Configuration:
   - Dark/light mode toggle
   - Adjustable text and button sizes
   - Performance monitoring display
   - System analysis integration
   - Accessibility features

📊 Performance Analytics:
   - Real-time performance metrics
   - System resource monitoring
   - Model configuration display
   - Debug information access
   - Analysis package integration

🎯 User Experience Features:
   - Responsive design for all screen sizes
   - Keyboard shortcuts and navigation
   - Auto-save functionality
   - Prompt history and suggestions
   - Copy/paste enhancements

ARCHITECTURE:
============
The component uses modern React patterns including:
- Functional components with hooks
- State management with useState
- Side effects with useEffect
- Ref management with useRef
- Event handling and lifecycle management

This creates a production-ready interface that rivals commercial
AI chat applications while running completely offline.
*/

import React, { useState, useEffect, useRef } from 'react';

function App() {
  // ==========================================================================
  // CORE CHAT STATE MANAGEMENT
  // ==========================================================================
  // Primary state for chat functionality
  
  const [text, setText] = useState('');                    // Current input text
  const [image, setImage] = useState(null);               // Selected image for multimodal input
  const [response, setResponse] = useState('');           // AI model response
  const [loading, setLoading] = useState(false);          // Request processing status
  
  // ==========================================================================
  // CONVERSATION MANAGEMENT STATE
  // ==========================================================================
  // State for managing multiple conversations and organization
  
  const [chats, setChats] = useState([]);                 // All chat conversations
  const [categories, setCategories] = useState([]);       // Chat organization categories
  const [currentChatId, setCurrentChatId] = useState(null);                // Active chat ID
  const [currentConversation, setCurrentConversation] = useState([]);      // Current chat messages
  
  // ==========================================================================
  // UI STATE MANAGEMENT
  // ==========================================================================
  // State for user interface controls and visibility
  
  const [showChatList, setShowChatList] = useState(false);         // Chat list sidebar visibility
  const [showSettings, setShowSettings] = useState(false);        // Settings panel visibility
  const [showImageBrowser, setShowImageBrowser] = useState(false); // Image browser visibility
  const [showPersonalities, setShowPersonalities] = useState(false); // Personality panel visibility
  const [showSearch, setShowSearch] = useState(false);            // Search interface visibility
  const [showAnalysis, setShowAnalysis] = useState(false);        // Performance analysis visibility
  
  // ==========================================================================
  // EDITING AND INTERACTION STATE
  // ==========================================================================
  // State for managing various editing modes and interactions
  
  const [renamingChatId, setRenamingChatId] = useState(null);      // Chat being renamed
  const [renameValue, setRenameValue] = useState('');             // Chat rename input value
  const [renamingCategoryId, setRenamingCategoryId] = useState(null);  // Category being renamed
  const [categoryRenameValue, setCategoryRenameValue] = useState('');  // Category rename value
  const [showAddCategory, setShowAddCategory] = useState(false);       // Add category dialog
  const [newCategoryName, setNewCategoryName] = useState('');          // New category name input
  const [movingChatId, setMovingChatId] = useState(null);              // Chat being moved
  const [movingNoteId, setMovingNoteId] = useState(null);              // Note being moved
  const [expandedCategories, setExpandedCategories] = useState(new Set()); // Expanded categories
  
  // ==========================================================================
  // THEME AND ACCESSIBILITY STATE
  // ==========================================================================
  // State for visual appearance and accessibility features
  
  const [darkMode, setDarkMode] = useState(true);           // Dark/light theme toggle
  const [buttonSize, setButtonSize] = useState('normal');   // Button size: normal/large/extra-large
  const [textSize, setTextSize] = useState('normal');       // Text size: normal/large/extra-large
  
  // ==========================================================================
  // SEARCH AND FILTERING STATE
  // ==========================================================================
  // State for search functionality and content filtering
  
  const [searchQuery, setSearchQuery] = useState('');             // Search input text
  const [filteredChats, setFilteredChats] = useState([]);         // Search results
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0); // Selected search result
  
  // ==========================================================================
  // REQUEST MANAGEMENT STATE
  // ==========================================================================
  // State for managing AI requests and responses
  
  const [abortController, setAbortController] = useState(null);    // Request cancellation control
  const [currentQuestion, setCurrentQuestion] = useState('');     // Question being processed
  const [promptHistory, setPromptHistory] = useState([]);         // Previous prompts for suggestions
  const [promptSuggestion, setPromptSuggestion] = useState('');   // Current prompt suggestion
  const [showSuggestion, setShowSuggestion] = useState(false);    // Suggestion visibility
  
  // ==========================================================================
  // PERFORMANCE AND ANALYTICS STATE
  // ==========================================================================
  // State for system monitoring and performance analysis
  
  const [performanceData, setPerformanceData] = useState(null);   // Performance metrics from server
  const [modelConfigData, setModelConfigData] = useState(null);  // Model configuration information
  
  // ==========================================================================
  // PERSONALITY SYSTEM STATE
  // ==========================================================================
  // State for AI personality management and configuration
  
  const [personalities, setPersonalities] = useState([]);               // Available personalities
  const [selectedPersonality, setSelectedPersonality] = useState('default'); // Active personality
  const [showAddPersonality, setShowAddPersonality] = useState(false);        // Add personality dialog
  const [editingPersonalityId, setEditingPersonalityId] = useState(null);     // Personality being edited
  const [personalityName, setPersonalityName] = useState('');                 // Personality name input
  const [personalityDetails, setPersonalityDetails] = useState('');           // Personality description
  const [showPersonalityDropdown, setShowPersonalityDropdown] = useState(false); // Personality selector
  
  // Character counter for personality descriptions (no limit)
  // Removed PERSONALITY_MAX_CHARS constant to allow unlimited length

  // Notes states
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [noteCategories, setNoteCategories] = useState([]);
  const [showAddNoteCategory, setShowAddNoteCategory] = useState(false);
  const [newNoteCategoryName, setNewNoteCategoryName] = useState('');
  const [selectedNoteCategory, setSelectedNoteCategory] = useState('uncategorized');
  const [expandedNoteCategories, setExpandedNoteCategories] = useState(new Set());
  const [renamingNoteCategoryId, setRenamingNoteCategoryId] = useState(null);
  const [noteCategoryRenameValue, setNoteCategoryRenameValue] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [expandedImageCategories, setExpandedImageCategories] = useState(new Set());
  
  // Ref for file input to reset it when starting new chat
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const personalityDropdownRef = useRef(null);

  // Close personality dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (personalityDropdownRef.current && !personalityDropdownRef.current.contains(event.target)) {
        setShowPersonalityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load chats on component mount
  useEffect(() => {
    loadChats();
    loadCategories();
    loadPromptHistory();
    loadPersonalities();
    loadNotes();
    loadNoteCategories();
    loadButtonSize();
    loadTextSize();
  }, []);

  // Initialize expanded note categories when note categories are loaded
  useEffect(() => {
    if (noteCategories.length > 0) {
      // Start with all categories closed by default
      setExpandedNoteCategories(new Set());
    }
  }, [noteCategories]);

  // Refresh search results when notes change
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [notes]);

  const loadChats = async () => {
    try {
      const res = await fetch('http://localhost:8001/chats');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setChats(data.chats || []);
      
      // Re-run search if search is active
      if (showSearch && searchQuery) {
        performSearch(searchQuery);
      }
    } catch (err) {
      console.error('Error loading chats:', err);
      setChats([]); // Set empty array on error to prevent UI issues
    }
  };

  // Debug function to manually trigger loadChats
  const debugLoadChats = async () => {
    await loadChats();
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('http://localhost:8001/categories');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data.categories || []);
      
      // Start with all categories closed by default
      setExpandedCategories(new Set());
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([{ id: 'uncategorized', name: 'Uncategorized' }]);
      setExpandedCategories(new Set());
    }
  };

  const loadPromptHistory = () => {
    try {
      const saved = localStorage.getItem('promptHistory');
      if (saved) {
        setPromptHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading prompt history:', err);
      setPromptHistory([]);
    }
  };

  const savePromptHistory = (history) => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(history));
      setPromptHistory(history);
    } catch (err) {
      console.error('Error saving prompt history:', err);
    }
  };

  const addToPromptHistory = (prompt) => {
    if (!prompt || prompt.trim().length < 3) return; // Don't save very short prompts
    
    const trimmedPrompt = prompt.trim();
    const newHistory = promptHistory.filter(p => p !== trimmedPrompt); // Remove if exists
    newHistory.unshift(trimmedPrompt); // Add to beginning
    
    // Keep only last 50 prompts
    const limitedHistory = newHistory.slice(0, 50);
    savePromptHistory(limitedHistory);
  };

  // Button size functions
  const updateButtonSize = (size) => {
    setButtonSize(size);
    localStorage.setItem('buttonSize', size);
  };

  const loadButtonSize = () => {
    const savedSize = localStorage.getItem('buttonSize');
    if (savedSize) {
      setButtonSize(savedSize);
    }
  };

  // Get button size classes
  const getButtonSizeClasses = (isMainButton = false) => {
    const baseClasses = 'rounded-lg transition-colors flex items-center justify-center';
    
    if (isMainButton) {
      // Main sidebar buttons
      switch (buttonSize) {
        case 'large':
          return `${baseClasses} p-4 w-16 h-16`;
        case 'extra-large':
          return `${baseClasses} p-5 w-20 h-20`;
        default:
          return `${baseClasses} p-3 w-12 h-12`;
      }
    } else {
      // Secondary buttons
      switch (buttonSize) {
        case 'large':
          return `${baseClasses} p-3`;
        case 'extra-large':
          return `${baseClasses} p-4`;
        default:
          return `${baseClasses} p-2`;
      }
    }
  };

  const getIconSize = (isMainButton = false) => {
    if (isMainButton) {
      switch (buttonSize) {
        case 'large':
          return { width: '20px', height: '20px' };
        case 'extra-large':
          return { width: '24px', height: '24px' };
        default:
          return { width: '16px', height: '16px' };
      }
    } else {
      switch (buttonSize) {
        case 'large':
          return { width: '18px', height: '18px' };
        case 'extra-large':
          return { width: '20px', height: '20px' };
        default:
          return { width: '16px', height: '16px' };
      }
    }
  };

  const getCollapsedSidebarWidth = () => {
    switch (buttonSize) {
      case 'large':
        return '80px';
      case 'extra-large':
        return '96px';
      default:
        return '64px';
    }
  };

  // Get padding and size classes for small action buttons (rename, move, delete, checkmark, X)
  const getSmallActionButtonClasses = () => {
    switch (buttonSize) {
      case 'large':
        return 'px-3 py-2 text-sm';
      case 'extra-large':
        return 'px-4 py-3 text-base';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  // Get icon size for small action buttons
  const getSmallActionIconSize = () => {
    switch (buttonSize) {
      case 'large':
        return { width: '14px', height: '14px' };
      case 'extra-large':
        return { width: '16px', height: '16px' };
      default:
        return { width: '12px', height: '12px' };
    }
  };

  // Text size functions
  const updateTextSize = (size) => {
    setTextSize(size);
    localStorage.setItem('textSize', size);
  };

  const loadTextSize = () => {
    const savedSize = localStorage.getItem('textSize');
    if (savedSize) {
      setTextSize(savedSize);
    }
  };

  // Get inline style for text scaling
  const getTextSizeStyle = (baseSize = 'text-base') => {
    const sizeMultiplier = textSize === 'large' ? 1.5 : textSize === 'extra-large' ? 2 : 1;
    
    const baseSizes = {
      'text-xs': 0.75,
      'text-sm': 0.875,
      'text-base': 1,
      'text-lg': 1.125,
      'text-xl': 1.25,
      'text-2xl': 1.5,
      'text-3xl': 1.875,
      'text-4xl': 2.25
    };
    
    const baseRem = baseSizes[baseSize] || 1;
    const scaledSize = baseRem * sizeMultiplier;
    
    return { fontSize: `${scaledSize}rem` };
  };

  // Get button padding that scales with text size
  const getButtonPaddingForText = (basePadding = 'px-4 py-2') => {
    if (textSize === 'large') {
      return 'px-6 py-3';
    }
    if (textSize === 'extra-large') {
      return 'px-8 py-4';
    }
    return basePadding;
  };

  const findBestPromptSuggestion = (currentInput) => {
    if (!currentInput || currentInput.length < 2) {
      setPromptSuggestion('');
      setShowSuggestion(false);
      return;
    }

    const input = currentInput.toLowerCase();
    
    // Find prompts that start with the current input
    const startsWith = promptHistory.find(prompt => 
      prompt.toLowerCase().startsWith(input) && prompt.toLowerCase() !== input
    );
    
    if (startsWith) {
      setPromptSuggestion(startsWith);
      setShowSuggestion(true);
      return;
    }

    // Find prompts that contain the current input
    const contains = promptHistory.find(prompt => 
      prompt.toLowerCase().includes(input) && prompt.toLowerCase() !== input
    );
    
    if (contains) {
      setPromptSuggestion(contains);
      setShowSuggestion(true);
      return;
    }

    // No suggestion found
    setPromptSuggestion('');
    setShowSuggestion(false);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Find and show suggestion as user types
    findBestPromptSuggestion(newText);
  };

  const acceptSuggestion = () => {
    if (promptSuggestion) {
      setText(promptSuggestion);
      setPromptSuggestion('');
      setShowSuggestion(false);
    }
  };

  // Handle personality details input (unlimited length)
  const handlePersonalityDetailsChange = (e) => {
    const newValue = e.target.value;
    setPersonalityDetails(newValue); // No character limit - accept any length
  };

  // Personality Management Functions
  const loadPersonalities = () => {
    try {
      const saved = localStorage.getItem('personalities');
      
      if (saved) {
        const parsedPersonalities = JSON.parse(saved);
        
        // Migration: Update any default personality to the simple prompt
        const updatedPersonalities = parsedPersonalities.map(p => {
          if (p.id === 'default' && p.isDefault) {
            return {
              ...p,
              details: 'You are a helpful assistant.'
            };
          }
          return p;
        });
        
        // Save updated personalities back to localStorage
        localStorage.setItem('personalities', JSON.stringify(updatedPersonalities));
        setPersonalities(updatedPersonalities);
      } else {
        // Initialize with default O/ASK personality
        const defaultPersonalities = [
          {
            id: 'default',
            name: 'Default',
            details: 'You are a helpful assistant.',
            isDefault: true
          }
        ];
        setPersonalities(defaultPersonalities);
        localStorage.setItem('personalities', JSON.stringify(defaultPersonalities));
      }
    } catch (err) {
      console.error('Error loading personalities:', err);
      // Fallback to O/ASK default
      const defaultPersonalities = [
        {
          id: 'default',
          name: 'Default',
          details: 'You are a helpful assistant.',
          isDefault: true
        }
      ];
      setPersonalities(defaultPersonalities);
    }
  };

  const savePersonalities = (newPersonalities) => {
    try {
      localStorage.setItem('personalities', JSON.stringify(newPersonalities));
      setPersonalities(newPersonalities);
    } catch (err) {
      console.error('Error saving personalities:', err);
    }
  };

  const addPersonality = () => {
    if (!personalityName.trim() || !personalityDetails.trim()) {
      alert('Please enter both personality name and details.');
      return;
    }

    // Removed character limit validation - unlimited length allowed

    const newPersonality = {
      id: Date.now().toString(),
      name: personalityName.trim(),
      details: personalityDetails.trim(),
      isDefault: false
    };

    const updatedPersonalities = [...personalities, newPersonality];
    savePersonalities(updatedPersonalities);
    
    // Reset form
    setPersonalityName('');
    setPersonalityDetails('');
    setShowAddPersonality(false);
  };

  const editPersonality = (personalityId) => {
    const personality = personalities.find(p => p.id === personalityId);
    if (personality && !personality.isDefault) {
      setPersonalityName(personality.name);
      setPersonalityDetails(personality.details);
      setEditingPersonalityId(personalityId);
      setShowAddPersonality(true);
    }
  };

  const updatePersonality = () => {
    if (!personalityName.trim() || !personalityDetails.trim()) {
      alert('Please enter both personality name and details.');
      return;
    }

    // Removed character limit validation - unlimited length allowed

    const updatedPersonalities = personalities.map(p => 
      p.id === editingPersonalityId 
        ? { ...p, name: personalityName.trim(), details: personalityDetails.trim() }
        : p
    );

    savePersonalities(updatedPersonalities);
    
    // Reset form
    setPersonalityName('');
    setPersonalityDetails('');
    setEditingPersonalityId(null);
    setShowAddPersonality(false);
  };

  const deletePersonality = (personalityId) => {
    const personality = personalities.find(p => p.id === personalityId);
    if (personality && !personality.isDefault) {
      if (confirm(`Are you sure you want to delete the personality "${personality.name}"?`)) {
        const updatedPersonalities = personalities.filter(p => p.id !== personalityId);
        savePersonalities(updatedPersonalities);
        
        // If we deleted the currently selected personality, switch to default
        if (selectedPersonality === personalityId) {
          setSelectedPersonality('default');
        }
      }
    }
  };

  const cancelPersonalityEdit = () => {
    setPersonalityName('');
    setPersonalityDetails('');
    setEditingPersonalityId(null);
    setShowAddPersonality(false);
  };

  const getSystemPrompt = () => {
    const personality = personalities.find(p => p.id === selectedPersonality);
    const systemPrompt = personality ? personality.details : 'You are a helpful assistant.';
    
    return systemPrompt;
  };

  // Debug function to force personality refresh and migration
  const debugRefreshPersonalities = () => {
    console.log('=== DEBUG: Force refreshing personalities ===');
    console.log('Current localStorage personalities:', localStorage.getItem('personalities'));
    console.log('Current personalities state:', personalities);
    console.log('Current selected personality:', selectedPersonality);
    
    // Force reload personalities (this will trigger migration)
    loadPersonalities();
    
    setTimeout(() => {
      console.log('After refresh - localStorage personalities:', localStorage.getItem('personalities'));
      console.log('After refresh - personalities state:', personalities);
      console.log('After refresh - system prompt:', getSystemPrompt());
    }, 100);
  };

  // Debug function to force clear and recreate personalities
  const debugResetPersonalities = () => {
    console.log('=== DEBUG: Force resetting personalities ===');
    localStorage.removeItem('personalities');
    loadPersonalities();
    
    setTimeout(() => {
      console.log('After reset - personalities:', personalities);
      console.log('After reset - system prompt:', getSystemPrompt());
    }, 100);
  };

  // Notes Management Functions
  const loadNotes = () => {
    try {
      const saved = localStorage.getItem('notes');
      if (saved) {
        const parsedNotes = JSON.parse(saved);
        setNotes(parsedNotes);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error('Error loading notes:', err);
      setNotes([]);
    }
  };

  const saveNotes = (newNotes) => {
    try {
      localStorage.setItem('notes', JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (err) {
      console.error('Error saving notes:', err);
    }
  };

  const loadNoteCategories = () => {
    try {
      const saved = localStorage.getItem('noteCategories');
      if (saved) {
        const parsedCategories = JSON.parse(saved);
        setNoteCategories(parsedCategories);
      } else {
        const defaultCategories = [
          { id: 'uncategorized', name: 'Uncategorized' }
        ];
        setNoteCategories(defaultCategories);
        localStorage.setItem('noteCategories', JSON.stringify(defaultCategories));
      }
    } catch (err) {
      console.error('Error loading note categories:', err);
      const defaultCategories = [
        { id: 'uncategorized', name: 'Uncategorized' }
      ];
      setNoteCategories(defaultCategories);
    }
  };

  const saveNoteCategories = (newCategories) => {
    try {
      localStorage.setItem('noteCategories', JSON.stringify(newCategories));
      setNoteCategories(newCategories);
    } catch (err) {
      console.error('Error saving note categories:', err);
    }
  };

  const addNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert('Please enter both note title and content.');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory || 'Uncategorized',
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    
    // Reset form
    setNoteTitle('');
    setNoteContent('');
    setShowAddNote(false);
  };

  const editNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setNoteCategory(note.category || '');
      setSelectedNoteCategory(note.category_id || 'uncategorized');
      setEditingNoteId(noteId);
      setShowAddNote(true);
    }
  };

  const updateNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert('Please enter both note title and content.');
      return;
    }

    const updatedNotes = notes.map(n => 
      n.id === editingNoteId 
        ? { 
            ...n, 
            title: noteTitle.trim(), 
            content: noteContent.trim(),
            category: noteCategory || 'Uncategorized',
            timestamp: new Date().toISOString()
          }
        : n
    );

    saveNotes(updatedNotes);
    
    // Reset form
    setNoteTitle('');
    setNoteContent('');
    setEditingNoteId(null);
    setSelectedNoteCategory('uncategorized');
    setShowAddNote(false);
  };

  const deleteNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      if (confirm(`Are you sure you want to delete the note "${note.title}"?`)) {
        const updatedNotes = notes.filter(n => n.id !== noteId);
        saveNotes(updatedNotes);
        // Clear search results to prevent showing deleted notes
        if (searchQuery) {
          clearSearch();
        }
      }
    }
  };

  const cancelNoteEdit = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('');
    setEditingNoteId(null);
    setSelectedNoteCategory('uncategorized');
    setShowAddNote(false);
  };

  const addNoteCategory = (categoryName = null) => {
    const nameToUse = categoryName || newNoteCategoryName.trim();
    console.log('addNoteCategory called with:', nameToUse);
    console.log('Current noteCategories:', noteCategories);
    
    if (!nameToUse) {
      alert('Please enter a category name.');
      return;
    }

    // Check if category already exists
    if (noteCategories.some(cat => cat.name.toLowerCase() === nameToUse.toLowerCase())) {
      alert('A category with this name already exists.');
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: nameToUse
    };

    const updatedCategories = [...noteCategories, newCategory];
    
    console.log('New category:', newCategory);
    console.log('Updated categories:', updatedCategories);
    
    // Immediately update state for instant feedback
    setNoteCategories(updatedCategories);
    
    // Auto-expand the newly created category
    setExpandedNoteCategories(prev => {
      const newExpanded = new Set([...prev, nameToUse]);
      console.log('Expanding category:', nameToUse);
      console.log('New expanded categories:', newExpanded);
      return newExpanded;
    });
    
    // Also save to localStorage
    try {
      localStorage.setItem('noteCategories', JSON.stringify(updatedCategories));
      console.log('Saved to localStorage successfully');
    } catch (err) {
      console.error('Error saving note categories:', err);
      // Revert state on error
      setNoteCategories(noteCategories);
    }
    
    setNewNoteCategoryName('');
    setShowAddNoteCategory(false);
    
    console.log('addNoteCategory completed');
  };

  const deleteNoteCategory = (categoryId) => {
    if (categoryId === 'uncategorized') {
      alert('Cannot delete the default category.');
      return;
    }

    const category = noteCategories.find(c => c.id === categoryId);
    if (category) {
      if (confirm(`Are you sure you want to delete the category "${category.name}"? All notes in this category will be deleted.`)) {
        // Delete notes in this category
        const updatedNotes = notes.filter(note => note.category_id !== categoryId);
        saveNotes(updatedNotes);

        // Remove category
        const updatedCategories = noteCategories.filter(c => c.id !== categoryId);
        saveNoteCategories(updatedCategories);
        
        // Clear search results to prevent showing deleted notes
        if (searchQuery) {
          clearSearch();
        }
      }
    }
  };

  const startRenameNoteCategory = (categoryId) => {
    const category = noteCategories.find(c => c.id === categoryId);
    const currentName = category ? category.name : '';
    setRenamingNoteCategoryId(categoryId);
    setNoteCategoryRenameValue(currentName || '');
  };

  const saveRenameNoteCategory = (categoryId) => {
    if (!noteCategoryRenameValue.trim()) {
      alert('Please enter a category name.');
      return;
    }

    const updatedCategories = noteCategories.map(category => 
      category.id === categoryId 
        ? { ...category, name: noteCategoryRenameValue.trim() }
        : category
    );
    saveNoteCategories(updatedCategories);

    // Update notes that reference this category
    const updatedNotes = notes.map(note => 
      note.category === noteCategories.find(c => c.id === categoryId)?.name
        ? { ...note, category: noteCategoryRenameValue.trim() }
        : note
    );
    saveNotes(updatedNotes);

    setRenamingNoteCategoryId(null);
    setNoteCategoryRenameValue('');
  };

  const toggleNoteCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedNoteCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNoteCategories(newExpanded);
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setCurrentChatId(null); // Clear current chat when viewing a note
    setShowNotes(false); // Close notes panel to show the note content
  };

  const createNewChat = async () => {
    try {
      // Clear current chat state to show "O/ASK it!" interface
      setCurrentChatId(null);
      setText('');
      setImage(null);
      setResponse('');
      setCurrentQuestion(''); // Clear any persistent response
      setCurrentConversation([]);
      setShowSuggestion(false); // Hide any suggestion
      setSelectedNote(null); // Clear selected note when starting new chat
      setMovingChatId(null); // Clear any moving chat state
      setMovingNoteId(null); // Clear any moving note state
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      loadChats();
    } catch (err) {
      console.error('Error creating new chat:', err);
    }
  };

  const deleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat? All information in this chat will be permanently lost and cannot be recovered.')) {
      return;
    }

    try {
      await fetch(`http://localhost:8001/chats/${chatId}`, {
        method: 'DELETE'
      });
      loadChats();
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setText('');
        setImage(null);
        setResponse('');
        setCurrentQuestion(''); // Clear any persistent response
        setCurrentConversation([]);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const startRenameChat = (chatId, currentName) => {
    setRenamingChatId(chatId);
    setRenameValue(currentName || '');
  };

  const saveRenameChat = async (chatId) => {
    try {
      const formData = new FormData();
      formData.append('new_name', renameValue);

      await fetch(`http://localhost:8001/chats/${chatId}/rename`, {
        method: 'PUT',
        body: formData
      });

      setRenamingChatId(null);
      setRenameValue('');
      loadChats();
    } catch (err) {
      console.error('Error renaming chat:', err);
    }
  };

  // Category management functions
  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const formData = new FormData();
      formData.append('name', newCategoryName);

      const response = await fetch('http://localhost:8001/categories', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const newCategory = result.category;
        
        // Immediately add the new category to the state for instant feedback
        setCategories(prevCategories => [...prevCategories, newCategory]);
        
        setNewCategoryName('');
        setShowAddCategory(false);
        
        // Also reload categories to ensure consistency
        await loadCategories();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error creating category:', err);
      // Fallback to reload categories
      loadCategories();
    }
  };

  const startRenameCategory = (categoryId, currentName) => {
    setRenamingCategoryId(categoryId);
    setCategoryRenameValue(currentName || '');
  };

  const saveRenameCategory = async (categoryId) => {
    try {
      const formData = new FormData();
      formData.append('new_name', categoryRenameValue);

      await fetch(`http://localhost:8001/categories/${categoryId}/rename`, {
        method: 'PUT',
        body: formData
      });

      setRenamingCategoryId(null);
      setCategoryRenameValue('');
      loadCategories();
    } catch (err) {
      console.error('Error renaming category:', err);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (categoryId === 'uncategorized') {
      alert('Cannot delete the default category');
      return;
    }

    // Get the number of chats in this category for the confirmation message
    const categoryChats = chats.filter(chat => 
      (chat.category_id || 'uncategorized') === categoryId
    );
    
    const chatCount = categoryChats.length;
    let confirmMessage = `Are you sure you want to delete this category?

This will permanently delete:
- The category itself
- ALL ${chatCount} chat${chatCount !== 1 ? 's' : ''} within this category
- ALL conversation history and information in these chats

This action cannot be undone. All data will be permanently lost.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await fetch(`http://localhost:8001/categories/${categoryId}`, {
        method: 'DELETE'
      });

      loadCategories();
      loadChats(); // Reload chats as they may have been moved
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const moveChatToCategory = async (chatId, categoryId) => {
    try {
      const formData = new FormData();
      formData.append('category_id', categoryId);

      await fetch(`http://localhost:8001/chats/${chatId}/category`, {
        method: 'PUT',
        body: formData
      });

      setMovingChatId(null);
      loadChats();
    } catch (err) {
      console.error('Error moving chat:', err);
    }
  };

  const moveNoteToCategory = (noteId, categoryId) => {
    try {
      const category = noteCategories.find(c => c.id === categoryId);
      if (!category) {
        console.error('Category not found:', categoryId);
        return;
      }

      const updatedNotes = notes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              category: category.name, // Use category name for consistency
              timestamp: new Date().toISOString()
            }
          : note
      );

      saveNotes(updatedNotes);
      setMovingNoteId(null);
    } catch (err) {
      console.error('Error moving note:', err);
    }
  };

  const selectChat = async (chat) => {
    setCurrentChatId(chat.id);
    setText('');
    setImage(null);
    setResponse('');
    setCurrentQuestion(''); // Clear question
    setShowChatList(false);
    setSelectedNote(null); // Clear selected note when selecting a chat

    // Handle both old and new chat structures
    if (chat.conversation && chat.conversation.length > 0) {
      // New structure - use conversation array
      setCurrentConversation(chat.conversation);
    } else if (chat.question && chat.response) {
      // Old structure - convert to conversation format
      const oldConversation = [{
        timestamp: chat.timestamp,
        question: chat.question,
        response: chat.response,
        has_image: chat.has_image || false,
        image_data: chat.image_data || null
      }];
      setCurrentConversation(oldConversation);
    } else {
      // Try to load from server
      try {
        const res = await fetch(`http://localhost:8001/chats/${chat.id}`);
        const data = await res.json();
        setCurrentConversation(data.chat.conversation || []);
      } catch (err) {
        console.error('Error loading chat:', err);
        setCurrentConversation([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegularSubmit(e);
  };

  const handleRegularSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setCurrentQuestion(''); // Clear any persistent response
    setShowSuggestion(false); // Hide any suggestion
    
    // Add to prompt history
    addToPromptHistory(text);

    console.log('Form submitted with text:', text);
    console.log('Image selected:', image);

    // Create an abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    // Create a low-resolution version only for actual image files
    let imageDataUrl = null;
    if (image) {
      try {
        // Check if the file is actually an image
        if (image.type.startsWith('image/')) {
          imageDataUrl = await createLowResImage(image);
        } else {
          console.log('Non-image file detected, skipping image processing:', image.type);
        }
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('system_prompt', getSystemPrompt());
    if (image) {
      formData.append('image', image);
    }
    if (imageDataUrl) {
      formData.append('image_data', imageDataUrl);
    }
    if (currentChatId) {
      formData.append('chat_id', currentChatId);
    }

    try {
      console.log('Sending request to server...');
      const res = await fetch('http://localhost:8001/ask', {
        method: 'POST',
        body: formData,
        signal: controller.signal, // Add abort signal
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Server response:', data);

      if (data.error) {
        if (data.error.includes('stopped')) {
          console.log('Processing was stopped by user');
          setResponse(''); // Clear any partial response
          // Don't clear text and image when stopped
          return;
        } else {
          setResponse('Error: ' + data.error);
          return;
        }
      }

      if (data.response) {
        setResponse(data.response);
        setCurrentChatId(data.chat_id);
        setCurrentConversation(data.conversation || []);
        
        // Store performance and analysis data
        if (data.performance) {
          setPerformanceData(data.performance);
          console.log('Performance data:', data.performance);
        }
        if (data.model_config) {
          setModelConfigData(data.model_config);
          console.log('Model config data:', data.model_config);
        }
        if (data.analysis_package) {
          console.log('Analysis package created:', data.analysis_package);
        }
        
        setText(''); // Clear input after sending
        setImage(null); // Clear image after sending
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        loadChats(); // Refresh chat list
        console.log('Response set successfully:', data.response);
      } else {
        setResponse('No response received from server.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was aborted by user');
        setResponse(''); // Clear any partial response
        // Don't clear text and image when stopped
      } else {
        console.error('Error occurred:', err);
        setResponse('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const stopThinking = async () => {
    if (abortController) {
      // First abort the client-side request
      abortController.abort();
      console.log('Aborting client request...');
      
      // Then send stop signal to server
      try {
        await fetch('http://localhost:8001/stop', {
          method: 'POST'
        });
        console.log('Stop signal sent to server');
      } catch (err) {
        console.error('Error sending stop signal:', err);
      }
      
      console.log('Stopping AI thinking process...');
    }
  };

  // Function to create a low-resolution version of an image file (images only)
  const createLowResImage = (file) => {
    return new Promise((resolve, reject) => {
      // Double-check that this is an image file
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 300px width/height while maintaining aspect ratio)
        const maxSize = 300;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress the image
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
        resolve(dataUrl);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const toggleDarkMode = () => {
    console.log('Toggling dark mode from:', darkMode, 'to:', !darkMode);
    setDarkMode(!darkMode);
  };

  const clearAllData = async () => {
    const confirmClear = confirm('Are you sure you want to clear all data? This will delete all chats, notes, categories, settings, and analysis data. This action cannot be undone.');
    if (confirmClear) {
      console.log('Starting data clear process...');
      try {
        console.log('Attempting to clear analysis data from server...');
        // Clear analysis data from server
        const response = await fetch('http://localhost:8001/analysis-data', {
          method: 'DELETE',
        });
        
        console.log('Server response status:', response.status);
        if (response.ok) {
          const result = await response.json();
          console.log('Analysis data cleared successfully:', result);
        } else {
          console.warn('Failed to clear analysis data. Status:', response.status, 'Text:', response.statusText);
        }
      } catch (error) {
        console.error('Error clearing analysis data:', error);
      }
      
      try {
        console.log('Attempting to clear chats and categories from server...');
        // Clear chats and categories from server
        const response = await fetch('http://localhost:8001/clear-all-data', {
          method: 'DELETE',
        });
        
        console.log('Server response status for chat data:', response.status);
        if (response.ok) {
          const result = await response.json();
          console.log('Chat data cleared successfully:', result);
        } else {
          console.warn('Failed to clear chat data. Status:', response.status, 'Text:', response.statusText);
        }
      } catch (error) {
        console.error('Error clearing chat data:', error);
      }
      
      console.log('Clearing localStorage and resetting state...');
      // Clear localStorage
      localStorage.clear();
      
      // Reset all state to initial values
      setChats([]);
      setCategories([{ id: 'uncategorized', name: 'Uncategorized' }]);
      setExpandedCategories(new Set());
      setNotes([]);
      setNoteCategories([{ id: 'uncategorized', name: 'Uncategorized' }]);
      setExpandedNoteCategories(new Set());
      setPersonalities([{ id: 'default', name: 'Default', details: 'You are a helpful assistant.', isDefault: true }]);
      setCurrentChatId(null);
      setCurrentConversation([]);
      setSearchQuery('');
      setFilteredChats([]);
      setSelectedNote(null);
      setResponse('');
      setText('');
      setImage(null);
      setSelectedPersonality('default');
      
      // Reset UI state
      setShowChatList(false);
      setShowSettings(false);
      setShowImageBrowser(false);
      setShowPersonalities(false);
      setShowNotes(false);
      setShowSearch(false);
      setShowAddNote(false);
      setShowAddNoteCategory(false);
      setShowAddPersonality(false);
      setShowAddCategory(false);
      
      alert('All data has been cleared successfully!\n\nThis includes chats, notes, categories, settings, and analysis data.');
    }
  };

  const backupAllData = async () => {
    try {
      // Create timestamp for the backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `oask-backup-${timestamp}`;
      
      // Create organized folder structure data
      const backupStructure = {
        // Root metadata
        "README.txt": `OASK Data Backup
Created: ${new Date().toLocaleString()}
Version: 1.0

This backup contains all your OASK application data organized in folders:

📁 chats/
  • conversations.json - All chat conversations
  • categories.json - Chat categories

📁 notes/
  • notes.json - All note entries  
  • categories.json - Note categories

📁 personalities/
  • personalities.json - Custom AI personalities

📁 settings/
  • preferences.json - User interface settings

📁 metadata/
  • backup-info.json - Backup creation details

To restore, import the JSON files back into OASK.`,

        // Chats folder
        "chats/conversations.json": JSON.stringify(chats, null, 2),
        "chats/categories.json": JSON.stringify(categories, null, 2),
        
        // Notes folder  
        "notes/notes.json": JSON.stringify(notes, null, 2),
        "notes/categories.json": JSON.stringify(noteCategories, null, 2),
        
        // Personalities folder
        "personalities/personalities.json": JSON.stringify(personalities, null, 2),
        
        // Settings folder
        "settings/preferences.json": JSON.stringify({
          darkMode: darkMode,
          buttonSize: buttonSize,
          textSize: textSize,
          expandedCategories: Array.from(expandedCategories),
          expandedNoteCategories: Array.from(expandedNoteCategories)
        }, null, 2),
        
        // Metadata folder
        "metadata/backup-info.json": JSON.stringify({
          exportDate: new Date().toISOString(),
          version: "1.0",
          description: "OASK Complete Data Backup",
          stats: {
            totalConversations: chats.length,
            totalChatCategories: categories.length,
            totalNotes: notes.length,
            totalNoteCategories: noteCategories.length,
            totalPersonalities: personalities.length
          },
          localStorage: {
            noteCategories: localStorage.getItem('noteCategories'),
            notes: localStorage.getItem('notes'),
            personalities: localStorage.getItem('personalities')
          }
        }, null, 2)
      };

      // Create a zip-like structure using JSON with organized folders
      const completeBackup = {
        backupName: backupName,
        structure: backupStructure
      };

      // Create and download the backup file
      const blob = new Blob([JSON.stringify(completeBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${backupName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show detailed backup confirmation
      const stats = `📊 Backup Statistics:
• ${chats.length} conversations
• ${categories.length} chat categories  
• ${notes.length} notes
• ${noteCategories.length} note categories
• ${personalities.length} personalities
• User interface settings

📁 Organized in folders:
• /chats/ - Conversations & categories
• /notes/ - Notes & categories  
• /personalities/ - AI personalities
• /settings/ - User preferences
• /metadata/ - Backup information`;

      alert(`✅ Backup Created Successfully!\n\nFile: ${backupName}.json\n\n${stats}`);
      
    } catch (error) {
      console.error('Backup failed:', error);
      alert('❌ Backup failed. Please try again.\n\nError: ' + error.message);
    }
  };

  const restoreFromBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        
        // Check if it's the new structured format
        if (backupData.structure) {
          // New organized format
          const structure = backupData.structure;
          
          // Parse conversations and categories
          if (structure["chats/conversations.json"]) {
            const conversations = JSON.parse(structure["chats/conversations.json"]);
            setChats(conversations);
          }
          
          if (structure["chats/categories.json"]) {
            const chatCategories = JSON.parse(structure["chats/categories.json"]);
            setCategories(chatCategories);
          }
          
          // Parse notes and note categories
          if (structure["notes/notes.json"]) {
            const noteEntries = JSON.parse(structure["notes/notes.json"]);
            setNotes(noteEntries);
            localStorage.setItem('notes', JSON.stringify(noteEntries));
          }
          
          if (structure["notes/categories.json"]) {
            const noteCats = JSON.parse(structure["notes/categories.json"]);
            setNoteCategories(noteCats);
            localStorage.setItem('noteCategories', JSON.stringify(noteCats));
          }
          
          // Parse personalities
          if (structure["personalities/personalities.json"]) {
            const pers = JSON.parse(structure["personalities/personalities.json"]);
            setPersonalities(pers);
            localStorage.setItem('personalities', JSON.stringify(pers));
          }
          
          // Parse settings
          if (structure["settings/preferences.json"]) {
            const prefs = JSON.parse(structure["settings/preferences.json"]);
            if (typeof prefs.darkMode === 'boolean') setDarkMode(prefs.darkMode);
            if (prefs.buttonSize) setButtonSize(prefs.buttonSize);
            if (prefs.textSize) setTextSize(prefs.textSize);
            if (prefs.expandedCategories) setExpandedCategories(new Set(prefs.expandedCategories));
            if (prefs.expandedNoteCategories) setExpandedNoteCategories(new Set(prefs.expandedNoteCategories));
          }
          
        } else {
          // Legacy format support
          if (backupData.chats) {
            if (backupData.chats.conversations) setChats(backupData.chats.conversations);
            if (backupData.chats.categories) setCategories(backupData.chats.categories);
          }
          
          if (backupData.notes) {
            if (backupData.notes.noteEntries) {
              setNotes(backupData.notes.noteEntries);
              localStorage.setItem('notes', JSON.stringify(backupData.notes.noteEntries));
            }
            if (backupData.notes.noteCategories) {
              setNoteCategories(backupData.notes.noteCategories);
              localStorage.setItem('noteCategories', JSON.stringify(backupData.notes.noteCategories));
            }
          }
          
          if (backupData.personalities) {
            setPersonalities(backupData.personalities);
            localStorage.setItem('personalities', JSON.stringify(backupData.personalities));
          }
          
          if (backupData.settings) {
            if (typeof backupData.settings.darkMode === 'boolean') setDarkMode(backupData.settings.darkMode);
            if (backupData.settings.buttonSize) setButtonSize(backupData.settings.buttonSize);
            if (backupData.settings.textSize) setTextSize(backupData.settings.textSize);
          }
        }
        
        alert('✅ Data restored successfully!\n\nAll your chats, notes, categories, personalities, and settings have been restored from the backup.');
        
        // Reset file input
        event.target.value = '';
        
      } catch (error) {
        console.error('Restore failed:', error);
        alert('❌ Failed to restore backup.\n\nPlease ensure the file is a valid OASK backup.\n\nError: ' + error.message);
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const toggleChatList = () => {
    setShowChatList(!showChatList);
    if (!showChatList) {
      setShowSettings(false); // Close settings when opening chat list
      setShowImageBrowser(false); // Close image browser when opening chat list
      setShowPersonalities(false); // Close personalities when opening chat list
      setShowNotes(false); // Close notes when opening chat list
      setShowSearch(false); // Close search when opening chat list
      setShowAnalysis(false); // Close analysis when opening chat list
      setSelectedNote(null); // Clear selected note when opening chat list
      setMovingNoteId(null); // Clear any moving note state
    } else {
      // Clear moving states when closing chat list
      setMovingChatId(null);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (!showSettings) {
      setShowChatList(false); // Close chat list when opening settings
      setShowImageBrowser(false); // Close image browser when opening settings
      setShowPersonalities(false); // Close personalities when opening settings
      setShowNotes(false); // Close notes when opening settings
      setShowSearch(false); // Close search when opening settings
      setShowAnalysis(false); // Close analysis when opening settings
    }
  };

  const toggleImageBrowser = () => {
    setShowImageBrowser(!showImageBrowser);
    if (!showImageBrowser) {
      setShowChatList(false); // Close chat list when opening image browser
      setShowSettings(false); // Close settings when opening image browser
      setShowPersonalities(false); // Close personalities when opening image browser
      setShowNotes(false); // Close notes when opening image browser
      setShowSearch(false); // Close search when opening image browser
      setShowAnalysis(false); // Close analysis when opening image browser
    }
  };

  const togglePersonalities = () => {
    setShowPersonalities(!showPersonalities);
    if (!showPersonalities) {
      setShowChatList(false); // Close chat list when opening personalities
      setShowSettings(false); // Close settings when opening personalities
      setShowImageBrowser(false); // Close image browser when opening personalities
      setShowNotes(false); // Close notes when opening personalities
      setShowSearch(false); // Close search when opening personalities
      setShowAnalysis(false); // Close analysis when opening personalities
    }
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
    if (!showNotes) {
      setShowChatList(false); // Close chat list when opening notes
      setShowSettings(false); // Close settings when opening notes
      setShowImageBrowser(false); // Close image browser when opening notes
      setShowPersonalities(false); // Close personalities when opening notes
      setShowSearch(false); // Close search when opening notes
      setShowAnalysis(false); // Close analysis when opening notes
      setSelectedNote(null); // Clear selected note when opening notes panel
      setMovingChatId(null); // Clear any moving chat state
    } else {
      // Clear moving states when closing notes
      setMovingNoteId(null);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setShowChatList(false); // Close chat list when opening search
      setShowSettings(false); // Close settings when opening search
      setShowImageBrowser(false); // Close image browser when opening search
      setShowPersonalities(false); // Close personalities when opening search
      setShowNotes(false); // Close notes when opening search
      setShowAnalysis(false); // Close analysis when opening search
      setSearchQuery(''); // Clear search query
      setSelectedSearchIndex(0); // Reset selection
      performSearch(''); // Reset filtered chats
    }
  };

  const performSearch = (query) => {
    if (!query.trim()) {
      setFilteredChats([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Search in chats
    const chatResults = chats.filter(chat => {
      // Search in chat title/name
      const chatTitle = chat.name || 
        (chat.conversation && chat.conversation.length > 0 
          ? chat.conversation[0].question?.substring(0, 40) + '...'
          : chat.question?.substring(0, 40) + '...' || 'Untitled Chat');
      
      if (chatTitle.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in conversation content
      if (chat.conversation) {
        return chat.conversation.some(turn => 
          turn.question?.toLowerCase().includes(lowerQuery) ||
          turn.response?.toLowerCase().includes(lowerQuery)
        );
      } else if (chat.question || chat.response) {
        return chat.question?.toLowerCase().includes(lowerQuery) ||
               chat.response?.toLowerCase().includes(lowerQuery);
      }

      return false;
    }).map(chat => ({ ...chat, type: 'chat' }));

    // Search in notes
    const noteResults = notes.filter(note => {
      return note.title?.toLowerCase().includes(lowerQuery) ||
             note.content?.toLowerCase().includes(lowerQuery) ||
             note.category?.toLowerCase().includes(lowerQuery);
    }).map(note => ({ ...note, type: 'note' }));

    // Combine and sort results by timestamp
    const searchResults = [...chatResults, ...noteResults].sort((a, b) => 
      new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
    );

    setFilteredChats(searchResults);
    setSelectedSearchIndex(0); // Reset selection to first item
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredChats.length > 0) {
      e.preventDefault();
      selectChat(filteredChats[selectedSearchIndex]);
      setShowSearch(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => 
        prev < filteredChats.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Escape') {
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const selectSearchResult = (item) => {
    if (item.type === 'note') {
      selectNote(item);
    } else {
      selectChat(item);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredChats([]);
    setSelectedSearchIndex(0);
  };

  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleImageCategoryExpansion = (categoryName) => {
    const newExpanded = new Set(expandedImageCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedImageCategories(newExpanded);
  };

  // Helper function to determine file type and icon
  const getFileTypeInfo = (file) => {
    if (!file) return null;
    
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    if (fileType.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.gif')) {
      return { type: 'image', icon: '🖼️', canPreview: true };
    }
    if (fileType.startsWith('audio/') || fileName.endsWith('.mp3') || fileName.endsWith('.wav') || fileName.endsWith('.ogg')) {
      return { type: 'audio', icon: '🎵', canPreview: false };
    }
    if (fileType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mov')) {
      return { type: 'video', icon: '🎬', canPreview: false };
    }
    if (fileName.endsWith('.pdf')) {
      return { type: 'document', icon: '📄', canPreview: false };
    }
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return { type: 'document', icon: '📝', canPreview: false };
    }
    if (fileName.endsWith('.txt')) {
      return { type: 'text', icon: '📄', canPreview: false };
    }
    
    return { type: 'file', icon: '📎', canPreview: false };
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Text copied to clipboard (fallback)');
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
    }
  };

  const selectImageFromBrowser = async (chat, turnIndex) => {
    // First, select the chat
    setCurrentChatId(chat.id);
    setText('');
    setImage(null);
    setResponse('');
    setShowImageBrowser(false);
    setShowChatList(false);

    // Load the conversation
    if (chat.conversation && chat.conversation.length > 0) {
      setCurrentConversation(chat.conversation);
    } else if (chat.question && chat.response) {
      const oldConversation = [{
        timestamp: chat.timestamp,
        question: chat.question,
        response: chat.response,
        has_image: chat.has_image || false,
        image_data: chat.image_data || null
      }];
      setCurrentConversation(oldConversation);
    } else {
      try {
        const res = await fetch(`http://localhost:8001/chats/${chat.id}`);
        const data = await res.json();
        setCurrentConversation(data.chat.conversation || []);
      } catch (err) {
        console.error('Error loading chat:', err);
        setCurrentConversation([]);
      }
    }

    // Scroll to the specific turn after a short delay to allow the conversation to load
    setTimeout(() => {
      const conversationElement = document.querySelector('.conversation-turn-' + turnIndex);
      if (conversationElement) {
        conversationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Add effect to log darkMode changes
  useEffect(() => {
    console.log('Dark mode state changed to:', darkMode);
    // Update body background color
    document.body.style.backgroundColor = darkMode ? '#111827' : '#f3f4f6';
    document.body.style.color = darkMode ? '#ffffff' : '#111827';
  }, [darkMode]);

  // Make debug functions available globally for console access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugLoadChats = debugLoadChats;
      window.debugRefreshPersonalities = debugRefreshPersonalities;
      window.debugResetPersonalities = debugResetPersonalities;
      window.getSystemPrompt = getSystemPrompt;
    }
  }, [personalities, selectedPersonality]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans`} style={{
      backgroundColor: darkMode ? '#111827' : '#f3f4f6',
      color: darkMode ? '#ffffff' : '#111827'
    }}>
      {/* Left Sidebar - Always Visible */}
      <div
        className={`transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border-r-2 flex flex-col h-screen fixed left-0 top-0 z-10`}
        style={{
          width: showChatList || showSettings || showImageBrowser || showPersonalities || showNotes || showSearch || showAnalysis ? '320px' : getCollapsedSidebarWidth(),
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderColor: darkMode ? '#374151' : '#d1d5db'
        }}
      >
        {/* Sidebar Header with Icons - Vertical Stack */}
        <div className={`p-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'} border-b flex flex-col space-y-2 items-center`}>
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleChatList}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="Toggle Chat List"
          >
            {/* Hamburger SVG Icon */}
            <img
              src="/hamburger.svg"
              alt="Menu"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="New Chat"
          >
            {/* Add SVG Icon */}
            <img
              src="/add.svg"
              alt="New Chat"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* Search Button */}
          <button
            onClick={toggleSearch}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="Search Chats"
          >
            {/* Search SVG Icon */}
            <img
              src="/search.svg"
              alt="Search Chats"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* Images Browser Button */}
          <button
            onClick={toggleImageBrowser}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="Browse Images"
          >
            {/* Images SVG Icon */}
            <img
              src="/images.svg"
              alt="Browse Images"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* Personalities Button */}
          <button
            onClick={togglePersonalities}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="Personalities"
          >
            {/* Personality SVG Icon */}
            <img
              src="/personality.svg"
              alt="Personalities"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* Notes Button */}
          <button
            onClick={toggleNotes}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="Notes"
          >
            {/* Notes SVG Icon */}
            <img
              src="/notebook.svg"
              alt="Notes"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* Settings Button */}
          <button
            onClick={toggleSettings}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            title="Settings"
          >
            {/* Settings SVG Icon */}
            <img
              src="/settings.svg"
              alt="Settings"
              className={`${darkMode ? 'filter invert' : ''}`}
              style={getIconSize(true)}
            />
          </button>

          {/* Analysis Button */}
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`${getButtonSizeClasses(true)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${
              (performanceData || modelConfigData) ? (darkMode ? 'bg-green-700' : 'bg-green-100') : ''
            }`}
            title="Performance Analysis"
            disabled={!performanceData && !modelConfigData}
          >
            {/* Analysis Icon (using search icon as placeholder) */}
            <img
              src="/search.svg"
              alt="Analysis"
              className={`${darkMode ? 'filter invert' : ''} ${
                !performanceData && !modelConfigData ? 'opacity-50' : ''
              }`}
              style={getIconSize(true)}
            />
          </button>
        </div>


        {/* Personalities Panel - Expanded Mode */}
        {showPersonalities && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={getTextSizeStyle('text-lg')}>Personalities</h3>
              <div className="flex items-center gap-2">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={getTextSizeStyle('text-sm')}>
                  Add personality --&gt;
                </span>
                <button
                  onClick={() => setShowAddPersonality(true)}
                  className={`${getButtonSizeClasses(false)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  title="Add Personality"
                >
                  <img
                    src="/add-personality.svg"
                    alt="Add Personality"
                    className={`${darkMode ? 'filter invert' : ''}`}
                    style={getIconSize(false)}
                  />
                </button>
              </div>
            </div>

            {/* Add/Edit Personality Form */}
            {showAddPersonality && (
              <div className={`p-4 mb-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                <h4 className="font-semibold mb-3">{editingPersonalityId ? 'Edit Personality' : 'Add New Personality'}</h4>
                
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={personalityName}
                      onChange={(e) => setPersonalityName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          editingPersonalityId ? updatePersonality() : addPersonality();
                        }
                      }}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="Name"
                    />
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={personalityDetails}
                      onChange={handlePersonalityDetailsChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          e.preventDefault();
                          editingPersonalityId ? updatePersonality() : addPersonality();
                        }
                      }}
                      className={`w-full p-2 rounded border h-24 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="Personality details (unlimited length)"
                    />
                    <div className={`absolute bottom-1 right-2 text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {personalityDetails.length} characters
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button
                    onClick={cancelPersonalityEdit}
                    className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors flex items-center justify-center`}
                    title="Cancel"
                  >
                    <img
                      src="/delete-chat.svg"
                      alt="Cancel"
                      className={`${darkMode ? 'filter invert' : ''}`}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </button>
                  <button
                    onClick={editingPersonalityId ? updatePersonality : addPersonality}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    ✓
                  </button>
                </div>
              </div>
            )}

            {/* Personalities List */}
            <div className="space-y-2">
              {personalities.length === 0 ? (
                <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No personalities found. Click "Add Personality" to create one.
                </p>
              ) : (
                personalities.map((personality) => (
                  <div key={personality.id} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium" style={getTextSizeStyle('text-base')}>{personality.name}</div>
                      </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {!personality.isDefault && (
                        <>
                          <button
                            onClick={() => editPersonality(personality.id)}
                            className={`${getButtonSizeClasses(false)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                            title="Edit"
                          >
                            <img
                              src="/edit.svg"
                              alt="Edit"
                              className={`${darkMode ? 'filter invert' : ''}`}
                              style={getIconSize(false)}
                            />
                          </button>
                          <button
                            onClick={() => deletePersonality(personality.id)}
                            className={`${getButtonSizeClasses(false)} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                            title="Delete"
                          >
                            <img
                              src="/delete-chat.svg"
                              alt="Delete"
                              className={`${darkMode ? 'filter invert' : ''}`}
                              style={getIconSize(false)}
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Settings Panel - Expanded Mode */}
        {showSettings && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className="font-semibold mb-4" style={getTextSizeStyle('text-lg')}>Settings</h3>
            
            {/* Backup Data Button */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg border-2 border-dashed border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20">
              <div className="flex-1">
                <span className="font-medium text-green-700 dark:text-green-300" style={getTextSizeStyle('text-base')}>Backup Data</span>
                <p className={`text-xs mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Export all chats, notes, categories, and settings
                </p>
              </div>
              <button
                onClick={backupAllData}
                className={`px-4 py-2 rounded-lg border-2 transition-colors font-medium ${darkMode ? 'bg-green-700 border-green-600 text-white hover:bg-green-600' : 'bg-green-500 border-green-400 text-white hover:bg-green-600'}`}
                style={getTextSizeStyle('text-sm')}
                title="Download a complete backup of all your data"
              >
                📥 Backup
              </button>
            </div>
            
            {/* Restore Data Button */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex-1">
                <span className="font-medium text-blue-700 dark:text-blue-300" style={getTextSizeStyle('text-base')}>Restore Data</span>
                <p className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Import data from a backup file
                </p>
              </div>
              <label
                className={`px-4 py-2 rounded-lg border-2 transition-colors font-medium cursor-pointer ${darkMode ? 'bg-blue-700 border-blue-600 text-white hover:bg-blue-600' : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'}`}
                style={getTextSizeStyle('text-sm')}
                title="Upload a backup file to restore your data"
              >
                📤 Restore
                <input
                  type="file"
                  accept=".json"
                  onChange={restoreFromBackup}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium" style={getTextSizeStyle('text-base')}>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              <button
                onClick={() => {
                  console.log('Dark mode button clicked');
                  toggleDarkMode();
                }}
                className={`w-12 h-12 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center ${darkMode ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'
                  }`}
              >
                <span className="text-white font-bold" style={getTextSizeStyle('text-lg')}>
                  {darkMode ? '🌙' : '☀️'}
                </span>
              </button>
            </div>

            {/* Button Size Selection */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium" style={getTextSizeStyle('text-base')}>Button Size</span>
              <select
                value={buttonSize}
                onChange={(e) => updateButtonSize(e.target.value)}
                className={`px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                style={getTextSizeStyle('text-sm')}
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            {/* Text Size Selection */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium" style={getTextSizeStyle('text-base')}>Text Size</span>
              <select
                value={textSize}
                onChange={(e) => updateTextSize(e.target.value)}
                className={`px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                style={getTextSizeStyle('text-sm')}
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            {/* Clear All Data Button */}
            <div className="flex items-center justify-between">
              <span className="font-medium" style={getTextSizeStyle('text-base')}>Clear All Data</span>
              <button
                onClick={clearAllData}
                className={`px-3 py-2 rounded-lg border-2 transition-colors ${darkMode ? 'bg-red-700 border-red-600 text-white hover:bg-red-600' : 'bg-red-500 border-red-400 text-white hover:bg-red-600'}`}
                style={getTextSizeStyle('text-sm')}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Analysis Panel - Expanded Mode */}
        {showAnalysis && (performanceData || modelConfigData) && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className="font-semibold mb-4" style={getTextSizeStyle('text-lg')}>Performance Analysis</h3>
            
            {/* Model Configuration */}
            {modelConfigData && (
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={getTextSizeStyle('text-base')}>Hardware Configuration</h4>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Performance Class:</span> {modelConfigData.config_class}</div>
                    <div><span className="font-medium">CPU Threads:</span> {modelConfigData.num_threads}</div>
                    <div><span className="font-medium">Logical Cores:</span> {modelConfigData.logical_cores}</div>
                    <div><span className="font-medium">Memory:</span> {modelConfigData.memory_gb}GB</div>
                    <div className="col-span-2"><span className="font-medium">Data Type:</span> {modelConfigData.torch_dtype}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {performanceData && (
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={getTextSizeStyle('text-base')}>Last Response Performance</h4>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Duration:</span> {performanceData.duration_seconds?.toFixed(2)}s</div>
                    <div><span className="font-medium">Memory Used:</span> {performanceData.memory_used_mb?.toFixed(1)}MB</div>
                    <div className="col-span-2"><span className="font-medium">Operation:</span> {performanceData.operation}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Tip */}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} border ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                💡 This data shows how your hardware is optimized for AI processing. The system automatically detects your CPU capabilities and adjusts performance settings.
              </p>
            </div>
          </div>
        )}

        {/* Notes Panel - Expanded Mode */}
        {showNotes && (
          <div className="flex-1 flex flex-col">
            {/* Notes Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold" style={getTextSizeStyle('text-lg')}>Notes</h3>
            </div>

            {/* Category Management - Top Section */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              {showAddNoteCategory ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newNoteCategoryName}
                    onChange={(e) => setNewNoteCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newNoteCategoryName.trim()) {
                          addNoteCategory(newNoteCategoryName.trim());
                        }
                      }
                    }}
                    placeholder="Category name"
                    className={`px-2 py-1 border rounded text-sm flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <button
                    onClick={() => {
                      if (newNoteCategoryName.trim()) {
                        addNoteCategory(newNoteCategoryName.trim());
                      }
                    }}
                    className={`bg-green-500 text-white rounded hover:bg-green-600 ${getSmallActionButtonClasses()}`}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowAddNoteCategory(false);
                      setNewNoteCategoryName('');
                    }}
                    className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded ${getSmallActionButtonClasses()}`}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddNoteCategory(true)}
                  className={`w-full p-2 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center gap-2 ${darkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                  title="Add Category"
                >
                  <img
                    src="/category.svg"
                    alt="Add Category"
                    className={`${darkMode ? 'filter invert' : ''}`}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={getTextSizeStyle('text-sm')}>Add Category</span>
                </button>
              )}
            </div>

            {/* Add New Note Button */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddNote(true)}
                className={`w-full p-2 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center gap-2 ${darkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                title="Add Note"
              >
                <img
                  src="/add-note.svg"
                  alt="Add Note"
                  className={`${darkMode ? 'filter invert' : ''}`}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={getTextSizeStyle('text-sm')}>Add Note</span>
              </button>
            </div>

            {/* Add/Edit Note Form */}
            {showAddNote && (
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <h4 className="font-semibold mb-3">{editingNoteId ? 'Edit Note' : 'Add New Note'}</h4>
                
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (noteTitle.trim() && noteContent.trim()) {
                            editingNoteId ? updateNote() : addNote();
                          }
                        }
                      }}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="Title"
                    />
                  </div>

                  <div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          e.preventDefault();
                          if (noteTitle.trim() && noteContent.trim()) {
                            editingNoteId ? updateNote() : addNote();
                          }
                        }
                      }}
                      className={`w-full p-2 rounded border resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="Notes"
                      rows="4"
                    />
                  </div>

                  <div>
                    <select
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value)}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">Select category</option>
                      {noteCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (editingNoteId) {
                          updateNote();
                        } else {
                          addNote();
                        }
                      }}
                      className={`bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${getSmallActionButtonClasses()}`}
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelNoteEdit}
                      className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded transition-colors ${getSmallActionButtonClasses()}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {noteCategories.length === 0 ? (
                  <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No note categories found. Creating default category...
                  </p>
                ) : (
                  noteCategories
                  .sort((a, b) => {
                    // Always put "Uncategorized" at the top
                    if (a.id === 'uncategorized') return -1;
                    if (b.id === 'uncategorized') return 1;
                    // Sort alphabetically for all other categories
                    return a.name.localeCompare(b.name);
                  })
                  .map((category) => {
                  const categoryNotes = notes.filter(note => {
                    // Handle both old format (category_id) and new format (category name)
                    const noteCategory = note.category || (note.category_id ? noteCategories.find(c => c.id === note.category_id)?.name : null);
                    return noteCategory === category.name;
                  });

                  return (
                    <div key={category.id} className="mb-4">
                      {/* Category Header */}
                      {renamingNoteCategoryId === category.id ? (
                        <div className="flex gap-1 items-center w-full">
                          <input
                            type="text"
                            value={noteCategoryRenameValue}
                            onChange={(e) => setNoteCategoryRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                saveRenameNoteCategory(category.id);
                              }
                            }}
                            className={`px-2 py-1 border rounded text-sm flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="Category name"
                          />
                          <button
                            onClick={() => saveRenameNoteCategory(category.id)}
                            className={`bg-green-500 text-white rounded hover:bg-green-600 ${getSmallActionButtonClasses()}`}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setRenamingNoteCategoryId(null)}
                            className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded ${getSmallActionButtonClasses()}`}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center w-full">
                          <div 
                            className={`flex items-center flex-1 cursor-pointer hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded p-2 transition-colors`}
                            onClick={() => toggleNoteCategoryExpansion(category.name)}
                          >
                            <span className="mr-2 text-sm">
                              {expandedNoteCategories.has(category.name) ? '▼' : '▶'}
                            </span>
                            <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} select-none`} style={getTextSizeStyle('text-base')}>
                              {category.name} ({categoryNotes.length})
                            </span>
                          </div>
                          {/* Category action buttons - only show when expanded */}
                          {expandedNoteCategories.has(category.name) && (
                            <div className="flex gap-1 items-center ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startRenameNoteCategory(category.id);
                                }}
                                className={`bg-yellow-500 hover:bg-yellow-600 text-white rounded font-bold ${getSmallActionButtonClasses()}`}
                                title="Rename Category"
                              >
                                <img
                                  src="/edit.svg"
                                  alt="Edit"
                                  className="filter invert"
                                  style={getSmallActionIconSize()}
                                />
                              </button>
                              {category.id !== 'uncategorized' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNoteCategory(category.id);
                                  }}
                                  className={`bg-red-500 hover:bg-red-600 text-white rounded font-bold ${getSmallActionButtonClasses()}`}
                                  title="Delete Category"
                                >
                                  <img
                                    src="/delete-category.svg"
                                    alt="Delete Category"
                                    className="filter invert"
                                    style={getSmallActionIconSize()}
                                  />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {expandedNoteCategories.has(category.name) && (
                        <div className="ml-4 mt-2 space-y-2">
                          {categoryNotes.length > 0 ? (
                            categoryNotes.map((note) => (
                              <div
                                key={note.id}
                                className={`p-3 rounded-lg border transition-colors cursor-pointer ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                                onClick={() => selectNote(note)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h6 className="font-medium mb-1" style={getTextSizeStyle('text-sm')}>{note.title}</h6>
                                    <div className="flex items-center gap-2">
                                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={getTextSizeStyle('text-xs')}>
                                        {new Date(note.createdAt || note.timestamp).toLocaleDateString()}
                                      </span>
                                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={getTextSizeStyle('text-xs')}>
                                        {new Date(note.createdAt || note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 ml-2">
                                    {movingNoteId === note.id ? (
                                      <div className="flex gap-1 items-center">
                                        <select
                                          onChange={(e) => moveNoteToCategory(note.id, e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          onMouseDown={(e) => e.stopPropagation()}
                                          className={`px-2 py-1 border rounded text-xs ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                          style={getTextSizeStyle('text-xs')}
                                        >
                                          <option value="">Select category...</option>
                                          {noteCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                              {cat.name}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setMovingNoteId(null);
                                          }}
                                          className={`${getButtonSizeClasses(false)} rounded hover:${darkMode ? 'bg-gray-600' : 'bg-gray-500'} text-white transition-colors`}
                                          title="Cancel Move"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            editNote(note.id);
                                          }}
                                          className={`${getButtonSizeClasses(false)} rounded hover:${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white transition-colors`}
                                          title="Edit Note"
                                        >
                                          <img
                                            src="/edit.svg"
                                            alt="Edit"
                                            className="filter invert"
                                            style={getSmallActionIconSize()}
                                          />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setMovingNoteId(note.id);
                                          }}
                                          className={`${getButtonSizeClasses(false)} rounded hover:${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white transition-colors`}
                                          title="Move Note"
                                        >
                                          <img
                                            src="/move.svg"
                                            alt="Move"
                                            className="filter invert"
                                            style={getSmallActionIconSize()}
                                          />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                          }}
                                          className={`${getButtonSizeClasses(false)} rounded hover:${darkMode ? 'bg-red-600' : 'bg-red-500'} text-white transition-colors`}
                                          title="Delete Note"
                                        >
                                          <img
                                            src="/delete-chat.svg"
                                            alt="Delete"
                                            className="filter invert"
                                            style={getSmallActionIconSize()}
                                          />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={`pl-4 py-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>
                              No notes in this category yet
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                  }).filter(Boolean))}
                </div>
              </div>
          </div>
        )}

        {/* Search Panel - Only when expanded */}
        {showSearch && (
          <div className="flex-1 flex flex-col">
            {/* Search Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold" style={getTextSizeStyle('text-lg')}>Search</h3>
            </div>

            {/* Search Input */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search chats and notes..."
                  className={`px-3 py-2 border rounded text-sm flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className={`p-2 rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors`}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {searchQuery && filteredChats.length === 0 ? (
                <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No chats or notes found matching "{searchQuery}"
                </p>
              ) : searchQuery && filteredChats.length > 0 ? (
                <div className="space-y-2">
                  {filteredChats.map((item, index) => {
                    if (!item || !item.id) {
                      return null;
                    }

                    const isSelected = index === selectedSearchIndex;

                    if (item.type === 'note') {
                      return (
                        <div
                          key={`note-${item.id}`}
                          className={`${isSelected 
                            ? (darkMode ? 'bg-blue-800 border-blue-600' : 'bg-blue-100 border-blue-400')
                            : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                          } rounded-lg p-3 transition-colors cursor-pointer border-2 ${isSelected ? '' : 'border-transparent'}`}
                          onClick={() => selectSearchResult(item)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src="/notebook.svg"
                              alt="Note"
                              className={`${darkMode ? 'filter invert' : ''}`}
                              style={{ width: '12px', height: '12px' }}
                            />
                            <span className="font-medium" style={getTextSizeStyle('text-sm')}>{item.title}</span>
                          </div>
                          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`} style={getTextSizeStyle('text-xs')}>
                            {item.content.substring(0, 80)}{item.content.length > 80 ? '...' : ''}
                          </div>
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`} style={getTextSizeStyle('text-xs')}>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="mx-1">•</span>
                            <span>Note</span>
                            {item.category && (
                              <>
                                <span className="mx-1">•</span>
                                <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`} style={getTextSizeStyle('text-xs')}>
                                  {item.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      // Chat item
                      const chatTitle = item.name || (
                        item.conversation && item.conversation.length > 0
                          ? item.conversation[0].question?.substring(0, 40) + '...'
                          : item.question?.substring(0, 40) + '...' || 'Untitled Chat'
                      );

                      const turnCount = item.conversation ? item.conversation.length : 1;
                      const hasImages = item.conversation ?
                        item.conversation.some(turn => turn.has_image || turn.image_data) :
                        item.has_image;

                      return (
                        <div
                          key={`chat-${item.id}`}
                          className={`${isSelected 
                            ? (darkMode ? 'bg-blue-800 border-blue-600' : 'bg-blue-100 border-blue-400')
                            : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                          } rounded-lg p-3 transition-colors cursor-pointer border-2 ${isSelected ? '' : 'border-transparent'}`}
                          onClick={() => selectSearchResult(item)}
                        >
                          <div className="font-medium mb-1" style={getTextSizeStyle('text-sm')}>
                            {chatTitle}
                          </div>
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`} style={getTextSizeStyle('text-xs')}>
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="mx-1">•</span>
                            <span>{turnCount} turn{turnCount !== 1 ? 's' : ''}</span>
                            {hasImages && <span className="ml-2 text-blue-500">📷</span>}
                          </div>
                        </div>
                      );
                    }
                  }).filter(Boolean)}
                </div>
              ) : (
                <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Start typing to search through your chats and notes...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Chat List - Only when expanded */}
        {showChatList && (
          <div className="flex-1 flex flex-col">
            {/* Chats Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold" style={getTextSizeStyle('text-lg')}>Chats</h3>
            </div>

            {/* Add Category Button */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              {showAddCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        createCategory();
                      }
                    }}
                    placeholder="Category name"
                    className={`px-2 py-1 border rounded text-sm flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                  />
                  <button
                    onClick={createCategory}
                    className={`bg-green-500 text-white rounded hover:bg-green-600 ${getSmallActionButtonClasses()}`}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategoryName('');
                    }}
                    className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded ${getSmallActionButtonClasses()}`}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddCategory(true)}
                  className={`w-full p-2 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center gap-2 ${darkMode ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  title="Add Category"
                >
                  <img
                    src="/category.svg"
                    alt="Add Category"
                    className={`${darkMode ? 'filter invert' : ''}`}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={getTextSizeStyle('text-sm')}>Add Category</span>
                </button>
              )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {categories
                  .sort((a, b) => {
                    // Always put "Uncategorized" at the top
                    if (a.id === 'uncategorized') return -1;
                    if (b.id === 'uncategorized') return 1;
                    // Sort alphabetically for all other categories
                    return a.name.localeCompare(b.name);
                  })
                  .map((category) => {
                  const categoryChats = chats.filter(chat =>
                    (chat.category_id || 'uncategorized') === category.id
                  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                  return (
                    <div key={category.id} className="space-y-2">
                        {/* Category Header */}
                        {renamingCategoryId === category.id ? (
                          <div className="flex gap-1 items-center w-full">
                            <input
                              type="text"
                              value={categoryRenameValue}
                              onChange={(e) => setCategoryRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveRenameCategory(category.id);
                                }
                              }}
                              className={`px-2 py-1 border rounded text-sm flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              placeholder="Category name"
                            />
                            <button
                              onClick={() => saveRenameCategory(category.id)}
                              className={`bg-green-500 text-white rounded hover:bg-green-600 ${getSmallActionButtonClasses()}`}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setRenamingCategoryId(null)}
                              className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded ${getSmallActionButtonClasses()}`}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center w-full">
                            <div 
                              className={`flex items-center flex-1 cursor-pointer hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded p-2 transition-colors`}
                              onClick={() => toggleCategoryExpansion(category.id)}
                            >
                              <span className="mr-2 text-sm">
                                {expandedCategories.has(category.id) ? '▼' : '▶'}
                              </span>
                              <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} select-none`} style={getTextSizeStyle('text-base')}>
                                {category.name} ({categoryChats.length})
                              </span>
                            </div>
                            {/* Only show buttons when category is expanded */}
                            {expandedCategories.has(category.id) && (
                              <div className="flex gap-1 items-center ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startRenameCategory(category.id, category.name);
                                  }}
                                  className={`bg-yellow-500 hover:bg-yellow-600 text-white rounded font-bold ${getSmallActionButtonClasses()}`}
                                  title="Rename Category"
                                >
                                  <img
                                    src="/edit.svg"
                                    alt="Edit"
                                    className="filter invert"
                                    style={getSmallActionIconSize()}
                                  />
                                </button>
                                {category.id !== 'uncategorized' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteCategory(category.id);
                                    }}
                                    className={`bg-red-500 hover:bg-red-600 text-white rounded font-bold ${getSmallActionButtonClasses()}`}
                                    title="Delete Category"
                                  >
                                    <img
                                      src="/delete-category.svg"
                                      alt="Delete Category"
                                      className="filter invert"
                                      style={getSmallActionIconSize()}
                                    />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Category Chats - Only show when expanded */}
                        {expandedCategories.has(category.id) && (
                          <>
                            {categoryChats.length > 0 ? (
                              <div className="space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                                {categoryChats.map((chat) => {
                                  // Safety check for chat data
                                  if (!chat || !chat.id) {
                                    console.warn('Invalid chat data:', chat);
                                    return null;
                                  }

                                  const chatTitle = chat.name || (
                                    // New structure - use conversation array (use FIRST question for consistent title)
                                    chat.conversation && chat.conversation.length > 0
                                      ? chat.conversation[0].question?.substring(0, 40) + '...'
                                      // Old structure - use direct question field
                                      : chat.question?.substring(0, 40) + '...' || 'Untitled Chat'
                                  );

                                  const turnCount = chat.conversation ? chat.conversation.length : 1;
                                  const hasImages = chat.conversation ?
                                    chat.conversation.some(turn => turn.has_image || turn.image_data) :
                                    chat.has_image;

                                  return (
                                    <div key={chat.id} className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-3 transition-colors`}>
                                      <div
                                        className="cursor-pointer hover:text-blue-600 mb-2"
                                        onClick={() => selectChat(chat)}
                                      >
                                        <div className="font-medium mb-1" style={getTextSizeStyle('text-sm')}>
                                          {chatTitle}
                                        </div>
                                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`} style={getTextSizeStyle('text-xs')}>
                                          <span>{new Date(chat.timestamp).toLocaleDateString()}</span>
                                          <span className="mx-1">•</span>
                                          <span>{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                          <span className="mx-1">•</span>
                                          <span>{turnCount} turn{turnCount !== 1 ? 's' : ''}</span>
                                          {hasImages && <span className="ml-2 text-blue-500">📷</span>}
                                        </div>
                                      </div>
                                      <div className="flex gap-1">
                                        {renamingChatId === chat.id ? (
                                          <div className="flex gap-1 w-full">
                                            <input
                                              type="text"
                                              value={renameValue}
                                              onChange={(e) => setRenameValue(e.target.value)}
                                              className={`px-2 py-1 border rounded text-xs flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                              placeholder="Chat name"
                                            />
                                            <button
                                              onClick={() => saveRenameChat(chat.id)}
                                              className={`bg-green-500 text-white rounded hover:bg-green-600 ${getSmallActionButtonClasses()}`}
                                            >
                                              ✓
                                            </button>
                                            <button
                                              onClick={() => setRenamingChatId(null)}
                                              className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded ${getSmallActionButtonClasses()}`}
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ) : movingChatId === chat.id ? (
                                          <div className="flex gap-1 w-full">
                                            <select
                                              onChange={(e) => moveChatToCategory(chat.id, e.target.value)}
                                              onClick={(e) => e.stopPropagation()}
                                              onMouseDown={(e) => e.stopPropagation()}
                                              className={`px-2 py-1 border rounded flex-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                              style={getTextSizeStyle('text-sm')}
                                            >
                                              <option value="">Select category...</option>
                                              {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                  {cat.name}
                                                </option>
                                              ))}
                                            </select>
                                            <button
                                              onClick={() => setMovingChatId(null)}
                                              className={`${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded ${getSmallActionButtonClasses()}`}
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() => startRenameChat(chat.id, chat.name)}
                                              className={`bg-yellow-500 text-white rounded hover:bg-yellow-600 ${getSmallActionButtonClasses()}`}
                                              title="Rename Chat"
                                            >
                                              <img
                                                src="/edit.svg"
                                                alt="Edit"
                                                className="filter invert"
                                                style={getSmallActionIconSize()}
                                              />
                                            </button>
                                            <button
                                              onClick={() => setMovingChatId(chat.id)}
                                              className={`bg-blue-500 text-white rounded hover:bg-blue-600 ${getSmallActionButtonClasses()}`}
                                              title="Move Chat"
                                            >
                                              <img
                                                src="/move.svg"
                                                alt="Move"
                                                className="filter invert"
                                                style={getSmallActionIconSize()}
                                              />
                                            </button>
                                            <button
                                              onClick={() => deleteChat(chat.id)}
                                              className={`bg-red-500 text-white rounded hover:bg-red-600 ${getSmallActionButtonClasses()}`}
                                              title="Delete Chat"
                                            >
                                              <img
                                                src="/delete-chat.svg"
                                                alt="Delete Chat"
                                                className="filter invert"
                                                style={getSmallActionIconSize()}
                                              />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }).filter(Boolean)}
                              </div>
                            ) : (
                              <div className={`pl-4 py-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>
                                No chats in this category yet
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }).filter(Boolean)}
              </div>
            </div>
          </div>
        )}

        {/* Image Browser - Only when expanded */}
        {showImageBrowser && (
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold" style={getTextSizeStyle('text-lg')}>Browse Images</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {(() => {
                // Collect all images from all chats, organized by category
                const imagesByCategory = {};
                
                categories.forEach(category => {
                  const categoryChats = chats.filter(chat =>
                    (chat.category_id || 'uncategorized') === category.id
                  );
                  
                  const categoryImages = [];
                  categoryChats.forEach(chat => {
                    if (chat.conversation) {
                      chat.conversation.forEach((turn, turnIndex) => {
                        if (turn.image_data) {
                          categoryImages.push({
                            image_data: turn.image_data,
                            chat: chat,
                            turnIndex: turnIndex,
                            question: turn.question?.substring(0, 60) + '...',
                            timestamp: turn.timestamp
                          });
                        }
                      });
                    } else if (chat.image_data) {
                      // Old structure
                      categoryImages.push({
                        image_data: chat.image_data,
                        chat: chat,
                        turnIndex: 0,
                        question: chat.question?.substring(0, 60) + '...',
                        timestamp: chat.timestamp
                      });
                    }
                  });

                  if (categoryImages.length > 0) {
                    imagesByCategory[category.name] = categoryImages.sort((a, b) => 
                      new Date(b.timestamp) - new Date(a.timestamp)
                    );
                  }
                });

                if (Object.keys(imagesByCategory).length === 0) {
                  return (
                    <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={getTextSizeStyle('text-sm')}>
                      No images found in your conversations yet.
                    </p>
                  );
                }

                return (
                  <div className="space-y-4">
                    {Object.entries(imagesByCategory).map(([categoryName, images]) => (
                      <div key={categoryName} className="space-y-2">
                        <div className="flex items-center w-full">
                          <div 
                            className={`flex items-center flex-1 cursor-pointer hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded p-2 transition-colors`}
                            onClick={() => toggleImageCategoryExpansion(categoryName)}
                          >
                            <span className="mr-2 text-sm">
                              {expandedImageCategories.has(categoryName) ? '▼' : '▶'}
                            </span>
                            <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} select-none`} style={getTextSizeStyle('text-base')}>
                              {categoryName} ({images.length} image{images.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        </div>
                        
                        {expandedImageCategories.has(categoryName) && (
                          <div className="pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                            <div className="grid grid-cols-2 gap-2">
                              {images.map((imageInfo, index) => (
                                <div 
                                  key={index}
                                  className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-2 transition-colors cursor-pointer`}
                                  onClick={() => selectImageFromBrowser(imageInfo.chat, imageInfo.turnIndex)}
                                >
                                  <img
                                    src={imageInfo.image_data}
                                    alt="Conversation image"
                                    className="w-full h-20 object-cover rounded mb-2"
                                  />
                                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={getTextSizeStyle('text-xs')}>
                                    <div className="font-medium mb-1 truncate">
                                      {imageInfo.question}
                                    </div>
                                    <div>
                                      {new Date(imageInfo.timestamp).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-screen" style={{
        marginLeft: showChatList || showSettings || showImageBrowser || showPersonalities || showNotes || showSearch || showAnalysis ? '320px' : getCollapsedSidebarWidth(),
        width: showChatList || showSettings || showImageBrowser || showPersonalities || showNotes || showSearch || showAnalysis ? 'calc(100% - 320px)' : `calc(100% - ${getCollapsedSidebarWidth()})`,
        transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
        position: 'absolute',
        top: 0,
        right: 0
      }}>
        {/* Top Header */}
        <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`} style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderColor: darkMode ? '#374151' : '#e5e7eb',
          color: darkMode ? '#ffffff' : '#111827'
        }}>
          <div className="flex items-center justify-between">
            <img 
              src="/oask-logo.png" 
              alt="O/ASK" 
              className="h-32 w-auto"
              style={{
                maxHeight: '8rem',
                height: 'auto',
                width: 'auto'
              }}
            />
          </div>
        </div>

        {/* Input Form - Fixed at top */}
        <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`} style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderColor: darkMode ? '#374151' : '#e5e7eb',
          color: darkMode ? '#ffffff' : '#111827'
        }}>
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  className={`w-full p-2 border rounded resize-none pr-12 ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  style={getTextSizeStyle('text-base')}
                  placeholder={currentChatId ? "Continue the conversation..." : "Ask or discuss anything (offline!)..."}
                  value={text}
                  onChange={handleTextChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
                      e.preventDefault();
                      handleSubmit(e);
                    } else if (e.key === 'Tab' && showSuggestion) {
                      e.preventDefault();
                      acceptSuggestion();
                    } else if (e.key === 'Escape') {
                      setShowSuggestion(false);
                    }
                  }}
                  rows={4}
                />
                
                {/* Prompt suggestion */}
                {showSuggestion && promptSuggestion && (
                <div className={`absolute top-full left-0 right-0 mt-1 p-2 border rounded shadow-lg z-10 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-1 opacity-75" style={getTextSizeStyle('text-xs')}>Suggestion (press Tab to accept):</div>
                      <div style={getTextSizeStyle('text-sm')}>{promptSuggestion}</div>
                    </div>
                    <button
                      type="button"
                      onClick={acceptSuggestion}
                      className={`ml-2 ${getButtonPaddingForText('px-2 py-1')} rounded ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      style={getTextSizeStyle('text-xs')}
                    >
                      Use
                    </button>
                  </div>
                </div>
              )}
            </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => setImage(e.target.files[0])}
                    className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} ${getButtonSizeClasses(false)}`}
                    style={getTextSizeStyle('text-base')}
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className={`p-1 rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors`}
                      title="Remove selected file"
                    >
                      <img
                        src="/delete-chat.svg"
                        alt="Remove file"
                        className={`${darkMode ? 'filter invert' : ''}`}
                        style={{ width: '16px', height: '16px' }}
                      />
                    </button>
                  )}
                </div>

                {/* Personality Dropdown */}
                <div className="relative flex items-center gap-2" ref={personalityDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowPersonalityDropdown(!showPersonalityDropdown)}
                    className={`rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} hover:${darkMode ? 'bg-gray-600' : 'bg-gray-50'} transition-colors ${getButtonPaddingForText('px-4 py-2')} flex items-center gap-2`}
                    style={getTextSizeStyle('text-base')}
                  >
                    <img
                      src="/personality.svg"
                      alt="Personality"
                      className={`${darkMode ? 'filter invert' : ''}`}
                      style={getIconSize(false)}
                    />
                    {personalities.find(p => p.id === selectedPersonality)?.name || 'Choose Personality'}
                  </button>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={getTextSizeStyle('text-sm')}>
                    -- Choose a personality
                  </span>
                  
                  {showPersonalityDropdown && (
                    <div className={`absolute bottom-full mb-2 left-0 w-48 max-h-64 overflow-y-auto rounded-lg border shadow-lg z-10 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                      {personalities.map((personality) => (
                        <button
                          key={personality.id}
                          type="button"
                          onClick={() => {
                            setSelectedPersonality(personality.id);
                            setShowPersonalityDropdown(false);
                          }}
                          className={`w-full text-left ${getButtonPaddingForText('px-4 py-2')} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors ${selectedPersonality === personality.id ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                        >
                          <div className="font-medium" style={getTextSizeStyle('text-base')}>{personality.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {loading && (
                    <button
                      type="button"
                      onClick={stopThinking}
                      className={`bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-2 ${getButtonPaddingForText('px-4 py-2')}`}
                      style={getTextSizeStyle('text-base')}
                      title="Stop AI Processing"
                    >
                      <img
                        src="/stop.svg"
                        alt="Stop"
                        className="filter invert"
                        style={getIconSize(false)}
                      />
                      <span>Stop</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    className={`bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonPaddingForText('px-4 py-2')}`}
                    style={getTextSizeStyle('text-base')}
                    disabled={loading}
                  >
                    {loading ? 'Thinking...' : (currentChatId ? 'Continue Chat' : 'O/ASK it!')}
                  </button>
                </div>
              </div>

              {loading && (
                <div className={`p-4 ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} rounded shadow`}>
                  <p>Processing your request...</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Conversation History - Scrollable */}
        <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`} style={{
          backgroundColor: darkMode ? '#111827' : '#f3f4f6',
          color: darkMode ? '#ffffff' : '#111827'
        }}>
          <div className="max-w-4xl mx-auto p-4">
            {/* Show selected note if one is selected */}
            {selectedNote && (
              <div className={`note-display border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 mb-4`}>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={getTextSizeStyle('text-xl')}>
                      {selectedNote.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={getTextSizeStyle('text-sm')}>
                        {selectedNote.category}
                      </span>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={getTextSizeStyle('text-sm')}>
                        {new Date(selectedNote.createdAt || selectedNote.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={getTextSizeStyle('text-base')}>
                    {selectedNote.content}
                  </div>
                  
                  {/* Copy Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedNote.content);
                        // You could add a toast notification here if desired
                      }}
                      className={`flex items-center gap-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} ${buttonSize === 'extra-large' ? 'px-4 py-3' : buttonSize === 'large' ? 'px-3.5 py-2.5' : 'px-3 py-2'}`}
                      title="Copy note content"
                    >
                      <img
                        src="/copy.svg"
                        alt="Copy"
                        className={`${darkMode ? 'filter invert' : ''}`}
                        style={getIconSize(false)}
                      />
                      <span style={getTextSizeStyle('text-sm')}>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show current response if loading or we have a response */}
            {(loading || response) && (
              <div className={`conversation-turn-current border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 mb-4`}>
                {/* User Question (current input) */}
                <div className={`mb-3 p-3 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {loading ? 'Now' : 'Recently'}
                    {image && <span className="ml-2 text-blue-500">📷</span>}
                  </div>
                  <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>You:</strong> {currentQuestion}
                  </div>
                  {/* Display attached file if available */}
                  {image && (
                    <div className="mt-2">
                      {(() => {
                        const fileInfo = getFileTypeInfo(image);
                        if (fileInfo?.canPreview && fileInfo.type === 'image') {
                          return (
                            <img
                              src={URL.createObjectURL(image)}
                              alt="Uploading image"
                              className="max-w-full h-auto rounded border border-gray-300 shadow-sm"
                              style={{ maxHeight: '200px' }}
                            />
                          );
                        } else {
                          return (
                            <div className={`p-3 rounded border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'} flex items-center gap-2`}>
                              <span className="text-2xl">{fileInfo?.icon || '📎'}</span>
                              <div>
                                <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {image.name}
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {fileInfo?.type || 'file'} • {(image.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>

                {/* AI Response */}
                <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`} style={getTextSizeStyle('text-sm')}>
                    O/ASK: {loading && <span className="animate-pulse">●</span>}
                  </div>
                  <div className={`whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={getTextSizeStyle('text-base')}>
                    {response}
                    {loading && <span className="animate-pulse">|</span>}
                  </div>
                  {/* Copy button for response */}
                  {response && !loading && (
                    <div className="mt-2">
                      <button
                        onClick={() => copyToClipboard(response)}
                        className={`rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} ${getButtonPaddingForText('px-2 py-1')}`}
                        style={getTextSizeStyle('text-xs')}
                        title="Copy response"
                      >
                        <img
                          src="/copy.svg"
                          alt="Copy"
                          className={`${darkMode ? 'filter invert' : ''}`}
                          style={{...getIconSize(false), marginRight: '4px'}}
                        />
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentConversation.length > 0 ? (
              <div className="space-y-4">
                {currentConversation
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort most recent first
                  .map((turn, index) => (
                    <div key={index} className={`conversation-turn-${index} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 last:border-b-0`}>
                      {/* User Question */}
                      <div className={`mb-3 p-3 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`} style={getTextSizeStyle('text-sm')}>
                          {new Date(turn.timestamp).toLocaleString()}
                          {turn.has_image && <span className="ml-2 text-blue-500">📷</span>}
                        </div>
                        <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={getTextSizeStyle('text-base')}>
                          <strong>You:</strong> {turn.question}
                        </div>
                        {/* Display attached image if available */}
                        {turn.image_data && (
                          <div className="mt-2">
                            <img
                              src={turn.image_data}
                              alt="Uploaded image"
                              className="max-w-full h-auto rounded border border-gray-300 shadow-sm"
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        )}
                      </div>

                      {/* AI Response */}
                      <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`} style={getTextSizeStyle('text-sm')}>O/ASK:</div>
                        <div className={`whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={getTextSizeStyle('text-base')}>
                          {turn.response}
                        </div>
                        {/* Copy button for conversation response */}
                        <div className="mt-2">
                          <button
                            onClick={() => copyToClipboard(turn.response)}
                            className={`rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} ${getButtonPaddingForText('px-2 py-1')}`}
                            style={getTextSizeStyle('text-xs')}
                            title="Copy response"
                          >
                            <img
                              src="/copy.svg"
                              alt="Copy"
                              className={`${darkMode ? 'filter invert' : ''}`}
                              style={{...getIconSize(false), marginRight: '4px'}}
                            />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              // Only show filler text if we're not loading and don't have a current response
              !(loading || (response && currentQuestion)) && (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="mb-2" style={getTextSizeStyle('text-lg')}> Thank you for using O/ASK! Send feedback to hello@oask.ai when you are online again.</p>
                  <p style={getTextSizeStyle('text-base')}> O/ASK is an offline, privacy-first, multi-modal AI multitool powered by Google's Gemma 3n-E4B-it.</p>
                  <p style={getTextSizeStyle('text-base')}> Attach documents, images, audio or video and discuss it using your CPU without internet.</p>
                  <p style={getTextSizeStyle('text-base')}> Customize and add personalities to suit your discussion needs or workflow.</p>
                
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
