import { localize } from '@deriv/translations';

Blockly.Blocks.vh_status = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('VirtualHook Status'),
            output: 'Boolean',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the current status of the virtual hook'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Virtual Hook Status'),
            description: localize(
                'This block returns if virtual hook is active or not.'
            ),
        };
    },
    onchange: Blockly.Blocks.total_profit.onchange,
};

Blockly.JavaScript.vh_status = () => ['Bot.getVHStatus()', Blockly.JavaScript.ORDER_ATOMIC];
