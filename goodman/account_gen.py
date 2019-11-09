# FIRST: AUTHENTICATION
# This file will open a browser (and provide a link) to log in with a google account

from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import json
import pymongo

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

SAMPLE_SPREADSHEET_ID = '1fdAiKz07MDMHXxb5hdwRBVwIG3EaPe4i-IuBMdLAZpk'
SAMPLE_RANGE_NAME = 'Form Responses 1!A:I' # this range shit is garbo

# mongo stuff
client = pymongo.MongoClient('mongodb+srv://johnchapple:hack19password@cluster0-dwemy.mongodb.net/test?retryWrites=true&w=majority')
db = client.politalkdb
posts = db.Users

# this was almost all grabbed straight from an example on the API docs
def sheets_grab():
	creds = None
	if os.path.exists('token.pickle'):
		with open('token.pickle', 'rb') as token:
			creds = pickle.load(token)
	if not creds or not creds.valid:
		if creds and creds.expired and creds.refresh_token:
			creds.refresh(Request())
		else:
			flow = InstalledAppFlow.from_client_secrets_file(
				'credentials.json', SCOPES)
			creds = flow.run_local_server(port=0)
		with open('token.pickle', 'wb') as token:
			pickle.dump(creds, token)
	
	service = build('sheets', 'v4', credentials=creds)
	
	sheet = service.spreadsheets()
	result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,range=SAMPLE_RANGE_NAME).execute()
	values = result.get('values', []) # this is a 2d array
			
	return values
		
def political_calc(answers):	
	#print('calc')
	score = 5
		
	if answers[4] == 'The government cannot afford to do more to help the needy.':
		score -= 1
	if answers[4] == 'The government should do more to help the needy, even if it means more debt.':
		score += 1
		
	if answers[5] == 'Government is always wasteful and inefficient':
		score -= 1
	if answers[5] == 'Government does a better job than people give it credit for':
		score += 1
		
	if answers[6] == 'Government regulation of business usually does more harm than good':
		score -= 1
	if answers[6] == 'Government regulation of business is necessary to protect the public interest':
		score += 1
		
	if answers[7] == 'Abortion should be allowed by society in some fashion':
		score -= 1
	if answers[7] == 'Abortion should not be allowed in all circumstances':
		score += 1
		
	if answers[8] == 'Stricter environmental laws and regulations cost too many jobs and hurt the economy':
		score -= 1
	if answers[8] == 'Stricter environmental laws and regulations are worth the cost':
		score += 1
		
	return score
	
def make_json(user):
	score = political_calc(user)
	interests = user[3].split(' ')
	
	#x = 'blah'
	#x = '"username":{0}, "password":{1}, "score":{2}"'.format(user[1], user[2], score)
	
	temp_dict = {}
	index = 0
	for item in interests:
		temp_dict[str(index)] = item
		index += 1
	
	x = {
		"username": user[1],
		"password": user[2],
		"score": score,
		"interests": temp_dict
	}
		
	#result = json.dumps(x)
	#return result
	return x
	
def mongo(user_list):
	new_result = posts.insert_many(user_list)
	
	return 0
	
def main():
	user_sheet = sheets_grab()
	#print(len(user_sheet))
	user_list = []

	for user in user_sheet:
		if user[0] == 'Timestamp': # skip header
			continue
		else: # set variables, figure out how to output this properly later
			this_name = user[1]
			garbage = "false"
			
			cursor = posts.find({})
			
			for entity in cursor:
				if entity["username"] == this_name:
					garbage = "skip"
					
			if garbage == "false":
				new = make_json(user)
				user_list.append(new)
				
			garbage = "false"
		
	if len(user_list) > 0:
		mongo(user_list)
			
	
if __name__ == '__main__':
	main()