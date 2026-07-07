module.exports = async function (context, req) {
    try {
        const { message } = req.body || {};
        if (!message) {
            context.res = { status: 400, body: { error: "Message is required" } };
            return;
        }

        // 1. Search Azure AI Search
        const searchUrl = `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${process.env.AZURE_SEARCH_INDEX_NAME}/docs/search?api-version=2024-07-01`;        
        
        const searchResponse = await fetch(searchUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_SEARCH_KEY
            },
            body: JSON.stringify({
                search: message,
                top: 5,
                queryType: "semantic",
                semanticConfiguration: "default"
            })
        });

const searchData = await searchResponse.json();
context.log.error("=== SEARCH RESULTS ===");
context.log.error(JSON.stringify(searchData));

let contextText = "";
let hasRelevantContent = false;

if (searchData.value && searchData.value.length > 0) {
    contextText = searchData.value.map(item => item.content).join("\n\n");
    hasRelevantContent = true;
} else {
    contextText = "No relevant information found in the knowledge base.";
}
if (contextText.length > 12000) {
    contextText = contextText.substring(0, 12000) + "... [content truncated]";
}
        // 2. Call Azure OpenAI with context
        const openAiUrl = `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-08-01-preview`;

        const openAiResponse = await fetch(openAiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_OPENAI_KEY
            },
body: JSON.stringify({
messages: [
    { 
        role: "system", 
        content: hasRelevantContent 
            ? "You are a helpful assistant for the California POST Learning Portal. Use only the provided context to answer questions. If the answer is not clearly in the context, say you don't have that information and offer to help the user contact support."
            : "You are a helpful assistant for the California POST Learning Portal. The user asked a question, but no relevant information was found in the knowledge base. Be honest, helpful, and direct them to official support channels when appropriate."
    },
    { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${message}` }
],
    max_completion_tokens: 3000
})
        });

const openAiData = await openAiResponse.json();

// Force log the full response
context.log.error("=== OPENAI RAW RESPONSE ===");
context.log.error(JSON.stringify(openAiData));

const reply = openAiData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

        context.res = {
            status: 200,
            body: { reply }
        };

    } catch (error) {
        context.log.error("Error:", error);
        context.res = {
            status: 500,
            body: { error: "Failed to process request" }
        };
    }
};