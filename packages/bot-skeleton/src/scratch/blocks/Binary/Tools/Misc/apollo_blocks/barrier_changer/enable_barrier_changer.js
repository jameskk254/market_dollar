import { localize } from '@deriv/translations';
import { config } from '../../../../../../../constants/config';

Blockly.Blocks.enable_barrier_changer = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Barrier changer status {{ barrier_active_type }}',
                {
                    barrier_active_type: '%1',
                }
            ),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BARRIER_ACTIVE_TYPE',
                    options: config.lists.BARRIER_OFFSETER_STATUS,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Enable and Disable Touch/NoTouch offset changer'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Touch/NoTouch Offset Changer'),
            description: localize(
                'This block displays Enable and Disable Touch/NoTouch offset changer.'
            ),
        };
    },
};

Blockly.JavaScript.enable_barrier_changer = block => {
    const barrier_status = block.getFieldValue('BARRIER_ACTIVE_TYPE');
    const code = `Bot.enableBarrierChanger('${barrier_status}')`;
    return code;
};
