=== SK Voice ===
Contributors: mohammadanbarestany
Tags: audio, visualization, siriwave, gutenberg, block, fse
Requires at least: 5.8
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add beautiful voice visualizations to your WordPress audio blocks using SiriWave library.

== Description ==

SK Voice extends the WordPress core audio block with stunning voice visualizations powered by the SiriWave library. Create engaging audio experiences with real-time wave animations that respond to your audio content.

= Features =

* **Seamless Integration**: Extends the native WordPress audio block
* **Multiple Wave Styles**: Choose between iOS Classic and iOS 9 wave styles
* **Real-time Audio Analysis**: Waves respond to audio frequencies in real-time
* **Highly Customizable**:
  * Wave style selection
  * Adjustable amplitude (0.1 - 5)
  * Configurable speed (0.01 - 1)
  * Custom height (100px - 500px)
  * Autostart option
* **Responsive Design**: Works beautifully on all devices
* **Dark Mode Support**: Automatically adapts to dark mode
* **FSE Compatible**: Works with Full Site Editing

= How It Works =

1. Add an Audio block to your page
2. Upload your audio file
3. Open the block settings sidebar
4. Enable "SK Voice Visualization"
5. Customize the appearance to match your design
6. Publish and enjoy!

The visualization uses the Web Audio API to analyze your audio in real-time, creating dynamic wave animations that dance to your music.

= Credits =

Built on the amazing [SiriWave](https://github.com/kopiro/siriwave) library by @kopiro.

== Installation ==

1. Upload the `sk-voice` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu
3. Add or edit an Audio block
4. Enable visualization in the block settings

== Frequently Asked Questions ==

= Does this work with any audio file? =

Yes! SK Voice works with any audio file supported by the WordPress audio block (MP3, WAV, OGG).

= Can I customize the colors? =

The current version uses predefined gradient backgrounds based on the wave style. Custom color options may be added in future updates.

= Does it work on mobile devices? =

Yes! The visualization is fully responsive and works great on mobile devices.

= Is it compatible with Full Site Editing? =

Absolutely! SK Voice is designed to work seamlessly with WordPress Full Site Editing.

= Does it affect page performance? =

SK Voice uses optimized canvas rendering and Web Audio API. The performance impact is minimal on modern browsers.

== Screenshots ==

1. Audio block with SK Voice visualization (iOS 9 style)
2. Block settings panel showing customization options
3. iOS Classic wave style
4. Responsive design on mobile devices

== Changelog ==

= 1.0.0 =
* Initial release
* Support for iOS and iOS9 wave styles
* Real-time audio frequency analysis
* Customizable visualization settings
* Full Site Editing compatibility

== Upgrade Notice ==

= 1.0.0 =
Initial release of SK Voice plugin.
