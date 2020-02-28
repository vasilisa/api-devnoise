"""users routes"""
from flask import current_app as app, jsonify, request

from models import ParticipantsDataBonus, GameBlocks,BaseObject, db
from collections import OrderedDict
from datetime import datetime
import json
from sqlalchemy.sql.expression import func

@app.route("/participants_data_bonus/create/<participant_id>/<prolific_id>", methods=["POST", "GET"])

def create_participant_bonus(participant_id,prolific_id):
     content     = request.json        
     participant = ParticipantsDataBonus()

     participant.participant_id  = int(participant_id)
     participant.prolific_id     = str(prolific_id)
     participant.bonus           = str(content['bonus'])
     participant.date            = content['date']
     participant.datetime        = datetime.now() 
     
     BaseObject.check_and_save(participant)

     result = dict({"success": "yes"})    

     return jsonify(result)
