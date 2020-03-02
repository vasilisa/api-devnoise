"""User model"""
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, DateTime, Float, VARCHAR

from models.db import Model
from models.base_object import BaseObject


class Games(BaseObject, Model):

    id = Column(Integer, primary_key=True)

    game_id            = Column(Integer, nullable=False)
    block_number       = Column(Integer, nullable=False)
    block_feedback     = Column(Integer, nullable=False)
    symbol_1           = Column(VARCHAR(length=1000), nullable=False) 
    symbol_2           = Column(VARCHAR(length=1000), nullable=False)
    # shape              = Column(VARCHAR(length=100), nullable=False) 
    # color              = Column(VARCHAR(length=100), nullable=False)
    
    

    def get_id(self):
        return str(self.id)

    def get_game_id(self):
        return str(self.game_id)
    
    def get_block_number(self):
        return str(self.block_number)

    # sanity check not really used here 
    def get_block_feedback(self):
        return str(self.block_feedback)

    def get_symbol_1(self):
        return str(self.symbol_1)

    def get_symbol_2(self):
        return str(self.symbol_2)

    # def get_shape(self):
    #     return str(self.shape)

    # def get_color(self):
    #     return str(self.color)

    def errors(self):
        errors = super(Games, self).errors()
        return errors
 
     

