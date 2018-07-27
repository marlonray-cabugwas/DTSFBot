var test = {
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

var welcome = {
	"contentType": "application/vnd.microsoft.card.adaptive",
	"content" : 
	{
	   "$schema":"http://adaptivecards.io/schemas/adaptive-card.json",
	   "type":"AdaptiveCard",
	   "version":"1.0",
	   "body":
		[
	      {
	         "type":"Container",
	         "items":
			  [
	            {
	               "type":"TextBlock",
	               "text":"Question and Answer Bot",
	               "weight":"bolder",
	               "size":"medium"
	            }
	         ]
	      },
	      {
	         "type":"Container",
	         "items":
			  [
	            {
	               "type":"TextBlock",
	               "text":"Hello! I am the Question and Answer Bot for the Department of Technology, SF. I am still a work in progress, but I can provide general answers about DT.",
	               "wrap":true
	            },
	            {
	               "type":"TextBlock",
	               "text":"To begin just ask your question!\n\nHere is what I can currently answer about DT:\n\n*Location\n\n*Time\n\n*Help/Support Contact\n\n*Records Request",
	               "wrap":true
	            },
	            {
	               "type":"TextBlock",
	               "text":"If you would like to go to the Department of Technology Site click on the button below:",
	               "wrap":true
	            }
	         ]
	      }
	   ],
	   "actions":
		[
	      {
	         "type":"Action.OpenUrl",
	         "title":"DTSF Website",
	         "url":"http://tech.sfgov.org/"
	      }
	   ]}};

var noAns = {
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
        };

exports.noAns = noAns;
exports.test = test;
exports.welcome = welcome;