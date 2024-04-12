import { localize } from '@deriv/translations';
import { emptyTextValidator } from '../../../../../../utils';
import { config } from '../../../../../../../constants/config';

Blockly.Blocks.barrier_changer = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to barrier changer {{ input_text }}', {
                variable: '%1',
                input_text: '%2',
            }),
            args0: [
                {
                    type: 'field_variable',
                    name: 'VAR',
                    variable: localize('text'),
                },
                {
                    type: 'input_value',
                    name: 'TEXT',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Changes the offset of the a touch/notouch bot'),
            category: Blockly.Categories.Text,
        };
    },
    meta() {
        return {
            display_name: localize('Touch/NoTouch Barrier Changer'),
            description: localize('Changes the offset of the a touch/notouch bot'),
        };
    },
    getRequiredValueInputs() {
        return {
            TEXT: emptyTextValidator,
        };
    },
};

Blockly.JavaScript.barrier_changer = block => {
    const value = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || "''";
    const code = `Bot.updateBarrierOffseter(${value})`;
    return code;
};
