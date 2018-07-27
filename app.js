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
var bot = new builder.UniversalBot(connector);

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

bot.dialog("/",basicQnAMakerDialog);

// override
basicQnAMakerDialog.respondFromQnAMakerResult = function(session, qnaMakerResult){
    // Save the question
    var question = session.message.text;
    session.conversationData.userQuestion = question;

    // boolean to check if the result is formatted for a card
    var isCardFormat = qnaMakerResult.answers[0].answer.includes(';');

    if(!isCardFormat){
        // Not semi colon delimited, send a normal text response 
        session.send(qnaMakerResult.answers[0].answer);
    }else if(qnaMakerResult.answers && qnaMakerResult.score >= 0.5){
        
        var qnaAnswer = qnaMakerResult.answers[0].answer;
        
                var qnaAnswerData = qnaAnswer.split(';');
                var title = qnaAnswerData[0];
                var description = qnaAnswerData[1];
                var url = qnaAnswerData[2];
                var imageURL = qnaAnswerData[3];
        
                var msg = new builder.Message(session)
                msg.attachments([
                    new builder.HeroCard(session)
                    .title(title)
                    .subtitle(description)
                    .images([builder.CardImage.create(session, imageURL)])
                    .buttons([
                        builder.CardAction.openUrl(session, url, "Learn More")
                    ])
                ]);
        }
    session.send(msg).endDialog();
}

basicQnAMakerDialog.defaultWaitNextMessage = function(session, qnaMakerResult){
    // saves the user's question
    session.conversationData.userQuestion = session.message.text; 
    
    if(!qnaMakerResult.answers){
        let msg = new builder.Message(session)
        .addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                type: "AdaptiveCard",
                body: [
                    {
                        "type": "TextBlock",
                        "text": `${session.conversationData.userQuestion}`,
                        "size": "large",
                        "weight": "bolder",
                        "color": "accent",
                        "wrap": true
                    },
                    {
                        "type": "TextBlock",
                        "text": `Sorry, no answer found in QnA service`,
                        "size": "large",
                        "weight": "regular",
                        "color": "dark",
                        "wrap": true
                    }
                ]
            }
        });
        session.send(msg);
    }
    session.endDialog();
}

bot.dialog('/', basicQnAMakerDialog);