import { localize } from '@deriv/translations';
import { config } from '../../../../../../../constants';

Blockly.Blocks.enable_copy_demo = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Copy Demo Trades {{ copy_demo_type }} account_id: {{ input_text }}', {
                copy_demo_type: '%1',
                input_text: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'ENABLE_COPY_DEMO',
                    options: config.lists.BARRIER_OFFSETER_STATUS,
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Enable and Disable Demo Copy Trading'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Virtual Hook Enabler'),
            description: localize(
                'When this block is enabled it allows you to copy trades straight from your demo account to real'
            ),
        };
    },
};

Blockly.JavaScript.enable_copy_demo = block => {
    const copy_status = block.getFieldValue('ENABLE_COPY_DEMO');
    const account_id = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "''";
    const data = {
        copy_status: copy_status,
        account_id: removeExtraQuotes(account_id),
    };
    const dataString = JSON.stringify(data);
    const code = `Bot.enabaleDemoCopyTrading('${dataString}')`;
    return code;
};

const removeExtraQuotes = str => {
    return str.replace(/^'|"|'$/g, '');
};
