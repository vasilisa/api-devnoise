import os
# from ConfigParser import ConfigParser # this is for python 2.7
from configparser import ConfigParser # this is for python 2.7

# Load up config file
configfilepath = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              'config.txt')
config = ConfigParser()
config.read(configfilepath)


# database specifications
# db_name   = 'covid19'
# db_host   = 'localhost'
# db_pwd    = 'pwd'
# db_user   = 'root'


