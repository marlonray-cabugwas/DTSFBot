var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");
var card = require("./cards");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Recognizer and and Dialog for GA QnAMaker service
var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    authKey: process.env.QnAAuthKey,
    endpointHostName: process.env.QnAEndpointHostName
});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'No match! Try asking differently',
    qnaThreshold: 0.3
});

// Create your bot
var bot = new builder.UniversalBot(connector,
    [
        function(session)
        {
            if (session.message == "Hello")
			{
				builder.Prompts.text(session, "What is your name?");
			}
			else
			{
				session.send("Please enter \"Hello\"...");
				session.replaceDialog("/");
			}
        },
		function(session,results)
		{
			session.send(`Great to meet you, ${results.response}, I hope that I can answer your questions!`)
			session.replaceDialog("Tutorial");
		}
    ]);

// A hello message at the beginning that tells the user how to start interacting with the bot
bot.on('conversationUpdate', function(message) 
    {
        // Send a hello message when bot is added
        if (message.membersAdded) 
        {
            message.membersAdded.forEach(function(identity) 
            {
                if (identity.id === message.address.bot.id) 
                {
                    var msg = new builder.Message().address(message.address).addAttachment(card.welcome);
                    bot.send(msg);
                }
            });
        }
    });

bot.set('storage', tableStorage);

bot.dialog("QnADialog",basicQnAMakerDialog);

bot.dialog("Tutorial", [
	function(session)
	{
		session.send("These are currently what I can answer about DT for you: \n\nLocation\n\nHours\n\nHelp/Support\n\nRecords Request");
		session.replaceDialog("QnADialog");
	}
]);