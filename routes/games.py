"""users routes"""
from flask import current_app as app, jsonify, request
from models import Games, BaseObject, db
from collections import OrderedDict
import numpy as np
import json
import glob


@app.route('/games/<game_id>/<block_id>', methods=['GET'])

def get_games(game_id,block_id):

    query = Games.query.filter(Games.game_id==game_id, Games.block_number==block_id)
    if query != None:
        print('Exists')
        
    block  = query.first_or_404()

    # format the query into a dictionnary first:
	
    result                   = {}
    arr_block                = block.get_block_number()[0].replace('  ',' ').split(' ')
    result['block_number']   = arr_block[0]

    arr_block_feedback       = block.get_block_feedback()[0].replace('  ',' ').split(' ')
    result['block_feedback'] = arr_block_feedback[0]
    
    symbols         = {}
    symbols[str(0)] = str(block.get_symbol_1())
    symbols[str(1)] = str(block.get_symbol_2())

    result['symbols'] = symbols

    app.logger.info(result)
    return jsonify(result), 200 

    