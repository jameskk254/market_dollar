import { localize } from '@deriv/translations';

Blockly.Blocks.get_last_digit = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('get last digit {{ input_data }}', { input_data: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block returns the last item in a number value.'),
            category: Blockly.Categories.List,
        };
    },
    meta() {
        return {
            display_name: localize('Get last number'),
            description: localize('This block returns the last item in a number value.'),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: null,
        };
    },
};

Blockly.JavaScript.get_last_digit = block => {
    const input_data = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER) || '123';
    const code = `Number(${input_data}.toString().split('').pop())`;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};
