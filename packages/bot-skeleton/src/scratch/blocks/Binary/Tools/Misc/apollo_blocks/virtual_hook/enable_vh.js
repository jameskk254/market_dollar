import { localize } from '@deriv/translations';

Blockly.Blocks.enable_virtual_hook = {
    init() {
        this.jsonInit({
            message0: localize('Enable Virtual Trades {{ input_enable_virtual_hook }}', { input_enable_virtual_hook: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'ENABLE_VIRTUAL_HOOK',
                    options: [
                        [localize('true'), 'true'],
                        [localize('false'), 'false'],
                    ],
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange: Blockly.Blocks.input_list.onchange,
    getRequiredValueInputs() {
        return {
            ENABLE_VIRTUAL_HOOK: null,
        };
    },
};

Blockly.JavaScript.enable_virtual_hook = () => {};
