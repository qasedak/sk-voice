# SK Voice - WordPress Audio Visualization Plugin

Add beautiful voice visualizations to your WordPress audio blocks using SiriWave library.

## Features

- **Extends Core Audio Block**: Seamlessly integrates with WordPress's native audio block in FSE
- **Multiple Wave Styles**: Choose between iOS Classic and iOS 9 wave styles
- **Real-time Audio Analysis**: Uses Web Audio API to analyze audio and animate waves in real-time
- **Customizable Settings**: 
  - Wave style (iOS, iOS9)
  - Amplitude (0.1 - 5)
  - Speed (0.01 - 1)
  - Height (100px - 500px)
  - Autostart option
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatically adapts to dark mode preferences

## Installation

1. Upload the `sk-voice` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Edit any page/post with the Block Editor
4. Add or edit an Audio block
5. In the block settings sidebar, expand "SK Voice Visualization"
6. Enable visualization and customize settings

## Usage

### Basic Usage

1. **Add an Audio Block** to your page or post
2. Upload or select an audio file
3. In the block sidebar, find **"SK Voice Visualization"** panel
4. Toggle **"Enable Visualization"** to ON
5. Customize the appearance:
   - **Wave Style**: Choose between iOS Classic or iOS 9
   - **Amplitude**: Control the height of the waves (1 is default)
   - **Speed**: Control animation speed (0.2 is default)
   - **Height**: Set visualization canvas height in pixels
   - **Autostart Animation**: Start animation when page loads

### Settings Explained

- **Wave Style**:
  - **iOS Classic**: Traditional sine wave style
  - **iOS 9**: Modern fluorescent wave style (recommended)

- **Amplitude** (0.1 - 5): 
  - Controls how high the waves go
  - Higher values = more dramatic animations
  - Reacts to audio frequencies

- **Speed** (0.01 - 1):
  - Controls animation speed
  - Higher values = faster movement
  - 0.2 is a good default

- **Height** (100 - 500px):
  - Canvas height for visualization
  - Adjust based on your design needs
  - Responsive on mobile devices

- **Autostart**:
  - Enable to start animation on page load
  - Animation follows audio playback

## How It Works

The plugin uses:
1. **WordPress Block Filters** to extend the core/audio block
2. **SiriWave Library** for wave visualization
3. **Web Audio API** for real-time audio frequency analysis
4. **Canvas API** for rendering animations

When audio plays, the plugin analyzes frequency data and adjusts wave amplitude in real-time, creating a dynamic visualization that responds to the music.

## Browser Compatibility

- Modern browsers with Web Audio API support
- Chrome 34+
- Firefox 25+
- Safari 7+
- Edge 12+

## Credits

- Built on [SiriWave](https://github.com/kopiro/siriwave) by @kopiro
- Developed by Mohammad Anbarestany

## License

GPL v2 or later

## Support

For issues and feature requests, please visit: https://github.com/qasedak/sk-voice

## Changelog

### 1.0.0
- Initial release
- Support for iOS and iOS9 wave styles
- Real-time audio analysis
- Customizable visualization settings
- FSE Audio Block integration
