"""User model"""
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, DATETIME, VARCHAR

from models.db import Model
from models.base_object import BaseObject

class ParticipantsGame(BaseObject, Model):

    '''
        This is the table where we put the collected data from the participants in the RLVARTASK: this excludes the task specifications which 
        are stored separately in the Participants and Participants_blocks tables 
    
    '''
    id = Column(Integer, primary_key=True)

    participant_id  = Column(BigInteger, nullable=False)
    game_id         = Column(Integer, nullable=False)
    prolific_id     = Column(VARCHAR(length=200))
    date            = Column(VARCHAR(length=100), nullable=False) # the date at which the questionnaire has been answered   
    datetime        = Column(DATETIME,nullable=False)
    
    def get_id(self):
        return str(self.id)

    def get_participant_id(self):
        return str(self.participant_id)

    def get_game_id(self):
        return str(self.game_id)

    def errors(self):
        errors = super(ParticipantsGame, self).errors()
        return errors
 
     

