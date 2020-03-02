"""users routes"""
from flask import current_app as app, jsonify, request

from models import ParticipantsData, GameBlocks,BaseObject, db
from collections import OrderedDict
import numpy
from datetime import datetime
import json
import glob
from sqlalchemy.sql.expression import func


@app.route("/participants_data/last_participant_id", methods=["GET"])
def get_last_participant_id():

	query  = db.db.session.query(func.max(ParticipantsData.participant_id)).first_or_404()

	if query[0] is not None:
		result = dict({"new_participant_id": str(int(query[0]) + 1)})
	else:
		result = dict({"new_participant_id": str(1)})

	return jsonify(result)

@app.route("/participants_data/create/<participant_id>/<block_id>/<prolific_id>", methods=["POST", "GET"])
def create_participant(participant_id, block_id, prolific_id):
     content     = request.json        
     participant = ParticipantsData()

     participant.participant_id    = int(participant_id)
     participant.prolific_id       = str(prolific_id)
     participant.block_number      = int(content['block_number'])
     participant.chosen_symbols    = str(content['chosen_symbols'])
     participant.chosen_positions  = str(content['chosen_positions'])
     participant.chosen_rewards    = str(content['chosen_rewards'])
     participant.unchosen_rewards  = str(content['unchosen_rewards'])
     participant.reaction_time     = str(content['reaction_times'])
     participant.game_id           = int(content['game_id'])


     # Add the performance metrics here 
     participant.block_perf = content['block_perf']
     participant.completed  = str(content['completed']) # could take up three values: "no" for the all but the last pushed block, 
     # "yes" for the last finished block 
     # " aborted" : if the user closes the browser or is idle for more than 10 min on the task, the task window closes itseld 

     participant.date      = content['date']
     participant.datetime  = datetime.now() 
     
     
     BaseObject.check_and_save(participant)

     result = dict({"success": "yes"})    

     return jsonify(result)

# Get the bonus information: 
@app.route("/participants_data/score/<participant_id>/<game_id>/<prolific_id>", methods=["POST", "GET"])

def get_participant_score(participant_id,game_id,prolific_id):

    # If the prolific_id is provided than look up based on the prolific UID

    if prolific_id =='undefined': 
        query      = ParticipantsData.query.filter_by(participant_id=participant_id)
    else:
        query      = ParticipantsData.query.filter_by(prolific_id=prolific_id)


    rel_perf   = query.all()    
    rel_perf_blocks = numpy.concatenate([numpy.array(rel_perf[i].get_block_perf()[1:-1].split(',')[-2:], dtype=numpy.float) for i in range(len(rel_perf))])
    
    meanperf        = numpy.mean(rel_perf_blocks[2:])
    
    # Get the maxperf per block from the other table 
    query     = GameBlocks.query.filter_by(game_id=game_id)
    max_perf  = query.all()    

   
    max_perf_blocks = numpy.concatenate([numpy.array(max_perf[i].get_maxreward().split(',')[-1:], dtype=numpy.float) for i in range(len(max_perf))])
    meanmaxperf     = numpy.mean(max_perf_blocks[2:]) # exclude the first 2 training sessions 

    ratio = meanperf/meanmaxperf

    if ratio < 0.5: 
        bonus = 0
    elif ratio >= 0.7: 
         bonus = 3.0
    else:
        bonus = 1.5
    
    result          = {}
    result['bonus'] = str(bonus) 

    app.logger.info(bonus)

    return jsonify(result), 200 # json.dumps(result)

# To ge the data from this table 
@app.route('/participants_data/<participant_id>/<block_id>', methods=['GET'])

def get_participant_data(participant_id,block_id):
    query = ParticipantsData.query.filter(ParticipantsData.participant_id==participant_id,ParticipantsData.participant_id==block_id)
    
    if query != None:
        print('Exists')
        
    block  = query.first_or_404()

    # format the query into a dictionnary first:
     
    result                     = {}

    arr_participant_id         = block.get_participant_id()[0].replace('  ',' ').split(' ')
    result['participant_id']   = arr_participant_id[0]

    arr_prolific_id            = block.get_prolific_id().replace('  ',' ').split(' ')
    result['prolific_id']      = arr_prolific_id

    arr_block                  = block.get_block_number()[0].replace('  ',' ').split(' ')
    result['block_number']     = arr_block[0]

    arr_date                   = block.get_date()
    result['date']             = arr_date

    arr_datetime               = block.get_datetime()
    result['datetime']         = arr_datetime

    arr_chosen_symbols         = block.get_chosen_symbols().replace('  ',' ').split(' ') 
    result['chosen_symbols']   = arr_chosen_symbols 

    arr_chosen_positions       = block.get_chosen_positions().replace('  ',' ').split(' ') 
    result['chosen_positions'] = arr_chosen_symbols

    arr_chosen_rewards         = block.get_chosen_rewards().replace('  ',' ').split(' ') 
    result['chosen_rewards']   = arr_chosen_rewards 
    
    arr_unchosen_rewards       = block.get_unchosen_rewards().replace('  ',' ').split(' ') 
    result['unchosen_rewards'] = arr_unchosen_rewards 
     
    arr_rt                     = block.get_reaction_time().replace('  ',' ').split(' ') 
    result['reaction-times']   = arr_rt

    arr_block_perf             = block.get_block_perf().replace('  ',' ') 
    result['block_perf']       = arr_block_perf

    arr_completed             = block.get_completed().replace('  ',' ')
    result['completed']       = arr_completed

    
    app.logger.info(result)
    return jsonify(result), 200 



