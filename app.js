var card = {
    'contentType': 'application/vnd.microsoft.card.adaptive',
    'content': {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'type': 'AdaptiveCard',
        'version': '1.0',
        'body': [
            {
                'type': 'Container',
                'speak': '<s>Hello!</s><s>Are you looking for a flight or a hotel?</s>',
                'items': [
                    {
                        'type': 'ColumnSet',
                        'columns': [
                            {
                                'type': 'Column',
                                'size': 'auto',
                                'items': [
                                    {
                                        'type': 'Image',
                                        'url': 'https://placeholdit.imgix.net/~text?txtsize=65&txt=Adaptive+Cards&w=300&h=300',
                                        'size': 'medium',
                                        'style': 'person'
                                    }
                                ]
                            },
                            {
                                'type': 'Column',
                                'size': 'stretch',
                                'items': [
                                    {
                                        'type': 'TextBlock',
                                        'text': 'Hello!',
                                        'weight': 'bolder',
                                        'isSubtle': true
                                    },
                                    {
                                        'type': 'TextBlock',
                                        'text': 'Are you looking for a flight or a hotel?',
                                        'wrap': true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        'actions': [ /* */ ]
    }
};


var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

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

// Create your bot
var bot = new builder.UniversalBot(connector,
    [
        function(session)
        {
            session.send('Hello User!');
        }
    ]);

bot.on('conversationUpdate', function(message) 
    {
        // Send a hello message when bot is added
        if (message.membersAdded) 
        {
            message.membersAdded.forEach(function(identity) 
            {
                if (identity.id === message.address.bot.id) 
                {
                    var msg = new builder.Message().address(message.address).addAttachment(card);
                    bot.send(msg);
                }
            });
        }
    });
   
bot.set('storage', tableStorage);

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
}
);