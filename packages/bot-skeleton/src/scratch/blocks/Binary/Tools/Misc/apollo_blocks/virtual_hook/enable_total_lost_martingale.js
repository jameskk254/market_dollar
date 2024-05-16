import { localize } from '@deriv/translations';
import { config } from '../../../../../../../constants';

Blockly.Blocks.enable_total_lost = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Total Lost Martingale: {{ barrier_active_type }}',
                {
                    barrier_active_type: '%1',
                }
            ),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'ENABLE_TOTAL_LOST',
                    options: config.lists.BARRIER_OFFSETER_STATUS,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Enable and Disable Total lost martingale'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Total lost martingale'),
            description: localize(
                'This block Enable and Disable total lost amount martingale calculation on virtual hook.'
            ),
        };
    },
};

Blockly.JavaScript.enable_total_lost = block => {
    const total_lost_status = block.getFieldValue('ENABLE_TOTAL_LOST');
    const code = `Bot.enabaleTotalLost('${total_lost_status}')`;
    return code;
};


