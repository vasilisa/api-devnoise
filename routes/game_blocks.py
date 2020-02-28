"""users routes"""
from flask import current_app as app, jsonify, request

from models import GameBlocks, BaseObject
from collections import OrderedDict
import numpy
import json


@app.route('/game_blocks/<game_id>/<block_id>', methods=["GET"])
def get_game_block(game_id,block_id): 
    
    query = GameBlocks.query.filter(GameBlocks.game_id==game_id, GameBlocks.block_number==block_id)
    if query != None:
        print('Exists')
        
    block  = query.first_or_404()

    # format the query into a dictionnary first:

    result                   = {}
    # arr_block                = numpy.array(participants.get_block_number()[0].replace('  ',' ').split(' '))
    # result['block_number']   = {i : arr_block[i] for i in range(0, len(arr_block))}
    arr_block                = block.get_block_number()[0].replace('  ',' ').split(' ')
    result['block_number']   = arr_block[0]

    # arr_block_type           = numpy.array(participants.get_block_type()[0:].replace('  ',' ').split(' '))
    # result['block_type']     = {0: arr_block_type[0]}
    arr_block_type           = block.get_block_type()[0:].replace('  ',' ').split(' ')
    result['block_type']     = arr_block_type[0]

    # arr_block_feedback       = numpy.array(participants.get_block_feedback()[0].replace('  ',' ').split(' '))
    # result['block_feedback'] = {0: arr_block_feedback[0]}

    arr_block_feedback       = block.get_block_feedback()[0].replace('  ',' ').split(' ')
    result['block_feedback'] = arr_block_feedback[0]
    
    
    arr_reward_1             = numpy.array(block.get_reward_1()[1:-1].replace('  ',' ').split(' '))
    result['reward_1']       = {i : arr_reward_1[i] for i in range(0, len(arr_reward_1))}

    arr_reward_2             = numpy.array(block.get_reward_2()[1:-1].replace('  ',' ').split(' '))
    result['reward_2']       = {i : arr_reward_2[i] for i in range(0, len(arr_reward_2))}

    arr_reward_1_th          = numpy.array(block.get_reward_1_th()[1:-1].replace('  ',' ').split(' '))
    result['th_reward_1']    = {i : arr_reward_1_th[i] for i in range(0, len(arr_reward_1_th))}

    arr_reward_2_th          = numpy.array(block.get_reward_2_th()[1:-1].replace('  ',' ').split(' '))
    result['th_reward_2']    = {i : arr_reward_2_th[i] for i in range(0, len(arr_reward_2_th))}

    arr_reward_left          = numpy.array(block.get_reward_left()[1:-1].replace('  ',' ').split(' '))
    result['reward_left']    = {i : arr_reward_1[i] for i in range(0, len(arr_reward_left))}

    arr_reward_right         = numpy.array(block.get_reward_right()[1:-1].replace('  ',' ').split(' '))
    result['reward_right']   = {i : arr_reward_right[i] for i in range(0, len(arr_reward_right))}
    
    arr_position             = numpy.array(block.get_position()[1:-1].replace('  ',' ').split(' '))
    result['position']       = {i : arr_position[i] for i in range(0, len(arr_position))}

    app.logger.info(result)
    return jsonify(result), 200 # json.dumps(result)

