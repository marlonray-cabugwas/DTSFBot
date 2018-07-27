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
	               "text":"To begin just ask your question!\n\nHere is what I can currently answer about DT:\n\n*CISCO\n\n*Location\n\n*Time\n\n*Help/Support Contact\n\n*Records Request\n\n*Mission Statement",
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

exports.welcome = welcome;