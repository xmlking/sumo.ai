import { ApiAiClient } from 'api-ai-javascript';
export const environment = {
    production: false,
    demo: false,

    TITLE: 'ChatBot UI',

    API_BASE_URL: 'http://localhost:3000/api',
    AI_BASE_URL: 'http://localhost:8080',
    WS_BASE_URL: 'http://localhost:8090',
    apiAiClient:  new ApiAiClient({ accessToken: '37808bf14a19406cbe2a50cfd1332dd3', sessionId: 'sumodemo' }),
};
