"""users routes"""
from flask import current_app as app, jsonify, request
from models import ParticipantsGame, BaseObject
from collections import OrderedDict
import numpy
from datetime import datetime

import json

@app.route('/participants_game/<participant_id>/<prolific_id>/<date>', methods=['GET'])
# Change to  uniformaly draw a number between 1 and 100 (for 100 games) and assign it as a game, then fill in the table ParticipantsGame based on the prolific_id and participant_id

def generate_game_id(participant_id,prolific_id,date):
	
	participant = ParticipantsGame()
	game_id     = numpy.random.randint(1,100,1)[0]

	participant.participant_id  = int(participant_id)
	participant.prolific_id     = str(prolific_id)
	participant.game_id         = int(game_id)
	participant.date            = date
	participant.datetime        = datetime.now()


	BaseObject.check_and_save(participant)

    
	# format the query into a dictionnary first:
	result              = {}
	result['game_id']   = str(game_id)
	result["success"]   = "yes"

	app.logger.info(result)
	return jsonify(result)  

 
