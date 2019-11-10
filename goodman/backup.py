# FIRST: AUTHENTICATION
# https://cloud.google.com/docs/authentication/getting-started
# Need to denote a file path to your API key .json

# sentiment analysis
import argparse
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import pymongo

client = pymongo.MongoClient('mongodb+srv://johnchapple:hack19password@cluster0-dwemy.mongodb.net/test?retryWrites=true&w=majority')
db = client.politalkdb
posts = db.Users

def print_result(annotations):
        score = annotations.document_sentiment.score
        magnitude = annotations.document_sentiment.magnitude

        for index, sentence in enumerate(annotations.sentences):
                sentence_sentiment = sentence.sentiment.score
                print('Sentence {} has a sentiment score of {}'.format(index, sentence_sentiment))

        print('Overall Sentiment: score of {} with magnitude of {}'.format(score, magnitude))

        return 0

def analyze(filename):
        client = language.LanguageServiceClient()

        with open(filename, 'r') as review_file:
                content = review_file.read()

        document = types.Document(
                content = content,
                type = enums.Document.Type.PLAIN_TEXT)
        annotations = client.analyze_sentiment(document=document)

        print_result(annotations)
		
def mongo(target, score):
	#target is the chat ID
	coin_amt = calc_return(score)
	
	posts.update_one({'_id':target}, {"$coin_amt": coin_amt}, upsert=False) # update existing User document field "coin_amt"

	return 0
	
def calc_return(score):
	coin_count = (1000 * score[0]) + (100 * score[1])

	return coin_count

if __name__ == '__main__':
		parser = argparse.ArgumentParser(description = __doc__,formatter_class = argparse.RawDescriptionHelpFormatter)
		parser.add_argument('filename',help = 'The filename of the item you\'d like to analyze.')
		parser.add_argument('chatid',help = 'target chat id')
        args = parser.parse_args()
		
		analyze(args.filename)
