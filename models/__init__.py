# These 2 imports are general for any api 
from models.api_errors import ApiErrors
from models.base_object import BaseObject

# These are the custom models to import
from models.game_blocks import GameBlocks
from models.participants_data import ParticipantsData
from models.games import Games
from models.participants_game import ParticipantsGame
from models.participants_data_bonus import ParticipantsDataBonus
from models.test import Test




__all__ = (
    'ApiErrors',
    'BaseObject',
    'GameBlocks',
    'Games',
    'ParticipantsData',
    'ParticipantsDataBonus', 
    'ParticipantsGame',
    'Test' 
)
