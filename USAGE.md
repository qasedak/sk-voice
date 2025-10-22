# SK Voice - Quick Start Guide

## Installation Steps

1. **Upload Plugin**
   ```
   - Go to WordPress Admin > Plugins > Add New
   - Click "Upload Plugin"
   - Choose the sk-voice.zip file
   - Click "Install Now"
   - Activate the plugin
   ```

2. **Or Manual Installation**
   ```
   - Extract sk-voice folder
   - Upload to /wp-content/plugins/
   - Activate via WordPress admin
   ```

## Usage Example

### Creating Your First Audio Visualization

1. **Create/Edit a Page or Post**
   - Go to Pages > Add New (or edit existing)
   - Click the "+" to add a block
   - Search for "Audio" block
   - Add the Audio block

2. **Add Your Audio File**
   - Click "Upload" or "Media Library"
   - Select your audio file (MP3, WAV, OGG)
   - The audio player will appear

3. **Enable Visualization**
   - With the Audio block selected, look at the right sidebar
   - Scroll down to find "SK Voice Visualization" panel
   - Toggle "Enable Visualization" to ON
   - The visualization canvas will appear above your audio player

4. **Customize (Optional)**
   ```
   Wave Style: iOS 9 (recommended for modern look)
   Amplitude: 1.5 (for more dramatic waves)
   Speed: 0.2 (default smooth animation)
   Height: 200px (adjust to your design)
   Autostart: OFF (waves start when audio plays)
   ```

5. **Publish and Test**
   - Click "Publish" or "Update"
   - View your page
   - Click play on the audio
   - Watch the waves dance to your music! 🎵

## Configuration Examples

### Subtle Background Effect
```
Wave Style: iOS Classic
Amplitude: 0.5
Speed: 0.1
Height: 150px
```

### Dramatic Music Visualization
```
Wave Style: iOS 9
Amplitude: 2.5
Speed: 0.3
Height: 300px
```

### Podcast Player
```
Wave Style: iOS 9
Amplitude: 1.0
Speed: 0.15
Height: 180px
Autostart: Yes
```

### Ambient Sound
```
Wave Style: iOS Classic
Amplitude: 0.8
Speed: 0.05
Height: 120px
```

## Troubleshooting

### Visualization Not Appearing?
1. Make sure "Enable Visualization" is toggled ON
2. Check browser console for errors (F12)
3. Ensure SiriWave library is loading (check Network tab)
4. Try refreshing the page

### Waves Not Moving?
1. Ensure audio is actually playing
2. Check browser console for Web Audio API errors
3. Try a different audio file
4. Some browsers require user interaction before audio plays

### Performance Issues?
1. Reduce the Height setting
2. Lower the Amplitude value
3. Decrease Speed slightly
4. Check if other plugins are conflicting

## Browser Requirements

- **Minimum Requirements:**
  - Chrome 34+
  - Firefox 25+
  - Safari 7+
  - Edge 12+

- **Features Used:**
  - Web Audio API
  - Canvas API
  - ES6 JavaScript

## Tips for Best Results

1. **Audio Quality**: Higher quality audio files produce better visualizations
2. **Background Colors**: The visualization includes beautiful gradients that work with most themes
3. **Mobile**: Test on mobile devices - height adjusts automatically
4. **Multiple Audio Players**: You can add multiple audio blocks with different visualizations on the same page
5. **Integration**: Works great with audio podcasts, music players, sound effects, etc.

## Advanced Customization

If you want to customize colors or styles further, you can:

1. **Override CSS**: Add custom CSS to your theme
   ```css
   .sk-voice-visualization {
       background: your-custom-gradient !important;
   }
   ```

2. **Custom Gradients**: Edit `assets/css/frontend.css`
   ```css
   .sk-voice-wrapper[data-style="ios9"] .sk-voice-visualization {
       background: linear-gradient(your colors);
   }
   ```

## Support

For issues, feature requests, or contributions:
- GitHub: https://github.com/qasedak/sk-voice
- Issues: https://github.com/qasedak/sk-voice/issues

## What's Next?

Future features being considered:
- Custom color picker
- More wave styles
- Frequency band visualization
- Spectrum analyzer option
- Save presets
- Animation patterns

Enjoy creating amazing audio experiences! 🎵✨
