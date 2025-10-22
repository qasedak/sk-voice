# SK Voice - Technical Documentation

## Architecture Overview

SK Voice extends the WordPress core/audio block using WordPress block filters and hooks. It integrates the SiriWave library with the Web Audio API to create real-time audio visualizations.

## File Structure

```
sk-voice/
├── sk-voice.php              # Main plugin file
├── assets/
│   ├── css/
│   │   ├── frontend.css      # Frontend styles
│   │   └── editor.css        # Block editor styles
│   └── js/
│       └── frontend.js       # Frontend visualization logic
├── build/
│   └── editor.js             # Block editor extensions
├── README.md                 # Documentation
├── readme.txt                # WordPress.org plugin readme
├── USAGE.md                  # User guide
├── package.json              # NPM package info
└── .gitignore               # Git ignore rules
```

## Core Components

### 1. Main Plugin Class (sk-voice.php)

**Purpose**: Initializes the plugin, registers hooks, and manages asset enqueuing.

**Key Methods**:
- `__construct()`: Registers WordPress hooks
- `enqueue_block_editor_assets()`: Loads editor scripts and styles
- `enqueue_frontend_assets()`: Loads frontend scripts and styles
- `render_audio_block_with_visualization()`: Modifies audio block output

**Block Attributes Added**:
- `skVoiceEnable` (boolean): Enable/disable visualization
- `skVoiceStyle` (string): Wave style (ios/ios9)
- `skVoiceAmplitude` (number): Wave amplitude
- `skVoiceSpeed` (number): Animation speed
- `skVoiceHeight` (number): Canvas height
- `skVoiceAutostart` (boolean): Autostart animation

### 2. Block Editor Extensions (build/editor.js)

**Purpose**: Extends the core/audio block with custom controls and attributes.

**WordPress Hooks Used**:
- `blocks.registerBlockType`: Adds custom attributes
- `editor.BlockEdit`: Adds inspector controls
- `blocks.getSaveElement`: Adds wrapper for visualization

**Components**:
- Inspector controls panel
- Toggle for enable/disable
- Select control for wave style
- Range controls for amplitude, speed, height
- Toggle for autostart

### 3. Frontend Visualization (assets/js/frontend.js)

**Purpose**: Implements the actual visualization using SiriWave and Web Audio API.

**Key Class**: `SKVoiceVisualization`

**Methods**:
- `init()`: Initializes SiriWave and audio context
- `initSiriWave()`: Creates SiriWave instance
- `setupAudioContext()`: Sets up Web Audio API
- `bindAudioEvents()`: Binds to audio play/pause events
- `start()`: Starts visualization animation
- `stop()`: Stops visualization animation
- `updateAmplitude()`: Updates wave amplitude based on audio analysis
- `destroy()`: Cleanup method

**Audio Analysis**:
- Uses `AnalyserNode` from Web Audio API
- FFT size: 256
- Smoothing: 0.8
- Analyzes frequency data in real-time
- Normalizes to control wave amplitude

### 4. Styles

**Frontend CSS** (`assets/css/frontend.css`):
- Responsive design
- Gradient backgrounds
- Dark mode support
- Loading states

**Editor CSS** (`assets/css/editor.css`):
- Preview placeholder
- Inspector panel styling

## Data Flow

```
User adds Audio Block
    ↓
Block Editor loads editor.js
    ↓
Custom attributes registered
    ↓
Inspector controls appear
    ↓
User enables visualization & configures
    ↓
Block saved with custom attributes
    ↓
Frontend: render_audio_block_with_visualization() 
    ↓
Wrapper div with data attributes added
    ↓
frontend.js initializes
    ↓
SKVoiceVisualization class instantiated
    ↓
SiriWave instance created
    ↓
Web Audio API setup
    ↓
Audio events bound
    ↓
User plays audio
    ↓
Audio analysis starts
    ↓
Amplitude updated in real-time
    ↓
Waves animate to music
```

## Technical Details

### Web Audio API Integration

```javascript
// Audio Context Setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
this.audioContext = new AudioContext();

// Analyser Node
this.analyser = this.audioContext.createAnalyser();
this.analyser.fftSize = 256;
this.analyser.smoothingTimeConstant = 0.8;

// Connect Audio Element
this.source = this.audioContext.createMediaElementSource(this.audio);
this.source.connect(this.analyser);
this.analyser.connect(this.audioContext.destination);

// Analyze Frequencies
this.analyser.getByteFrequencyData(this.dataArray);
```

### SiriWave Configuration

```javascript
new SiriWave({
    container: element,           // DOM container
    style: 'ios9',               // Wave style
    amplitude: 1,                // Base amplitude
    speed: 0.2,                  // Animation speed
    height: 200,                 // Canvas height
    cover: true,                 // Fill container
    autostart: false,            // Manual start
});
```

### Real-time Amplitude Calculation

