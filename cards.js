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
exports.test = test;