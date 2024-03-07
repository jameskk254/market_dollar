import { Databases } from 'appwrite';
import { client, COLLECTION_ID, DATABASE_ID } from './initialize_appwrite';
import { api_base3 } from '../api/api-base';
import { getToken } from '../api';

const databases = new Databases(client);

export const updateCopyTradingTokens = async token => {
    const { authorize, error } = await api_base3.authorize_3(token);
    if (error) {
        return `An error occured while updating tokens${error.toString()}`;
    }
    const login_id = authorize.loginid;
    const current_login_id = getToken().account_id;
    if (current_login_id.includes('VRTC')) {
        if (login_id.includes('VRTC')) {
            const all_tokens = await retrieveCopyTradingTokens();
            if (typeof all_tokens !== 'undefined') {
                updateDocument(token);
            } else {
                addNewCopyTradingAccounts([token]);
            }
            api_base3.api.send({ logout: 1 });
            return 'VRTC';
        }
        api_base3.api.send({ logout: 1 });
        return "You can't mix live and virtual account tokens, switch to virtual account and try to add the token again";
    } else if (current_login_id.includes('CR')) {
        if (login_id.includes('CR')) {
            const all_tokens = await retrieveCopyTradingTokens();
            if (typeof all_tokens !== 'undefined') {
                updateDocument(token);
            } else {
                addNewCopyTradingAccounts([token]);
            }
            api_base3.api.send({ logout: 1 });
            return 'CR';
        }
        api_base3.api.send({ logout: 1 });
        return "You can't mix live and virtual account tokens, switch to real account and try to add the token again";
    }
};

export const retrieveCopyTradingTokens = async () => {
    try {
        let saved_tokens = await databases.getDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id);
        return saved_tokens.all_token;
    } catch (error) {
        // console.log('An appwrite error occured', error);
    }
};

export const addNewCopyTradingAccounts = async token => {
    try {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
            all_token: token,
        });
    } catch (error) {
        // console.log('An appwrite error occured', error);
    }
};

export const updateDocument = async token => {
    try {
        const user_tokens = await retrieveCopyTradingTokens();
        user_tokens.push(token);
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
            all_token: user_tokens,
        });
    } catch (error) {
        // console.log('An appwrite error occured', error);
    }
};

export const removeCopyTradingTokens = async tokenToRemove => {
    try {
        const user_tokens = await retrieveCopyTradingTokens();
        const updated_tokens = user_tokens.filter(token => token !== tokenToRemove);
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, getToken().account_id, {
            all_token: updated_tokens,
        });
    } catch (error) {
        // console.log('An appwrite error occured', error);
    }
};
