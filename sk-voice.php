<?php
/**
 * Plugin Name: SK Voice
 * Plugin URI: https://github.com/qasedak/sk-voice
 * Description: Add voice visualizations to your WordPress site.
 * Version: 1.0.0
 * Author: Mohammad Anbarestany
 * Author URI: https://anbarestany.ir
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: sk-voice
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('SK_VOICE_VERSION', '1.0.0');
define('SK_VOICE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SK_VOICE_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Initialize the plugin
 */
class SK_Voice {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_filter('render_block', array($this, 'render_audio_block_with_visualization'), 10, 2);
    }
    
    /**
     * Enqueue block editor assets
     */
    public function enqueue_block_editor_assets() {
        // Enqueue SiriWave library
        wp_enqueue_script(
            'siriwave',
            'https://unpkg.com/siriwave/dist/siriwave.umd.min.js',
            array(),
            '2.4.0',
            true
        );
        
        // Enqueue editor script
        wp_enqueue_script(
            'sk-voice-editor',
            SK_VOICE_PLUGIN_URL . 'build/editor.js',
            array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-hooks', 'siriwave'),
            SK_VOICE_VERSION,
            true
        );
        
        // Enqueue editor styles
        wp_enqueue_style(
            'sk-voice-editor',
            SK_VOICE_PLUGIN_URL . 'assets/css/editor.css',
            array('wp-edit-blocks'),
            SK_VOICE_VERSION
        );
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        // Enqueue SiriWave library
        wp_enqueue_script(
            'siriwave',
            'https://unpkg.com/siriwave/dist/siriwave.umd.min.js',
            array(),
            '2.4.0',
            true
        );
        
        // Enqueue frontend script
        wp_enqueue_script(
            'sk-voice-frontend',
            SK_VOICE_PLUGIN_URL . 'assets/js/frontend.js',
            array('siriwave'),
            SK_VOICE_VERSION,
            true
        );
        
        // Enqueue frontend styles
        wp_enqueue_style(
            'sk-voice-frontend',
            SK_VOICE_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            SK_VOICE_VERSION
        );
    }
    
    /**
     * Modify audio block render to add visualization wrapper
     */
    public function render_audio_block_with_visualization($block_content, $block) {
        // Only modify core/audio blocks
        if ($block['blockName'] !== 'core/audio') {
            return $block_content;
        }
        
        // Check if visualization is enabled
        $enable_visualization = isset($block['attrs']['skVoiceEnable']) ? $block['attrs']['skVoiceEnable'] : false;
        
        if (!$enable_visualization) {
            return $block_content;
        }
        
        // Remove any existing sk-voice-wrapper to avoid duplicates
        // This handles cases where old content was saved with the wrapper
        $block_content = preg_replace(
            '/<div class="sk-voice-wrapper[^>]*>.*?<div class="sk-voice-visualization"[^>]*>.*?<\/div>\s*/s',
            '',
            $block_content
        );
        
        // Also remove closing wrapper div if it exists
        $block_content = preg_replace('/<\/div>\s*<\/div>\s*$/', '</div>', $block_content);
        
        // Get visualization settings
        $style = isset($block['attrs']['skVoiceStyle']) ? $block['attrs']['skVoiceStyle'] : 'ios9';
        $amplitude = isset($block['attrs']['skVoiceAmplitude']) ? $block['attrs']['skVoiceAmplitude'] : 1;
        $speed = isset($block['attrs']['skVoiceSpeed']) ? $block['attrs']['skVoiceSpeed'] : 0.2;
        $height = isset($block['attrs']['skVoiceHeight']) ? $block['attrs']['skVoiceHeight'] : 200;
        $autostart = isset($block['attrs']['skVoiceAutostart']) ? $block['attrs']['skVoiceAutostart'] : false;
        
        // Create wrapper with visualization container
        $visualization_id = 'sk-voice-' . wp_unique_id();
        
        $wrapper = sprintf(
            '<div class="sk-voice-wrapper" data-style="%s" data-amplitude="%s" data-speed="%s" data-height="%s" data-autostart="%s">',
            esc_attr($style),
            esc_attr($amplitude),
            esc_attr($speed),
            esc_attr($height),
            esc_attr($autostart ? 'true' : 'false')
        );
        $wrapper .= '<div class="sk-voice-visualization" id="' . esc_attr($visualization_id) . '"></div>';
        $wrapper .= $block_content;
        $wrapper .= '</div>';
        
        return $wrapper;
    }
}

// Initialize the plugin
new SK_Voice();