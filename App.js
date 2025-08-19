import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const App = () => {
  const [hooks, setHooks] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('productivity');
  const [selectedMood, setSelectedMood] = useState('motivational');
  const [selectedLength, setSelectedLength] = useState('short');
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  const topics = [
    'productivity', 'self-improvement', 'relationships', 'health', 'success',
    'mindfulness', 'creativity', 'leadership', 'finance', 'technology',
    'motivation', 'happiness', 'career', 'education', 'lifestyle'
  ];

  const moods = [
    'motivational', 'inspirational', 'thought-provoking', 'humorous',
    'controversial', 'educational', 'emotional', 'practical'
  ];

  const lengths = [
    { value: 'short', label: 'Short (1-2 sentences)', max: 2 },
    { value: 'medium', label: 'Medium (3-4 sentences)', max: 4 },
    { value: 'long', label: 'Long (5+ sentences)', max: 6 }
  ];

  const hookTemplates = {
    productivity: {
      motivational: [
        "The most productive people don't manage time - they manage energy.",
        "Your Monday morning routine determines your entire week's success.",
        "Stop saying 'I don't have time' - you have 24 hours just like everyone else.",
        "The 2-minute rule changed my life: if it takes less than 2 minutes, do it now.",
        "Procrastination is just fear wearing a disguise."
      ],
      thought_provoking: [
        "What if being busy is actually the enemy of being productive?",
        "Are we optimizing for looking productive or actually being productive?",
        "The paradox: the more tools we have for productivity, the less productive we become.",
        "Is multitasking a superpower or the greatest lie we tell ourselves?"
      ],
      practical: [
        "Here's the productivity system that actually works: 1) Write it down 2) Prioritize ruthlessly 3) Execute without excuses.",
        "Three questions that will revolutionize your day: What's urgent? What's important? What can wait?",
        "The Pomodoro Technique isn't just about 25-minute chunks - it's about single-tasking in a multitasking world."
      ]
    },
    relationships: {
      emotional: [
        "The people who truly care about you won't make you question where you stand.",
        "Loneliness isn't about being alone - it's about feeling disconnected from people around you.",
        "Sometimes the most loving thing you can do is let someone go.",
        "Your vibe attracts your tribe - but are you being authentic to attract the right people?"
      ],
      practical: [
        "Three signs it's time to end a friendship: 1) They only call when they need something 2) You feel drained after seeing them 3) They don't celebrate your wins.",
        "The best relationships aren't perfect - they're honest about their imperfections.",
        "Communication isn't just about talking - it's about making the other person feel heard."
      ]
    },
    success: {
      motivational: [
        "Success isn't about being the smartest person in the room - it's about being the most persistent.",
        "Your biggest competitor isn't other people - it's who you were yesterday.",
        "Overnight success is a myth. It usually takes 10 years to become an overnight sensation.",
        "The gap between where you are and where you want to be is bridged by your habits."
      ],
      controversial: [
        "Unpopular opinion: Most people fail not because they lack talent, but because they can't handle success.",
        "The biggest lie we tell ourselves: 'I'll be happy when I'm successful.'",
        "Success without fulfillment is the ultimate failure."
      ]
    },
    mindfulness: {
      inspirational: [
        "The present moment is the only time over which we have dominion.",
        "Meditation isn't about stopping thoughts - it's about not letting them stop you.",
        "Your mind is like water - when agitated, difficult to see; when calm, everything becomes clear.",
        "The gap between stimulus and response is where your power lies."
      ],
      practical: [
        "Try this: Before checking your phone in the morning, take 5 deep breaths. Notice how it changes your entire day.",
        "Mindfulness isn't about perfection - it's about awareness without judgment."
      ]
    }
  };

  const getRandomHook = useCallback(() => {
    const currentTopic = customTopic || selectedTopic;
    const topicHooks = hookTemplates[selectedTopic] || {};
    const moodHooks = topicHooks[selectedMood] || topicHooks['motivational'] || [];
    
    if (moodHooks.length === 0) {
      return generateCustomHook(currentTopic, selectedMood, selectedLength);
    }
    
    const randomHook = moodHooks[Math.floor(Math.random() * moodHooks.length)];
    return customTopic ? randomHook.replace(selectedTopic, customTopic) : randomHook;
  }, [selectedTopic, selectedMood, selectedLength, customTopic]);

  const generateCustomHook = (topic, mood, length) => {
    const starters = {
      motivational: ["The key to", "Success in", "Master", "Transform your"],
      inspirational: ["Imagine if", "What if", "The secret to", "Discover how"],
      thought_provoking: ["Why do we", "What if", "Is it possible that", "Consider this:"],
      humorous: ["Nobody talks about", "The truth about", "Let's be honest about"],
      controversial: ["Unpopular opinion:", "Nobody wants to hear this:", "The hard truth about"],
      educational: ["Here's what I learned about", "The science behind", "Understanding"],
      practical: ["Here's how to", "The simple way to", "Three steps to", "Try this for"]
    };
    
    const endings = {
      short: ["isn't what you think.", "changes everything.", "is simpler than you imagine."],
      medium: ["requires a mindset shift that most people never make.", "depends on one crucial factor that everyone overlooks."],
      long: ["is a journey that starts with a single decision but requires consistent action every single day."]
    };
    
    const starter = starters[mood][Math.floor(Math.random() * starters[mood].length)];
    const ending = endings[length][Math.floor(Math.random() * endings[length].length)];
    
    return `${starter} ${topic} ${ending}`;
  };

  const generateHooks = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newHooks = [];
      const count = selectedLength === 'short' ? 5 : selectedLength === 'medium' ? 4 : 3;
      
      for (let i = 0; i < count; i++) {
        newHooks.push({
          id: Date.now() + i,
          text: getRandomHook(),
          topic: customTopic || selectedTopic,
          mood: selectedMood,
          timestamp: new Date().toISOString()
        });
      }
      
      setHooks(newHooks);
      setIsGenerating(false);
    }, 1500);
  };

  const addToFavorites = (hook) => {
    if (!favorites.find(fav => fav.id === hook.id)) {
      setFavorites(prev => [...prev, hook]);
    }
  };

  const removeFromFavorites = (hookId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== hookId));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const filteredFavorites = favorites.filter(hook => 
    hook.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hook.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const savedFavorites = localStorage.getItem('viralHookFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viralHookFavorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎣 Viral Hook Generator</h1>
        <p>Generate compelling hooks for your social media content</p>
      </header>

      <main className="main-content">
        <div className="generator-section">
          <div className="controls">
            <div className="control-group">
              <label>Topic</label>
              <select 
                value={selectedTopic} 
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setCustomTopic('');
                }}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Custom Topic (Optional)</label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter your own topic..."
              />
            </div>

            <div className="control-group">
              <label>Mood</label>
              <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Length</label>
              <select value={selectedLength} onChange={(e) => setSelectedLength(e.target.value)}>
                {lengths.map(length => (
                  <option key={length.value} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={generateHooks} 
              disabled={isGenerating}
              className="generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate Hooks'}
            </button>
          </div>

          <div className="results">
            {isGenerating && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Crafting your viral hooks...</p>
              </div>
            )}

            {hooks.length > 0 && !isGenerating && (
              <div className="hooks-list">
                <h3>Generated Hooks</h3>
                {hooks.map(hook => (
                  <div key={hook.id} className="hook-card">
                    <p className="hook-text">{hook.text}</p>
                    <div className="hook-meta">
                      <span className="hook-topic">{hook.topic}</span>
                      <span className="hook-mood">{hook.mood}</span>
                    </div>
                    <div className="hook-actions">
                      <button onClick={() => copyToClipboard(hook.text)}>Copy</button>
                      <button onClick={() => addToFavorites(hook)}>⭐ Save</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="favorites-section">
          <h3>Saved Hooks</h3>
          
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your saved hooks..."
            />
          </div>

          <div className="favorites-list">
            {filteredFavorites.length === 0 ? (
              <p className="empty-state">
                {searchTerm ? 'No hooks match your search.' : 'No saved hooks yet. Generate some hooks and save your favorites!'}
              </p>
            ) : (
              filteredFavorites.map(hook => (
                <div key={hook.id} className="hook-card favorite">
                  <p className="hook-text">{hook.text}</p>
                  <div className="hook-meta">
                    <span className="hook-topic">{hook.topic}</span>
                    <span className="hook-mood">{hook.mood}</span>
                    <span className="hook-timestamp">
                      {new Date(hook.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="hook-actions">
                    <button onClick={() => copyToClipboard(hook.text)}>Copy</button>
                    <button 
                      onClick={() => removeFromFavorites(hook.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ for content creators</p>
      </footer>
    </div>
  );
};

export default App;
