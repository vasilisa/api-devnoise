"""User model"""
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, DATETIME, Float, VARCHAR,Text

from models.db import Model
from models.base_object import BaseObject

class ParticipantsDataBonus(BaseObject, Model):

    '''
        This is the table where we put the collected data from the participants in the RLVARTASK: this excludes the task specifications which 
        are stored separately in the Participants and Participants_blocks tables 
    
    '''
    id = Column(Integer, primary_key=True)

    participant_id    = Column(BigInteger,nullable=False)
    prolific_id       = Column(VARCHAR(length=200))
    date              = Column(VARCHAR(length=100), nullable=False) # the date at which the questionnaire has been answered   
    datetime          = Column(DATETIME,nullable=False)
    bonus             = Column(VARCHAR(length=100), nullable=False)
    
     # uncompleted if this is not the last block or "aborted" if the user closes the browser or hits the return button?   
     
    def get_id(self):
        return str(self.id)

    def get_participant_id(self):
        return str(self.participant_id)

    def get_prolific_id(self):
        return str(self.prolific_id)

    def get_bonus(self): 
        return str(self.bonus)

    def errors(self):
        errors = super(ParticipantsDataBonus, self).errors()
        return errors
 
     

