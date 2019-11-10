# FIRST: AUTHENTICATION
# https://cloud.google.com/docs/authentication/getting-started
# Need to denote a file path to your API key .json

# sentiment analysis
import argparse
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import pymongo
from bson.objectid import ObjectId

client = pymongo.MongoClient('mongodb+srv://johnchapple:hack19password@cluster0-dwemy.mongodb.net/test?retryWrites=true&w=majority')
db = client.politalkdb
posts = db.Chats

def print_result(score, magnitude):
	#score = annotations.document_sentiment.score
	#magnitude = annotations.document_sentiment.magnitude
	
	#for index, sentence in enumerate(annotations.sentences):
	#	sentence_sentiment = sentence.sentiment.score
	#	print('Sentence {} has a sentiment score of {}'.format(index, sentence_sentiment))
		
	print('Overall Sentiment: score of {} with magnitude of {}'.format(score, magnitude))
	
	#return 0
	
def analyze():
	client = language.LanguageServiceClient()
	
	with open('chat.txt', 'r') as review_file:
		content = review_file.read()
		
	document = types.Document(
		content = content,
		type = enums.Document.Type.PLAIN_TEXT)
	annotations = client.analyze_sentiment(document=document)
	
	#print_result(annotations)
	set = res(annotations)
	return set
	
def res(annotations):
	score = annotations.document_sentiment.score
	magnitude = annotations.document_sentiment.magnitude
	
	set = [score, magnitude]
	print_result(score, magnitude)
	
	return set
	
def create_file(array_of_strings):
	f = open("chat.txt","w+")
	for string in array_of_strings:
		f.write(string)
	f.close()
	
def calc_return(score): # DETERMINE HOW MANY COINS TO AWARD
	coin_count = (1000 * score[0]) + (100 * score[1])
	return coin_count
	
def mongo(target, score): # UPDATE MONGO DB
	coin_amt = calc_return(score)
	tired = ObjectId(target)
	chat = posts.find_one({'_id':tired})
	print("UPDATING ", tired)
	#print(chat)
	posts.update_one({'_id':tired}, {"$set": {"coin_amt":coin_amt}}, upsert=False) # update existing User document field "coin_amt"
	#return 0
	
if __name__ == '__main__':
	parser = argparse.ArgumentParser(description = __doc__,formatter_class = argparse.RawDescriptionHelpFormatter)
	parser.add_argument('filename',help = 'The filename of the item you\'d like to analyze.')
	parser.add_argument('chatid',help = 'target chat id')
	args = parser.parse_args()
	print(args)
	#print(args.filename)
	#print(args.chatid)
	create_file(args.filename) # args.filename is actually an array of strings 
	set = analyze() # uses the text file made from create_file
	mongo(args.chatid, set)