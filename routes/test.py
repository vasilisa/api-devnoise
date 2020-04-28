from flask import current_app as app, jsonify, request, render_template, redirect, make_response
from flask_mail import Mail, Message 

from models import Test, BaseObject, db
# from collections import OrderedDict
import json
# import glob
import datetime
from sqlalchemy.sql.expression import func


# Status codes
ALLOCATED = 1
STARTED   = 2
COMPLETED = 3
DEBRIEFED = 4
QUITEARLY = 6

mail = Mail(app)

@app.route('/', methods=['GET']) # ROUTE TO START EXPERIMENT 

def start_exp():

    """
        Serves up the experiment applet.
    """
    print('prolific_id' in request.args)

    print('Start Expe')

    if not ('prolific_id' in request.args): 
        raise ExperimentError( 'prolific_study_not_set_in_exp_url')
    
    prolific_id    = request.args['prolific_id']
    study_id       = 'curdev'    # request.args['study_id']
    participant_id = 0           # request.args['participant_id']
    longit_id      = 1           # request.args['longit_id']
    
    print(("Prolific ID: {0}").format(prolific_id))
    
    # Filter for prolific id and longit id in the DB: check first to see if they exist.  
    # this might not work TO BE CHANGED 
    matches = Test.query.\
                        filter(Test.prolific_id == prolific_id).\
                        all()
    # print(matches) 
    numrecs = len(matches)
    if numrecs == 0: # is not in the DB -> create a record in the DB 
        part   = Test(prolific_id)
        
        print("No match. Status is", part.status)
 
        part.status         = STARTED
        part.beginexp       = datetime.datetime.now()
        part.prolific_id    = prolific_id
        part.study_id       = 'curdev' # study_id
        part.longit_id      = 1 # int(longit_id) 
        part.participant_id = 0 # int(participant_id) 
        
        BaseObject.check_and_save(part)

        result = dict({"success": "yes"}) 
        
    else : 
        part = matches[0]
        print("Participant id {0} matched in the DB! Status is {1}".format(participant_id, part.status))
    
    # Start the task: REPLACE WITH THE FINAL VERSION OF THE GAME HERE  
    return render_template('ps_dev_exp.html', prolific_id = prolific_id,)


@app.route('/quitter', methods=['POST'])

def quitter():
    
    """
        Subjects post data as they quit, to help us better understand the quitters.
    """
    print("accessing the /quitter route")
    # print(request.form.keys())

    prolific_id  = request.form['prolific_id']
    study_id     = 'curdev' # request.form['study_id']
    datastring   = request.form['datastring']
    when         = request.form['when']

    if ('prolific_id' in request.form) and ('datastring' in request.form) and ('longit_id' in request.form): 
        prolific_id = request.form['prolific_id']
        datastring  = request.form['datastring']
        longit_id   = 1 # request.form['longit_id']
        
        print("getting the save data {0} for quitter prolific id {1} longit id {2}", datastring,prolific_id,longit_id)
        user = Test.query.filter(Test.prolific_id == prolific_id).one()
        
        user.datastring = datastring
        user.status     = STARTED

        BaseObject.check_and_save(user)

        result = dict({"success": "yes"}) 
        # db_session.add(user) #inserting entry into database
        # db_session.commit()
        print("Quitter route, status is", user.status)
    return render_template('error.html', errornum= 1011)


@app.route('/done', methods=['POST', 'GET'])
def savedata():
    """
        User has finished the experiment and is posting their data in the form of a
        (long) string. They will receive a debriefing back.
    """
    print("accessing the /done route")

    prolific_id    = request.form['prolific_id']
    study_id       = 'curdev' # request.form['study_id']
    participant_id = 0 # request.form['participant_id']
    longit_id      = 1 # request.form['longit_id']
    datastring     = request.form['datastring']
    when           = request.form['when']
   
    print("saving the data of subject {0}".format(prolific_id))

    if ('prolific_id' in request.form) and ('datastring' in request.form): 
        prolific_id   = request.form['prolific_id']
        datastring    = request.form['datastring']
        print("getting the save data {0} for prolific ID {1}".format(datastring,prolific_id))
        user = Test.query.\
            filter(Test.prolific_id == prolific_id).\
            one()
    
    user.datastring = datastring
    user.status     = COMPLETED
    user.endexp     = datetime.datetime.now()
    user.bonus      = '0' # payment
    user.feedback   = 'completed' 

    BaseObject.check_and_save(user)

    result = dict({"success": "yes"}) 

    print("Exp task done route, status is", user.status)

    # Send the email confirmation 
    msg = Message(body      ="Coucou, participant {0} just finished the BUCKET task".format(prolific_id),
                  subject   ='Curious Development Study',
                  recipients=["vasilisaskv@gmail.com"])

    mail.send(msg)
    # return {'message': 'It worked?'}, 200

#    return "Success" 
    render_template('debriefing.html')

@app.route('/inexp', methods=['POST']) # not sure where it is called 
def enterexp():
    """
    AJAX listener that listens for a signal from the user's script when they
    leave the instructions and enter the real experiment. After the server
    receives this signal, it will no longer allow them to re-access the
    experiment applet (meaning they can't do part of the experiment and
    referesh to start over).
    """
    print("/inexp")
    if ('prolific_id' in request.form): 
        prolific_id   = request.form['prolific_id']
        longit_id     = 1 # request.form['longit_id']

    else: 
        raise ValueError('improper_inputs')\

    user = Test.query.\
            filter(Test.prolific_id == prolific_id).one()
    user.status   = STARTED
    user.beginexp = datetime.datetime.now()

    BaseObject.check_and_save(user)
    result = dict({"success": "yes"}) 
    return "Success"

@app.route('/inexpsave', methods=['POST'])
def inexpsave():
    """
    The experiments script updates the server periodically on subjects'
    progress. This lets us better understand attrition.
    """
    print("accessing the /inexpsave route")
    
    if ('prolific_id' in request.form) and ('datastring' in request.form): 
        prolific_id   = request.form['prolific_id']
        longit_id     = 1 # request.form['longit_id']
        datastring    = request.form['datastring']
        print("getting the save data for prolific id {0}, longit id {1}: {2}".format(prolific_id, longit_id, datastring))
        
        user = Test.query.\
                filter(Test.prolific_id == prolific_id).\
                one()
        user.datastring = datastring
        user.status     = STARTED

        BaseObject.check_and_save(user)
        result = dict({"success": "yes"}) 

    return render_template('error.html', errornum=1012)

