LP Support Chat Basic Frontend

This single page frontend app was created to support a major update to the LP Assistant AI support chatbot. 

1.	The AI model was set to use “gpt-5-mini.” 
2.	The architecture was changed to Retrieval-Augmented Generation (RAG) approach (a technique used in AI chatbots where the model retrieves relevant information from a knowledge base of documents to generate a response).
3.	The chatbot now connects to Azure AI Search and uses semantic search, which should provide for better responses and relevance.
4.	The training file was converted from a MS Word .DOCX to a .MD format for better consumption by the AI Search. 
5.	The training data was made more consistent. 
6.	A new back-end application (i.e., an Azure Function App) was created to connect with the AI Search and provides an API to the front-end for testing. 
7.	This new front-end application (i.e., an Azure Static Web App) was created to test all of the above with a UI mock-up for user review. I put in some non-working UI elements for feedback, rating, and resolution options. (Reference and consider these ideas for a Code3 update). 

This repo also contains the training data in .MD file format, which will be uploaded in Azure according to this workflow:
<img width="977" height="354" alt="TrainingDataMaintenanceWorkflow" src="https://github.com/user-attachments/assets/47827fe0-2c89-4ff6-b954-5d7fdee0a2ae" />

This repo also contains a copy of the back-end app code (Javascript) used in Azure. This is just for reference.

Note: Updating the index.html file and pushing it to MAIN will automatically push this into Auzre and update the front-end app.  
Front-end app URL:https://victorious-mud-001c8e10f.7.azurestaticapps.net/
