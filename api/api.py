import keys
import json
from flask import Flask, request, session, json, make_response, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import pymysql
import mysql
from datetime import datetime, timedelta
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import requests

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = keys.secret_key
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://' + keys.mysql_user + ':' + keys.mysql_password + '@' + keys.mysql_host
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)

def token_required(func):
  @wraps(func)
  def decorated(*args, **kwargs):
    token = request.values.get('token')
    if not token:
      return jsonify({'Alert!': 'Token is missing!'}), 403
    try:
      payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
    except:
      return jsonify({'Alert!': 'Invalid Token!'}), 403
    return func(*args, **kwargs)

  return decorated

class Usercredentials(db.Model):
  username = db.Column(db.String(20), primary_key=True)
  password = db.Column(db.String(128))
  information = relationship("Userinfo", backref = "Usercredentials", passive_deletes = True, uselist=False)

class Userinfo(db.Model):
  usercredentials_username = db.Column(db.String(20), db.ForeignKey('usercredentials.username', ondelete = "CASCADE"), primary_key = True)
  name = db.Column(db.String(45))
  phonenumber = db.Column(db.String(12))
  email = db.Column(db.String(45))
  points = db.Column(db.Integer)
  billingaddressid = db.Column(db.Integer, db.ForeignKey('address.addressid', ondelete = "CASCADE"))
  mailingaddressid = db.Column(db.Integer, db.ForeignKey('address.addressid', ondelete = "CASCADE"))
  paymentmethod = db.Column(db.String(6))

class Address(db.Model):
  addressid = db.Column(db.Integer, primary_key=True)
  city = db.Column(db.String(20))
  state = db.Column(db.String(2))
  address = db.Column(db.String(50))
  zip = db.Column(db.Integer)
  billing = relationship("Userinfo", backref = "Address", foreign_keys="Userinfo.billingaddressid", passive_deletes = True, uselist=False)
  mailing = relationship("Userinfo", backref = "Address2", foreign_keys="Userinfo.mailingaddressid", passive_deletes = True, uselist=False)

@app.route('/', methods=['GET'])
def index():
  return "This returns something."

@app.route('/api/register', methods=['GET', 'POST'])
def register_endpoint():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']

    hashed_password = generate_password_hash(password, method='sha256')

    user = Usercredentials.query.filter_by(username=username).first()

    if user:
       return make_response('Username taken!', 403)

    newUser = Usercredentials(username = username, password = hashed_password)

    db.session.merge(newUser)
    db.session.commit()
    
    token = jwt.encode({
      'username': request.form['username'],
      'expiration': str(datetime.utcnow() + timedelta(minutes=30)),
    }, app.config['SECRET_KEY'])

    return {'token': token}

@app.route('/api/login', methods=['GET', 'POST'])
def login_endpoint():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']

    user = Usercredentials.query.filter_by(username=username).first()

    if not user:
      return make_response('Unable to verify', 403, {'WWW-Authenticate': 'Basic realm: "Authentication failed!"'})
    
    if check_password_hash(user.password, password):
      token = jwt.encode({
      'username': request.form['username'],
      'expiration': str(datetime.utcnow() + timedelta(minutes=30)),
      }, app.config['SECRET_KEY'])

      return {'token': token}

    return make_response('Unable to verify', 403, {'WWW-Authenticate': 'Basic realm: "Authentication failed!"'})

@app.route('/api/profile', methods=['GET', 'POST'])
def profile_endpoint():

  if request.method == 'POST':
    username = request.values.get('username')
    name = request.form['name']
    phonenumber = request.form['phonenumber']
    email = request.form['email']

    user = Userinfo.query.filter_by(usercredentials_username = username).first()

    #Updates current user
    if user:
      user.name = name
      user.phonenumber = phonenumber
      user.email = email
      print("updating")
    else: #Creates new user 
      newProfile = Userinfo(usercredentials_username = username, name = name, phonenumber = phonenumber, email = email)
      db.session.merge(newProfile)

    db.session.commit()
    return "Your data is submitted"

  if request.method == 'GET':
    username = request.values.get('username')
    user = Userinfo.query.filter_by(usercredentials_username = username).first()

    if user: 
        dataToReturn = {
            "name": user.name,
            "phonenumber": user.phonenumber,
            "email": user.email
        }

        print(dataToReturn)

        return json.dumps(dataToReturn)
    else:
        return jsonify({'Alert!': 'Error somewhere!'}), 400

@app.route('/api/reserve', methods=['GET', 'POST'])
def reserve_endpoint():

  if request.method == 'GET':
    username = request.values.get('username')
    user = Userinfo.query.filter_by(usercredentials_username = username).first()

    if user: 
        dataToReturn = {
            "name": user.name,
            "phonenumber": user.phonenumber,
            "email": user.email
        }

        print(dataToReturn)

        return json.dumps(dataToReturn)
    else:
        return jsonify({'Alert!': 'Error somewhere!'}), 400
