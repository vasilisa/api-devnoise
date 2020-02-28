"""User model"""
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, Float, VARCHAR
from models.db import Model
from models.base_object import BaseObject
import numpy


class GameBlocks(BaseObject, Model):

    id = Column(Integer, primary_key=True)

    game_id             = Column(Integer,nullable=False)
    block_number        = Column(Integer,nullable=False)
    block_type          = Column(VARCHAR(length=1000),nullable=False)
    block_feedback      = Column(Integer,nullable=False)
    reward_1            = Column(VARCHAR(length=1000),nullable=False)      
    reward_2            = Column(VARCHAR(length=1000),nullable=False)
    th_reward_1         = Column(VARCHAR(length=1000),nullable=False)
    th_reward_2         = Column(VARCHAR(length=1000),nullable=False)
    position            = Column(VARCHAR(length=1000),nullable=False)
    reward_left         = Column(VARCHAR(length=1000),nullable=False)
    reward_right        = Column(VARCHAR(length=1000),nullable=False)
    maxreward           = Column(Float(23),nullable=False)
    chance              = Column(Float(23),nullable=False)
    
    def get_id(self):
        return str(self.id)

    def get_game_id(self):
        return str(self.game_id)

    def get_block_number(self):
        return str(self.block_number)

    def get_block_type(self):
        return str(self.block_type)

    def get_reward_1(self):
        return str(self.reward_1)

    def get_reward_2(self):
        return str(self.reward_2)

    def get_reward_1_th(self):
        return str(self.th_reward_1)

    def get_reward_2_th(self):
        return str(self.th_reward_2)

    def get_position(self):
        return str(self.position)

    def get_reward_left(self):
        return str(self.reward_left)

    def get_reward_right(self):
        return str(self.reward_right)

    def get_block_feedback(self):
        return str(self.block_feedback)

    def get_maxreward(self):
        return str(self.maxreward)

    def get_chance(self):
        return str(self.chance)


    def errors(self):
        errors = super(GameBlocks, self).errors()
        return errors


