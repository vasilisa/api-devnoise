"""User model"""
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, DateTime, Float, VARCHAR

from models.db import Model
from models.base_object import BaseObject


class Games(BaseObject, Model):

    id = Column(Integer, primary_key=True)

    participant_id           = Column(BigInteger, nullable=False)
    game_id                  = Column(Integer, nullable=False)
    blocks_numbers           = Column(VARCHAR(length=100), nullable=False)
    blocks_feedback          = Column(VARCHAR(length=100), nullable=False)
    shape_1                  = Column(VARCHAR(length=100), nullable=False) 
    shape_2                  = Column(VARCHAR(length=100), nullable=False)
    color_1                  = Column(VARCHAR(length=100), nullable=False)
    color_2                  = Column(VARCHAR(length=100), nullable=False)
    

    def get_id(self):
        return str(self.id)

    def get_participant_id(self):
        return str(self.participant_id)

    def get_game_id(self):
        return str(self.game_id)
    
    def get_blocks_numbers(self):
        return str(self.blocks_numbers)

    def get_blocks_feedback(self):
        return str(self.blocks_feedback)

    def get_shape_1(self):
        return str(self.shape_1)

    def get_shape_2(self):
        return str(self.shape_2)

    def get_color_1(self):
        return str(self.color_1)

    def get_color_2(self):
        return str(self.color_2)

    def errors(self):
        errors = super(Games, self).errors()
        return errors
 
     

