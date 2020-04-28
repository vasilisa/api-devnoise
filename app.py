'''
	This appy has changed to incorporate external JS code for perceptual decision - making task running on the same api
	April 2020 VS for covid19 study  
'''
import os
import logging

import warnings
import subprocess
from flask_cors import CORS
from flask import Flask, jsonify, request, abort, Response, make_response, render_template
from flask_mail import Mail, Message 

from models.db import db
from models.install import install_models

from config import config  


# to test well functioning : https://udecmac.osc-fr1.scalingo.io/testmethod
warnings.filterwarnings("ignore")


# Database setup
# from db import db_session
# from models import Task 
# from config import config

# Set up logging
logfilepath = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           config.get("Server Parameters", "logfile"))
# --- Logging ---- # 
loglevels = [logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR, logging.CRITICAL]
loglevel  = loglevels[config.getint("Server Parameters", "loglevel")]
logging.basicConfig( filename=logfilepath, format='%(asctime)s %(message)s', level=loglevel )

# constants
CODE_VERSION  = config.get('Task Parameters', 'code_version')

# mail = Mail()
app  = Flask(__name__)

app.config.update(dict(
    DEBUG               = True,  #config.get('Server Parameters', 'debug'), # same as for the server in general 
    MAIL_SERVER         = 'smtp.gmail.com', # config.get('Mail Parameters', 'MAIL_SERVER'), # same as for the server in general 
    MAIL_PORT           = 465, # config.get('Mail Parameters', 'MAIL_PORT'), # same as for the server in general 
    MAIL_USE_TLS        = False, # config.get('Mail Parameters', 'MAIL_USE_TLS'), # same as for the server in general 
    MAIL_USE_SSL        = True, # config.get('Mail Parameters', 'MAIL_USE_SSL'), # same as for the server in general 
    MAIL_USERNAME       = 'irm.vasilisa@gmail.com', # config.get('Mail Parameters', 'MAIL_USERNAME'), # same as for the server in general 
    MAIL_PASSWORD       = 'inference', # config.get('Mail Parameters', 'MAIL_PASSWORD'), # same as for the server in general 
    MAIL_DEFAULT_SENDER = 'irm.vasilisa@gmail.com'
))



# this is for sending confirmation mail once the task is over you pass all the app config to the Mail constructor
# -------------------------
# --- DB configuration ---- 
# -------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# app.config['SQLALCHEMY_DATABASE_URI'] = config.get('Database Parameters','database_url')
# 'mysql://root:pwd@localhost/covid19' # maybe put in the cofig 

db.init_app(app)
CORS(app)

with app.app_context():
    install_models()
    import routes

mail = Mail(app)
# mail.init_app(app) # this is for sending confirmation mail once the task is over you pass all the app config to the Mail constructor

#----------------------------------------------
# ExperimentError Exception, for db errors, etc.
#----------------------------------------------

# Possible ExperimentError values. MODIFY 
experiment_errors = dict(
    status_incorrectly_set                        = 1000,
    prolific_study_participant_longit_id_not_set  = 1001,
    tried_to_quit                                 = 1011,
    intermediate_save                             = 1012,
    improper_inputs                               = 1013,
    page_not_found                                = 404,
    in_debug                                      = 2005,
    unknown_error                                 = 9999
)

class ExperimentError(Exception):
    """
    Error class for experimental errors, such as subject not being found in
    the database.
    """
    def __init__(self, value):
        self.value = value
        self.errornum = experiment_errors[self.value]
    def __str__(self):
        return repr(self.value)
    def error_page(self, request):
        return render_template('error.html',
                               errornum=self.errornum,
                               **request.args)

@app.errorhandler(ExperimentError)
def handleExpError(e):
    """Handle errors by sending an error page."""
    return e.error_page( request )


# @app.teardown_request
# def shutdown_session(exception=None):
#    db_session.remove()

# --- TESTING THE SERVER IS WORKING -----------
@app.route('/testmethod', methods=['GET', 'POST'])
def mytest():
    result = dict()
    result['test'] = 'ok'
    return jsonify(result), 200

@app.route('/<pagename>')
def regularpage(pagename=None):
    
    """
        Important!: you need this part to make the sequential page working via showpages! 
    """
    if pagename==None:
        raise ExperimentError('page_not_found')
    return render_template(pagename)

# This is to see what it is in the root directory on the server
@app.route('/app', methods=['GET', 'POST'])
def myapp():
    cpath = os.getcwd()
    print ("The current working directory is %s" % cpath)
    result = dict()
    result['taskData'] = os.listdir('taskData/')
    result['quitters'] = os.listdir('quitters/')
    # Add Goolge Cloud Storage service to transfer the data to the GCloud 
    return jsonify(result), 200

# THIS IS FOR TESTING MAILING ONLY 
@app.route("/confirmail",methods=['GET', 'POST'])
def sendmail():

    prolific_id = request.args['prolific_id']
    if not ('prolific_id' in request.args):
        prolific_id = 'undefined' 

    msg = Message(body      ="Coucou, participant {0} just finished the BUCKET task".format(prolific_id),
                  subject   ='Curious Development Study',
                  recipients=["vasilisaskv@gmail.com"])

    mail.send(msg)
    return {'message': 'It worked?'}, 200
    # return render_template('feedback.html') # TO BE CHANGED TO JUST DEBRIEFING FINAL PAGE 


###########################################################
# let's start
###########################################################
    
if __name__ == '__main__':
	print("Starting webserver.")
	port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
    

