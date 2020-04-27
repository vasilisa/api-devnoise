import os
import logging
import warnings
import subprocess
from flask_cors import CORS
from flask import Flask, jsonify, request, abort, Response, make_response, render_template 
from models.db import db
from models.install import install_models
from config import config  


warnings.filterwarnings("ignore")

# Set up logging
logfilepath = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           config.get("Server Parameters", "logfile"))
# --- Logging ---- # 
loglevels = [logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR, logging.CRITICAL]
loglevel  = loglevels[config.getint("Server Parameters", "loglevel")]
logging.basicConfig( filename=logfilepath, format='%(asctime)s %(message)s', level=loglevel )

# constants
CODE_VERSION  = config.get('Task Parameters', 'code_version')


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

db.init_app(app)
CORS(app)

with app.app_context():
    install_models()
    import routes

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

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port,debug=False)
