/**
 * SK Voice - Block Editor Extensions
 * Extends the core/audio block with SiriWave visualization
 */

(function (wp) {
    const { addFilter } = wp.hooks;
    const { createElement: el, Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, ToggleControl, SelectControl, RangeControl } = wp.components;
    const { __ } = wp.i18n;

    /**
     * Add custom attributes to audio block
     */
    function addVisualizationAttributes(settings, name) {
        if (name !== 'core/audio') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                skVoiceEnable: {
                    type: 'boolean',
                    default: false,
                },
                skVoiceStyle: {
                    type: 'string',
                    default: 'ios9',
                },
                skVoiceAmplitude: {
                    type: 'number',
                    default: 1,
                },
                skVoiceSpeed: {
                    type: 'number',
                    default: 0.2,
                },
                skVoiceHeight: {
                    type: 'number',
                    default: 200,
                },
                skVoiceAutostart: {
                    type: 'boolean',
                    default: false,
                },
            },
        };
    }

    addFilter(
        'blocks.registerBlockType',
        'sk-voice/add-visualization-attributes',
        addVisualizationAttributes
    );

    /**
     * Add visualization controls to audio block inspector
     */
    function addVisualizationControls(BlockEdit) {
        return (props) => {
            if (props.name !== 'core/audio') {
                return el(BlockEdit, props);
            }

            const { attributes, setAttributes } = props;
            const {
                skVoiceEnable,
                skVoiceStyle,
                skVoiceAmplitude,
                skVoiceSpeed,
                skVoiceHeight,
                skVoiceAutostart,
            } = attributes;

            return el(
                Fragment,
                {},
                el(BlockEdit, props),
                el(
                    InspectorControls,
                    {},
                    el(
                        PanelBody,
                        {
                            title: __('SK Voice Visualization', 'sk-voice'),
                            initialOpen: false,
                        },
                        el(ToggleControl, {
                            label: __('Enable Visualization', 'sk-voice'),
                            checked: skVoiceEnable,
                            onChange: (value) => setAttributes({ skVoiceEnable: value }),
                            help: __('Show SiriWave visualization with audio', 'sk-voice'),
                        }),
                        skVoiceEnable &&
                            el(
                                Fragment,
                                {},
                                el(SelectControl, {
                                    label: __('Wave Style', 'sk-voice'),
                                    value: skVoiceStyle,
                                    options: [
                                        { label: 'iOS Classic', value: 'ios' },
                                        { label: 'iOS 9', value: 'ios9' },
                                    ],
                                    onChange: (value) => setAttributes({ skVoiceStyle: value }),
                                }),
                                el(RangeControl, {
                                    label: __('Amplitude', 'sk-voice'),
                                    value: skVoiceAmplitude,
                                    min: 0.1,
                                    max: 5,
                                    step: 0.1,
                                    onChange: (value) => setAttributes({ skVoiceAmplitude: value }),
                                    help: __('Controls the height of the waves', 'sk-voice'),
                                }),
                                el(RangeControl, {
                                    label: __('Speed', 'sk-voice'),
                                    value: skVoiceSpeed,
                                    min: 0.01,
                                    max: 1,
                                    step: 0.01,
                                    onChange: (value) => setAttributes({ skVoiceSpeed: value }),
                                    help: __('Controls the animation speed', 'sk-voice'),
                                }),
                                el(RangeControl, {
                                    label: __('Height (px)', 'sk-voice'),
                                    value: skVoiceHeight,
                                    min: 100,
                                    max: 500,
                                    step: 10,
                                    onChange: (value) => setAttributes({ skVoiceHeight: value }),
                                    help: __('Height of the visualization canvas', 'sk-voice'),
                                }),
                                el(ToggleControl, {
                                    label: __('Autostart Animation', 'sk-voice'),
                                    checked: skVoiceAutostart,
                                    onChange: (value) => setAttributes({ skVoiceAutostart: value }),
                                    help: __('Start animation automatically on page load', 'sk-voice'),
                                })
                            )
                    )
                )
            );
        };
    }

    addFilter(
        'editor.BlockEdit',
        'sk-voice/add-visualization-controls',
        addVisualizationControls
    );
})(window.wp);
