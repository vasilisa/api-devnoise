"""User model"""
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, DATETIME, Float, VARCHAR, Text, Boolean, String, DateTime
from models.db import Model
from models.base_object import BaseObject
import datetime 

class Test(BaseObject, Model):

    '''
        This is the table where we put the collected QUESTIONNAIRE data from the participants in the RLVARTASK: this only contains the responses but not the question content which is stored in the JS object on the server. 
        
    '''
    id              = Column(Integer, primary_key=True) 
    participant_id  = Column(BigInteger,nullable=True)
    prolific_id     = Column(String(128)) 
    study_id        = Column(String(128)) # STUDY ID from PROLIFIC 
    longit_id       = Column(Integer, nullable=True) # the longitudinal time stamp: 1 (first), 2(second) etc repetition of the questionnaires to the SAME users 
    codeversion     = Column(String(128))
    beginexp        = Column(DateTime, nullable=True) # begin 
    endexp          = Column(DateTime, nullable=True)
    datastring      = Column(Text, nullable=True) # Data for the task 
    
    debriefed       = Column(Boolean)
    status          = Column(Integer, nullable = True)
    bonus           = Column(Text, nullable=True) # Data for the task 
    feedback        = Column(Text) # Data for the task


    def __init__(self,prolific_id): # self, hitid, ipaddress, assignmentid, workerid
        

        print('TASK INIT')

        self.debriefed      = False
        self.participant_id = 0 # participant_id  
        self.prolific_id    = prolific_id     
        self.study_id       = 'curdev' # study_id        
        self.longit_id      = 1 # longit_id # TO BE DECIDED WHERE TO PUT IT MAYBE IN THE CONFIG LIKE CODE-VERSION -> longit_id 
     

        self.debriefed      = False
        self.status         = 1
        self.beginexp       = datetime.datetime.now() 

    def get_id(self):
        return str(self.id)

    def get_participant_id(self):
        return str(self.participant_id)

    def get_prolific_id(self):
        return str(self.prolific_id)

    def get_study_id(self):
        return str(self.study_id)

    def get_longit_id(self):
        return str(self.longit_id)

    def get_block_number(self):
        return str(self.block_number)

    def get_block_name(self):
        return str(self.block_name)

    def get_question_ids(self): 
        return str(self.question_ids)

    def get_answers(self): 
        return str(self.answers)

    def get_completed(self): 
        return str(self.completed)
    
    def get_date(self): 
        return str(self.date)

    def get_datetime(self): 
        return str(self.datetime)
    
    def errors(self):
        errors = super(Test, self).errors()
        return errors
 
     

