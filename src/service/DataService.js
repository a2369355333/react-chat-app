import apiservice from "./ApiService";

const dataService = {
  getConversations : () => apiservice.get('/conversations'),
  getMessages: (conversationId) => apiservice.get(`/messages?conversationId=${conversationId}`),
  postMessage: (conversationId, messageData) => apiservice.post(`/conversations/${conversationId}/messages/create`, messageData)
};

export default dataService;