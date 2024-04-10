import { localize } from '@deriv/translations';
import { config } from '../../../../../../constants/config';

Blockly.Blocks.custom_prediction_setter = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'set custom prediction {{ prediction_active_type }}',
                {
                    prediction_active_type: '%1',
                }
            ),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PREDICTION_ACTIVE_TYPE',
                    options: config.lists.PREDICTION_ITEMS,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Set custom predictions on your contract type anywhere in the blocks'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Custom Prediction Setter'),
            description: localize(
                'Set custom predictions on your contract type anywhere in the blocks.'
            ),
        };
    },
};

Blockly.JavaScript.custom_prediction_setter = block => {
    const prediction = block.getFieldValue('PREDICTION_ACTIVE_TYPE');
    const code = `Bot.predictionSetter('${prediction}')`;
    return code;
};
