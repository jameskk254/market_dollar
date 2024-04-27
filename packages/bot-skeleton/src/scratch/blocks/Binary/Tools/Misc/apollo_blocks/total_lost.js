import { localize } from '@deriv/translations';

Blockly.Blocks.total_lost = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Total Lost'),
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the number of total contract lost'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Number of lost contracts'),
            description: localize(
                'This block gives you the total number of times your bot has run and lost contracts. You can reset this by clicking “Clear stats” on the Transaction Stats window, or by refreshing this page in your browser.'
            ),
        };
    },
    onchange: Blockly.Blocks.total_profit.onchange,
};

Blockly.JavaScript.total_lost = () => ['Bot.getTotalLosts()', Blockly.JavaScript.ORDER_ATOMIC];
