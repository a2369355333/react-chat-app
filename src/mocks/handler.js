import { http } from "msw";
import data from "../data/data.json";

const conversations = data.conversations;
const messages = data.messages;

export const handlers = [
    http.get('/conversations', async () => {
        return new Response(JSON.stringify(conversations), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });
    }),
    http.get('/messages', async ({ request }) => {
        const url = new URL(request.url);
        const conversationId = url.searchParams.get('conversationId');
        const filteredMessages = messages.filter(v => v.conversationId === parseInt(conversationId));

        return new Response(JSON.stringify(filteredMessages), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });
    }),
    http.post('/conversations/:id/messages/create', async ({ request }) => {
        const newMessage = await request.json();
        messages.push(newMessage);

        return new Response(JSON.stringify(messages), { 
            status: 201, 
            headers: { "Content-Type": "application/json" } 
        });
    })
];