```javascript
// Get frequency data
this.analyser.getByteFrequencyData(this.dataArray);

// Calculate average
let sum = 0;
for (let i = 0; i < this.dataArray.length; i++) {
    sum += this.dataArray[i];
}
const average = sum / this.dataArray.length;

// Normalize to 0-1, apply base amplitude, scale
const normalizedAmplitude = (average / 255) * this.settings.amplitude * 3;

// Apply to SiriWave
this.siriWave.setAmplitude(Math.max(0.1, normalizedAmplitude));
```

## WordPress Block API Usage

### Adding Custom Attributes

```javascript
addFilter(
    'blocks.registerBlockType',
    'sk-voice/add-visualization-attributes',
    (settings, name) => {
        if (name !== 'core/audio') return settings;
        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                skVoiceEnable: { type: 'boolean', default: false },
                // ... more attributes
            },
        };
    }
);
```

### Adding Inspector Controls

```javascript
addFilter(
    'editor.BlockEdit',
    'sk-voice/add-visualization-controls',
    (BlockEdit) => {
        return (props) => {
            // Return original for non-audio blocks
            if (props.name !== 'core/audio') {
                return el(BlockEdit, props);
            }
            
            // Add controls to audio block
            return el(
                Fragment,
                {},
                el(BlockEdit, props),
                el(InspectorControls, {}, /* custom controls */)
            );
        };
    }
);
```

### Modifying Block Output

```php
add_filter('render_block', function($block_content, $block) {
    if ($block['blockName'] !== 'core/audio') {
        return $block_content;
    }
    
    // Check if visualization enabled
    if (!isset($block['attrs']['skVoiceEnable']) || !$block['attrs']['skVoiceEnable']) {
        return $block_content;
    }
    
    // Wrap with visualization container
    return sprintf(
        '<div class="sk-voice-wrapper" data-settings="%s">
            <div class="sk-voice-visualization"></div>
            %s
        </div>',
        esc_attr(json_encode($settings)),
        $block_content
    );
}, 10, 2);
```

## Browser Compatibility

### Required APIs
- **Web Audio API**: Chrome 34+, Firefox 25+, Safari 7+, Edge 12+
- **Canvas API**: All modern browsers
- **ES6 JavaScript**: All modern browsers
- **requestAnimationFrame**: All modern browsers

### Polyfills
Not required for target browsers.

### Fallback
If SiriWave fails to load, audio player still functions normally without visualization.

## Performance Considerations

1. **Canvas Rendering**: Optimized through SiriWave library
2. **Audio Analysis**: Uses efficient FFT with size 256
3. **Animation Loop**: Uses `requestAnimationFrame` for smooth 60fps
4. **Memory Management**: Proper cleanup in `destroy()` method
5. **Multiple Instances**: Each audio block has independent visualization

## Security

1. **Nonce Verification**: Uses WordPress's built-in nonce system
2. **Data Sanitization**: All outputs escaped with `esc_attr()`, `esc_html()`
3. **Direct Access Prevention**: `if (!defined('ABSPATH')) exit;`
4. **XSS Prevention**: Proper escaping in PHP and JavaScript
5. **CORS**: SiriWave loaded from trusted CDN (unpkg)

## Extensibility

### Custom Wave Styles

Developers can add custom styles by:

1. Extending SiriWave with custom curve definitions
2. Adding new options to the SelectControl in editor.js
3. Creating corresponding CSS gradients in frontend.css

### Custom Colors

Currently uses predefined gradients. Future versions could add:

```javascript
// Add color picker to inspector controls
el(ColorPicker, {
    label: __('Wave Color', 'sk-voice'),
    value: waveColor,
    onChange: (value) => setAttributes({ skVoiceColor: value }),
})
```

### Additional Visualizations

Plugin architecture supports adding alternative visualization libraries:

1. Add library script enqueue
2. Create new visualization class
3. Add option in block settings
4. Initialize appropriate library based on selection

## Testing

### Manual Testing Checklist

- [ ] Install and activate plugin
- [ ] Add audio block in editor
- [ ] Enable visualization
- [ ] Test all wave styles
- [ ] Test all settings ranges
- [ ] Test autostart option
- [ ] Publish and test frontend
- [ ] Test audio play/pause
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Test with multiple audio blocks
- [ ] Test dark mode

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Future Enhancements

Potential features for future versions:

1. **Custom Colors**: Color picker for waves
2. **More Styles**: iOS 13 bubble style, custom patterns
3. **Presets**: Save and load visualization presets
4. **Spectrum Analyzer**: Frequency bar visualization option
5. **Waveform Display**: Static waveform when paused
6. **Recording**: Visualize microphone input
7. **Export**: Export visualization as video/GIF
8. **Themes**: Pre-made color themes
9. **Effects**: Blur, glow, particle effects
10. **Integration**: Support for other audio plugins

## Contributing

To contribute to SK Voice:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## Support

For technical support:
- GitHub Issues: https://github.com/qasedak/sk-voice/issues
- Documentation: Check README.md and USAGE.md

## License

GPL v2 or later - See LICENSE file
