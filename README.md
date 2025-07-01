# hyper-hyper

A Hyper terminal plugin that creates a thin, glowing electric blue frame with neon orange accents around your terminal during typing activity.

![hyper-hyper](https://user-images.githubusercontent.com/placeholder/hyper-hyper-demo.gif)

## Features

- Thin 2px animated border that activates when typing
- Electric blue gradient with neon orange highlights
- Subtle wave animations that make the frame feel alive
- Smooth fade in/out transitions
- Minimal performance impact
- Customizable opacity and blur settings

## Installation

### From npm (when published)

```bash
hyper install hyper-hyper
```

### Local Development Install

For local development or testing before publishing:

1. Clone this repository or download the plugin files:
```bash
git clone https://github.com/yourusername/hyper-hyper.git
cd hyper-hyper
```

2. Create a symbolic link to your Hyper plugins folder:
```bash
# macOS/Linux
ln -s $(pwd) ~/.hyper_plugins/local/hyper-hyper

# Windows (run as administrator)
mklink /D "%USERPROFILE%\.hyper_plugins\local\hyper-hyper" "%CD%"
```

3. Add the plugin to your `.hyper.js` config file:
```javascript
module.exports = {
  // ... other config
  
  plugins: [
    // ... other plugins
    'hyper-hyper'
  ],
  
  // Optional configuration
  hyperHyper: {
    opacity: 0.8,  // Frame opacity (0-1)
    blur: 0        // Terminal blur when active (pixels)
  }
};
```

4. Reload Hyper:
   - **macOS/Linux**: `Cmd+Shift+R` or `Ctrl+Shift+R`
   - **Windows**: `Ctrl+Shift+R`

## Configuration

You can customize hyper-hyper through your `.hyper.js` config:

```javascript
module.exports = {
  config: {
    // ... other config
    
    hyperHyper: {
      opacity: 0.8,  // Frame opacity (default: 0.8)
      blur: 0        // Blur effect on terminal (default: 0)
    }
  }
};
```

## Troubleshooting

### Plugin not loading
- Make sure the plugin is properly linked or installed
- Check the Hyper DevTools console for errors (`View` → `Developer` → `Developer Tools`)
- Verify the plugin is listed in your `.hyper.js` config

### Performance issues
- Try reducing the opacity setting
- Disable the blur effect by setting it to 0

## Development

To modify the plugin:

1. Edit the files in your local plugin directory
2. Reload Hyper with `Cmd+Shift+R` (macOS) or `Ctrl+Shift+R` (Windows/Linux)
3. Check the console for any errors

## License

MIT

## Author

Created with 💙 by John

---

Inspired by the electric aesthetics of cyberpunk and the need for subtle terminal bling.
