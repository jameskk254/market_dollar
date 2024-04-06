import { localize } from '@deriv/translations';
import { config } from '../../../../../../constants/config';

const getKeyList = dictionary => {
    const keysList = [[localize('disable'),'disable']];

    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            dictionary[key].forEach(item => {
                const subKey = Object.keys(item)[0];
                const subValue = item[subKey];
                keysList.push([localize(subValue), subKey]);
            });
        }
    }

    return keysList;
};

Blockly.Blocks.contract_changer_block = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Current active contract {{ contract_changer }}', {
                contract_changer: '%1',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'CONTRACT_CHANGER',
                    options: getKeyList(config.opposites),
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Changes the current trading contract type'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Contract Type Switcher'),
            description: localize('This block makes your bot hybrid, allowing it to change to any contract type available'),
        };
    },
};

Blockly.JavaScript.contract_changer_block = block => {
    const contract_status = block.getFieldValue('CONTRACT_CHANGER');
    const code = `Bot.contractSwitcher('${contract_status}')`;
    return code;
};
