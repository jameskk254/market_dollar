import LZString from 'lz-string';
import localForage from 'localforage';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';
import XMLParser from 'react-xml-parser';
/**
 * Save workspace to localStorage
 * @param {String} save_type // constants/save_types.js (unsaved, local, googledrive)
 * @param {Blockly.Events} event // Blockly event object
 */
export const saveWorkspaceToRecent = async (xml, save_type = save_types.UNSAVED) => {
    // Ensure strategies don't go through expensive conversion.
    xml.setAttribute('is_dbot', true);
    const newBlocks = updateApolloXML(xml);
    xml = newBlocks
    const {
        load_modal: { updateListStrategies },
        save_modal,
    } = DBotStore.instance;

    const workspace_id = Blockly.derivWorkspace.current_strategy_id || Blockly.utils.genUid();
    const workspaces = await getSavedWorkspaces();
    const current_xml = Blockly.Xml.domToText(xml);
    const current_timestamp = Date.now();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        const current_workspace = workspaces[current_workspace_index];
        current_workspace.xml = current_xml;
        current_workspace.name = save_modal.bot_name;
        current_workspace.timestamp = current_timestamp;
        current_workspace.save_type = save_type;
    } else {
        workspaces.push({
            id: workspace_id,
            timestamp: current_timestamp,
            name: save_modal.bot_name,
            xml: current_xml,
            save_type,
        });
    }

    workspaces
        .sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        })
        .reverse();

    if (workspaces.length > 10) {
        workspaces.pop();
    }
    updateListStrategies(workspaces);
    localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
};

export const getSavedWorkspaces = async () => {
    try {
        return JSON.parse(LZString.decompress(await localForage.getItem('saved_workspaces'))) || [];
    } catch (e) {
        return [];
    }
};

export const removeExistingWorkspace = async workspace_id => {
    const workspaces = await getSavedWorkspaces();
    const current_workspace_index = workspaces.findIndex(workspace => workspace.id === workspace_id);

    if (current_workspace_index >= 0) {
        workspaces.splice(current_workspace_index, 1);
    }

    await localForage.setItem('saved_workspaces', LZString.compress(JSON.stringify(workspaces)));
};

// XML Updator
export const updateApolloXML = xml => {
    // Find all block elements
    const blocks = xml.getElementsByTagName('block');

    // Convert blocks to an array if it's not already one
    const blocksArray = Array.isArray(blocks) ? blocks : Object.values(blocks);

    blocksArray.forEach(block => {
        // Access the 'type' attribute node from the NamedNodeMap
        const typeAttr = block.attributes.getNamedItem('type');

        // Check if the 'type' attribute's value is 'purchase' and update it if so
        if (typeAttr && typeAttr.value === 'purchase') {
            typeAttr.value = 'apollo_purchase';
        }
    });

    return xml;
};
