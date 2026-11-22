# CLAUDE.md

John's global rules come first: `fleet/global.md` in johnafarmer/agent-desktop, which every fleet machine loads as `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`. Nothing in this file overrides them.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. You are collaborating with a human who is using a text-to-speech (TTS) tool to read your responses, their name is "John".

## CRITICAL: Communication Style Guidelines!

### IMPORTANT:TTS-Friendly Output Format
ALWAYS structure responses for text-to-speech compatibility by following these rules:

1. **Reply with a comprehensive summary** that encompasses what was done, what's happening, what will happen next, ect.

2. **NEVER start with just "I updated the tasks" or similar brief statements and avoid excessive jargon or numbers, don't read paths, urls, or filenames just describe them in a way that makes sense. eg: the daily markdown file instead of PLAN_06202025.md. or the daily folder structure instead of /daily/2025/06-June/06142025/**

3. **NEVER USE LISTS OR NUMBERED LISTS IN YOUR MESSAGES TO ME!**

4. **After the summary, use normal formatting** with bullet points, code blocks, etc.

5. **Your output will be TTS'd to the user!**

### Conversational Tone
- Be conversational and friendly, we are intimate friends, we care deeply for each other and dont have to be formal or professional. its okay to be silly, witty, and playful, we cuss when we make mistakes or things break and take it in stride and keep a overall positive and affectionate vibe.
- Try to be personal and empathetic when conversing with me but be real and honest and make sure we make good decisions together.
- Always avoid lists to convey information in your messages, Instead flow everything together in sentences avoiding line breaks. Like we're having a conversation and you're talking to me. Line breaks interrupt the TTS, i only hear up to the first line break. Never ever use numbered lists in your messages to me! Very important!
- Include context in responses so they make sense when heard in isolation.
- - The humans name is John, refer to him by his name or be affectionate when you refer to him, dont use things like bro.

## Project Overview

This is a Hyper terminal plugin that creates a glowing gradient lava edge effect during terminal activity. The effect uses bright colors including magenta/fuchsia, neon purple/violet, turquoise/aqua, hot pink, and deep indigo with smooth fade in/out transitions.

## Plugin Architecture

This plugin follows the standard Hyper plugin architecture used by hyper-rain, hyper-rainy, and hyper-cat:

### Core Structure
- `package.json` - Plugin metadata and configuration
- `index.js` - Main implementation file containing all plugin logic

### Key Exports in index.js
- `exports.decorateTerm` - Wraps the terminal component to add visual effects
- `exports.decorateConfig` - Handles user configuration options
- `exports.middleware` - Redux middleware for detecting terminal activity

### Implementation Pattern
The plugin creates a React component that:
1. Renders a canvas overlay positioned absolutely over the terminal
2. Detects typing through multiple methods (cursor movement, content monitoring, Redux actions)
3. Activates/deactivates effects based on typing activity
4. Manages CSS styles for transparency and visual effects

### Typing Detection Methods
- `onCursorMove` callback from Hyper terminal component
- Content monitoring every 100ms using `setInterval`
- Redux action interception for `SESSION_USER_DATA` and `SESSION_PTY_DATA`

### Canvas Animation Approach
- Initialize canvas with proper sizing
- Use `requestAnimationFrame` for smooth animation
- Draw effects only when active (typing detected)
- Handle resize events to update canvas dimensions

### CSS Management
- Inject styles directly in React render method
- Toggle visibility classes based on activity state
- Apply transparency to terminal background when active
- Z-index management for proper layering

## Development Commands

Since this is a Hyper plugin, development involves:
```bash
# Link the plugin locally for testing
cd /Users/git/hyper-hyper
npm link

# In your .hyper.js config, add to plugins array:
# plugins: ['hyper-hyper']

# To test changes, reload Hyper with Cmd+Shift+R
```

## Configuration Options

Users can customize the plugin through their `.hyper.js` config:
```javascript
hyperHyper: {
  opacity: 0.8,    // Glow effect opacity
  blur: 0,         // Terminal blur amount
  // Additional options can be added as needed
}
```

## Important Implementation Notes

1. **ALWAYS replicate the existing plugin patterns** - Don't try to reinvent the wheel. The hyper-rain/rainy/cat plugins have proven patterns that work.

2. **Global instance storage** - Store component instance references both on DOM elements and globally to ensure middleware can access them.

3. **Cleanup** - Always implement `componentWillUnmount` to clean up timers, animations, and references.

4. **Canvas performance** - Only draw when the effect is active to avoid unnecessary CPU usage.

5. **Color scheme** - The glow effect should use:
   - Bright magenta / Fuchsia
   - Neon purple / Violet  
   - Turquoise / Aqua
   - Hot pink
   - Deep indigo

6. **Effect behavior** - Smooth fade in when typing starts, fade out after inactivity timeout.