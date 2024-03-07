import { Client } from "appwrite";

// Init your Web SDK
export const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65e94de0e88ed3878323');

export const DATABASE_ID = '65e94f9f010594ef28c3';
export const COLLECTION_ID = '65e94fab27826e64236d'
