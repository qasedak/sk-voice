/**
 * SK Voice - Frontend Visualization
 * Implements SiriWave visualization with Web Audio API for audio analysis
 */

(function () {
    'use strict';

    class SKVoiceVisualization {
        constructor(wrapper) {
            this.wrapper = wrapper;
            this.visualization = wrapper.querySelector('.sk-voice-visualization');
            this.audio = wrapper.querySelector('audio');
            this.siriWave = null;
            this.audioContext = null;
            this.analyser = null;
            this.source = null;
            this.dataArray = null;
            this.isPlaying = false;
            
            // Smoothing for amplitude changes
            this.smoothedAmplitude = 0;
            this.smoothingFactor = 0.3; // Lower = smoother (0-1)

            // Get settings from data attributes
            this.settings = {
                style: wrapper.dataset.style || 'ios9',
                amplitude: parseFloat(wrapper.dataset.amplitude) || 1,
                speed: parseFloat(wrapper.dataset.speed) || 0.2,
                height: parseInt(wrapper.dataset.height) || 200,
                autostart: wrapper.dataset.autostart === 'true',
            };

            this.init();
        }

        init() {
            if (!this.audio || !this.visualization) {
                return;
            }

            // Initialize SiriWave
            this.initSiriWave();

            // Setup audio context and analyser
            this.setupAudioContext();

            // Bind audio events
            this.bindAudioEvents();

            // Start if autostart is enabled
            if (this.settings.autostart) {
                this.start();
            }
        }

        initSiriWave() {
            if (typeof SiriWave === 'undefined') {
                console.error('SiriWave library not loaded');
                return;
            }

            try {
                const siriWaveConfig = {
                    container: this.visualization,
                    style: this.settings.style,
                    amplitude: 0, // Start at 0, will be updated by audio analysis
                    speed: this.settings.speed,
                    height: this.settings.height,
                    cover: true,
                    autostart: false, // We'll control start/stop based on audio playback
                };

                // Only add color for iOS classic style
                if (this.settings.style === 'ios') {
                    siriWaveConfig.color = '#fff';
                }

                this.siriWave = new SiriWave(siriWaveConfig);
            } catch (error) {
                console.error('Error initializing SiriWave:', error);
            }
        }

        setupAudioContext() {
            if (!this.audio) return;

            try {
                // Create audio context (only once)
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();

                // Create and configure analyser
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 2048; // Power of 2 for FFT
                this.analyser.smoothingTimeConstant = 0.8; // Smooth the time domain data

                // Create buffer for time domain data (waveform)
                const bufferLength = this.analyser.fftSize;
                this.dataArray = new Uint8Array(bufferLength);

                // Connect audio element to analyser (only once per audio element)
                // This creates the audio graph: audio -> analyser -> destination (speakers)
                this.source = this.audioContext.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            } catch (error) {
                console.error('Error setting up audio context:', error);
            }
        }

        bindAudioEvents() {
            if (!this.audio) return;

            this.audio.addEventListener('play', () => {
                this.start();
            });

            this.audio.addEventListener('pause', () => {
                this.stop();
            });

            this.audio.addEventListener('ended', () => {
                this.stop();
            });

            // Resume audio context on user interaction (required by some browsers)
            this.audio.addEventListener('canplay', () => {
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            });
        }

        start() {
            if (!this.siriWave || this.isPlaying) return;

            this.isPlaying = true;
            this.siriWave.start();
            this.updateAmplitude();
        }

        stop() {
            if (!this.siriWave || !this.isPlaying) return;

            this.isPlaying = false;
            this.siriWave.stop();
            
            // Smoothly reduce amplitude to 0
            this.siriWave.setAmplitude(0);
        }

        updateAmplitude() {
            if (!this.isPlaying || !this.analyser || !this.siriWave) return;

            // Get time domain data (waveform) instead of frequency data
            // This is smoother and more directly represents audio amplitude
            this.analyser.getByteTimeDomainData(this.dataArray);

            // The zero level is at 128 in the time domain data
            // Find the maximum amplitude deviation from the zero level
            let maxAmplitude = 0;
            for (let i = 0; i < this.dataArray.length; i++) {
                const deviation = Math.abs(this.dataArray[i] - 128);
                if (deviation > maxAmplitude) {
                    maxAmplitude = deviation;
                }
            }

            // Normalize: maxAmplitude is in range [0, 128]
            // Scale to [0, 1] range
            const instantAmplitude = maxAmplitude / 128;

            // Apply exponential moving average for additional smoothing
            // This prevents any remaining jitter
            this.smoothedAmplitude = 
                this.smoothingFactor * instantAmplitude + 
                (1 - this.smoothingFactor) * this.smoothedAmplitude;

            // Scale amplitude based on user settings
            // Multiply by 10 to match the demo's scaling behavior
            const scaledAmplitude = this.smoothedAmplitude * this.settings.amplitude * 10;

            // Set the amplitude (no minimum needed, can go to 0 during silence)
            this.siriWave.setAmplitude(scaledAmplitude);

            // Continue updating on next animation frame
            requestAnimationFrame(() => this.updateAmplitude());
        }

        destroy() {
            if (this.siriWave && this.siriWave.dispose) {
                this.siriWave.dispose();
            }

            if (this.source) {
                this.source.disconnect();
            }

            if (this.analyser) {
                this.analyser.disconnect();
            }

            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close();
            }
        }
    }

    // Initialize all SK Voice visualizations
    function initVisualizations() {
        const wrappers = document.querySelectorAll('.sk-voice-wrapper');
        const instances = [];

        wrappers.forEach((wrapper) => {
            const instance = new SKVoiceVisualization(wrapper);
            instances.push(instance);
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            instances.forEach((instance) => instance.destroy());
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisualizations);
    } else {
        initVisualizations();
    }

    // Re-initialize for dynamic content (e.g., AJAX loaded content)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('sk-voice-wrapper')) {
                                new SKVoiceVisualization(node);
                            } else if (node.querySelector) {
                                const wrappers = node.querySelectorAll('.sk-voice-wrapper');
                                wrappers.forEach((wrapper) => {
                                    new SKVoiceVisualization(wrapper);
                                });
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
})();
