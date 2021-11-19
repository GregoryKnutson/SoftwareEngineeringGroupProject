import keys
import json
import sys
from flask import Flask, request, session, json, make_response, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import pymysql
import mysql
from datetime import datetime, timedelta, date
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import holidays
import hashlib

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

def sha_hash(str_to_hash):
  return hashlib.sha256(str_to_hash.encode('utf-8')).hexdigest()

class Usercredentials(db.Model):
  username = db.Column(db.String(20), primary_key=True)
  password = db.Column(db.String(128))
  information = relationship("Userinfo", backref = "Usercredentials", passive_deletes = True, uselist=False)

class Userinfo(db.Model):
  useridnum = db.Column(db.Integer, primary_key=True)
  usercredentials_username = db.Column(db.String(20), db.ForeignKey('usercredentials.username', ondelete = "CASCADE"))
  name = db.Column(db.String(45))
  phonenumber = db.Column(db.String(12))
  email = db.Column(db.String(45))
  billingaddressid = db.Column(db.Integer, db.ForeignKey('address.addressid', ondelete = "CASCADE"))
  mailingaddressid = db.Column(db.Integer, db.ForeignKey('address.addressid', ondelete = "CASCADE"))
  reservation = relationship("Reservations", backref = "Userinfo", passive_deletes = True, uselist=True)
  paymentinfo_paymentid = db.Column(db.Integer, db.ForeignKey('paymentinfo.paymentid', ondelete = "CASCADE"))

class Address(db.Model):
  addressid = db.Column(db.Integer, primary_key=True)
  city = db.Column(db.String(20))
  state = db.Column(db.String(2))
  address = db.Column(db.String(50))
  zipcode = db.Column(db.Integer)
  billing = relationship("Userinfo", backref = "Address", foreign_keys="Userinfo.billingaddressid", passive_deletes = True, uselist=False)
  mailing = relationship("Userinfo", backref = "Address2", foreign_keys="Userinfo.mailingaddressid", passive_deletes = True, uselist=False)

class Reservations(db.Model):
  reservationnumber = db.Column(db.Integer, primary_key=True)
  ismember = db.Column(db.Boolean)
  userinfo_useridnum = db.Column(db.Integer, db.ForeignKey('userinfo.useridnum', ondelete = "CASCADE"))
  reservationday = db.Column(db.Date)
  reservationstarttime = db.Column(db.Time)
  reservationendtime = db.Column(db.Time)
  numpeople = db.Column(db.Integer)
  numeighttable = db.Column(db.Integer)
  numsixtable = db.Column(db.Integer)
  numfourtable = db.Column(db.Integer)
  numtwotable = db.Column(db.Integer)
  extracharge = db.Column(db.Integer)
  paymentinfo_paymentid = db.Column(db.Integer, db.ForeignKey('paymentinfo.paymentid', ondelete = "CASCADE"))

class Paymentinfo(db.Model):
	paymentid = db.Column(db.Integer, primary_key=True)
	paymentname = db.Column(db.String(45))
	cardnumber = db.Column(db.String(128))
	expirationdate = db.Column(db.String(128))
	securitycode = db.Column(db.String(128))
	lastfourdigits = db.Column(db.Integer)
	user = relationship("Userinfo", backref = "PaymentInfo", passive_deletes = True, uselist=False)
	reservation = relationship("Reservations", backref="PaymentInfo2", passive_deletes = True, uselist=False)

def areAddressEqual(mailing, billing):
  if mailing == billing:
    return True
  else:
    return False

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

@app.route('/api/guest', methods=['POST'])
def guest_endpoint():
  if request.method == 'POST':

    token = jwt.encode({
      'name': request.form['name'],
      'phonenumber': request.form['phonenumber'],
      'email': request.form['email'],
      'payment': request.form['payment'],
      'expiration': str(datetime.utcnow() + timedelta(minutes=10)),

      }, app.config['SECRET_KEY'])

    return {'token': token}


@app.route('/api/profile', methods=['GET', 'POST'])
def profile_endpoint():

  if request.method == 'POST':
    username = request.values.get('username')
    name = request.form['name']
    if len(name) > 50:
      return jsonify({'Alert!': 'Invalid Name!'}), 400
    phonenumber = request.form['phonenumber']
    if len(phonenumber) != 10:
      return jsonify({'Alert!': 'Invalid Number!'}), 400
    email = request.form['email']
    if len(email) > 45:
      return jsonify({'Alert!': 'Invalid Email!'}), 400

    billingAddress = json.loads(request.form['billingAddress'])
    mailingAddress = json.loads(request.form['mailingAddress'])
    payment = json.loads(request.form['payment'])
    lastFourDigits = int(str(payment['cardNumber'])[len(str(payment['cardNumber'])) - 4 :])
    print(lastFourDigits)
    if len(billingAddress['address']) > 50 or len(mailingAddress['address']) > 50:
      return jsonify({'Alert!': 'Invalid Address!'}), 400
    if len(billingAddress['city']) > 20 or len(mailingAddress['city']) > 20:
      return jsonify({'Alert!': 'Invalid City!'}), 400
    if len(billingAddress['state']) != 2 or len(mailingAddress['state']) != 2:
      return jsonify({'Alert!': 'Invalid State!'}), 400
    if (len(str(billingAddress['zip'])) < 5 or len(str(billingAddress['zip'])) > 9):
      return jsonify({'Alert!': 'Invalid Zipcode!'}), 400
    if (len(str(mailingAddress['zip'])) < 5 or len(str(mailingAddress['zip'])) > 9):
      return jsonify({'Alert!': 'Invalid Zipcode!'}), 400

    print(billingAddress)
    print(mailingAddress)

    isAddressEqual = areAddressEqual(billingAddress, mailingAddress)
    print(isAddressEqual)

    user = Userinfo.query.filter_by(usercredentials_username = username).first()
    billingAddressID = None
    mailingAddressID = None

    userPayment = Paymentinfo.query.filter_by(cardnumber = sha_hash(payment['cardNumber']), securitycode = sha_hash(payment['cardSecurityCode'])).first()
    cardID = None

    if isAddressEqual: #checks if addresses are equal
      userAddress = Address.query.filter_by(city = billingAddress['city'], state = billingAddress['state'], address = billingAddress['address'], zipcode = billingAddress['zip']).first() #looks for address in DB
      if userAddress: #if found stores ID of address
        billingAddressID = userAddress.addressid
        mailingAddressID = userAddress.addressid
      else: #if not found adds address to id and stores value
        newAddress = Address(city = billingAddress['city'], state = billingAddress['state'], address = billingAddress['address'], zipcode = billingAddress['zip'])
        db.session.merge(newAddress)
        db.session.commit()
        newAddress = Address.query.filter_by(city = billingAddress['city'], state = billingAddress['state'], address = billingAddress['address'], zipcode = billingAddress['zip']).first()
        billingAddressID = newAddress.addressid
        mailingAddressID = newAddress.addressid
    else: #if not equal
      userMailingAddress = Address.query.filter_by(city = mailingAddress['city'], state = mailingAddress['state'], address = mailingAddress['address'], zipcode = mailingAddress['zip']).first() #looks for address in DB
      userBillingAddress = Address.query.filter_by(city = billingAddress['city'], state = billingAddress['state'], address = billingAddress['address'], zipcode = billingAddress['zip']).first() #looks for address in DB
      if userBillingAddress: #if found
        billingAddressID = userBillingAddress.addressid #Store value of the id
      else:
        newBillingAddress = Address(city = billingAddress['city'], state = billingAddress['state'], address = billingAddress['address'], zipcode = billingAddress['zip']) #adds to db
        db.session.merge(newBillingAddress)
        db.session.commit()
        newBillingAddress = Address.query.filter_by(city = billingAddress['city'], state = billingAddress['state'], address = billingAddress['address'], zipcode = billingAddress['zip']).first()
        print(newBillingAddress)
        billingAddressID = newBillingAddress.addressid #store value to id

      if userMailingAddress:
        mailingAddressID = userMailingAddress.addressid
      else:
        newMailingAddress =  Address(city = mailingAddress['city'], state = mailingAddress['state'], address = mailingAddress['address'], zipcode = mailingAddress['zip'])
        db.session.merge(newMailingAddress)
        db.session.commit()
        newMailingAddress = Address.query.filter_by(city = mailingAddress['city'], state = mailingAddress['state'], address = mailingAddress['address'], zipcode = mailingAddress['zip']).first()
        mailingAddressID = newMailingAddress.addressid
        print(mailingAddressID)

    if(userPayment):
      cardID= userPayment.paymentid
    else:
      newPaymentInfo = Paymentinfo(paymentname = payment['cardName'], cardnumber = sha_hash(payment['cardNumber']), expirationdate = sha_hash(payment['cardExpiration']), securitycode = sha_hash(payment['cardSecurityCode']), lastfourdigits = lastFourDigits)
      db.session.merge(newPaymentInfo)
      db.session.commit()
      userPayment = Paymentinfo.query.filter_by(cardnumber = sha_hash(payment['cardNumber']), securitycode = sha_hash(payment['cardSecurityCode'])).first()
      cardID= userPayment.paymentid

    #Updates current user
    if user:
      user.name = name
      user.phonenumber = phonenumber
      user.email = email
      user.paymentinfo_paymentid = cardID

      oldBillingAddressID = user.billingaddressid
      oldMailingAddressID = user.mailingaddressid

      user.billingaddressid = billingAddressID
      user.mailingaddressid = mailingAddressID

      db.session.commit()

      #check if address is still being used
      checkBillingAddress = Userinfo.query.filter((Userinfo.billingaddressid == oldBillingAddressID) | (Userinfo.mailingaddressid == oldBillingAddressID))
      checkMailingAddress = Userinfo.query.filter((Userinfo.billingaddressid == oldMailingAddressID) | (Userinfo.mailingaddressid == oldMailingAddressID))

      print(checkBillingAddress.count())
      print(checkMailingAddress.count())

      if checkBillingAddress.count() == 0:
        Address.query.filter_by(addressid = oldBillingAddressID).delete()
        print("Deleting not used Address")
        db.session.commit()
      if checkMailingAddress.count() == 0:
        Address.query.filter_by(addressid = oldMailingAddressID).delete()
        print("Deleting not used Address")
        db.session.commit()

      print("updating")
    else: #Creates new user 
      newProfile = Userinfo(usercredentials_username = username, name = name, phonenumber = phonenumber, email = email, billingaddressid = billingAddressID, mailingaddressid = mailingAddressID, paymentinfo_paymentid = cardID)
      db.session.merge(newProfile)
      db.session.commit()

    return "Your data is submitted"

  if request.method == 'GET':
    username = request.values.get('username')
    print(username)
    user = Userinfo.query.filter_by(usercredentials_username = username).first()

    if user: 
        billingAddressQuery = Address.query.filter_by(addressid = user.billingaddressid).first()
        mailingAddressQuery = Address.query.filter_by(addressid = user.mailingaddressid).first()

        bAddress = {
          "address": billingAddressQuery.address,
          "city": billingAddressQuery.city,
          "state": billingAddressQuery.state,
          "zip": billingAddressQuery.zipcode
        }
        mAddress = {
          "address": mailingAddressQuery.address,
          "city": mailingAddressQuery.city,
          "state": mailingAddressQuery.state,
          "zip": mailingAddressQuery.zipcode
        }

        dataToReturn = {
                "name": user.name,
                "phonenumber": user.phonenumber,
                "email": user.email,
                "billingAddress": bAddress,
                "mailingAddress": mAddress,
                "validPayment": True
            }

        return json.dumps(dataToReturn)
    else:
        blankAddress = {
          "address": "",
          "city": "",
          "state": "",
          "zip": "",
        }

        dataToReturn = {
          "name": "",
          "phonenumber": "",
          "email": "",
          "billingAddress": blankAddress,
          "mailingAddress": blankAddress,
        }
        return json.dumps(dataToReturn)

def minTablesNeeded(n_guests, avail): #assuming there is always a valid solution is the main reason this works
        n_guests = n_guests if n_guests % 2 == 0 else n_guests + 1
        sub = {entry: avail[entry] for entry in avail if avail[entry] > 0} # just a copy of avail omitting the tables with 0 availability 
        used = {entry: 0 for entry in avail}
        ref = {key: sub[key] for key in sub} #for resetting sub when an invalid solution is used 
        temp = n_guests
        for i in sub:
            if n_guests % int(i) == 0 and ((int(i) * sub[i]) >= n_guests): #most ideal case is where we have enough of one table to seat the entire party
                used[i] = int(n_guests / int(i))
                return used #found ideal case, no need to continue
        for i in sub:
            while temp >= int(i) and sub[i] != 0: # 2nd most optimal solution where everything adds up evenly 
                temp -= int(i)
                sub[i] -= 1
                used[i] += 1
        if temp != 0 and n_guests <= 8: #for when we have to select a big table for a small party size
            sub = ref
            temp = n_guests
            used = {entry: 0 for entry in avail}
            for i in reversed(sub):
                if int(i) > temp:
                    used[i] += 1
                    return used
        if temp != 0: #all other cases just take the smallest tables first until the capacity of all tables selected >= n_guests, no regard to optimal solution
            sub = ref
            temp = 0
            used = {entry: 0 for entry in avail}
            for i in reversed(sub):
                while temp < n_guests and sub[i] != 0:
                    temp += int(i)
                    sub[i] -= 1
                    used[i] += 1
       # for the cases where the remaining available tables dont neatly add into n_guests
       # and we will have extra seats open (i.e n_guests is in between some existing tables avail = {8: 1, 4: 1} n_guests = 6)
       # and also the cases where the most ideal case isn't always selecting the biggest table 
       # (i.e n_guests = 16 avail = {8: 1, 6: 2, 4: 1}) ideal used would be used = {6: 2, 4: 1} not used = {8: 1, 6: 1, 4: 1}
        return used
        
@app.route('/api/holiday', methods=['GET', 'POST'])
def holiday_endpoint():
    reservationDay = request.form['reservationDay']
    dayOfTheWeek = request.form['dayOfTheWeek']
    us_holidays = holidays.US()
    print(dayOfTheWeek)
    if dayOfTheWeek == 'Fri' or dayOfTheWeek == 'Sat' or reservationDay in us_holidays:
      extraFee = 20
    else:
      extraFee = 0
    return json.dumps(extraFee)

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

  if request.method == 'POST':
    NUM_EIGHT_TABLE = 4
    NUM_SIX_TABLE = 4
    NUM_FOUR_TABLE = 4
    NUM_TWO_TABLE = 4
    MAX_PARTY_SIZE = 80
    isMember = request.form['isMember']
    name = request.form['name']
    phonenumber = request.form['number']
    email = request.form['email']
    reservationDay = request.form['reservationDay']
    reservationStartTime = request.form['reservationStartTime']
    reservationEndTime = request.form['reservationEndTime']
    numGuests = int(request.form['numGuests'])
    extraCharge = int(request.form['extraCharge'])
    
    if isMember == 'true':
      username = request.form['username']
      user = Userinfo.query.filter_by(usercredentials_username = username).first()
      userid = user.useridnum
      paymentinfoid = user.paymentinfo_paymentid
      isMember = True
    else:
      userid = None
      payment = json.loads(request.form['payment'])
      paymentCheck = Paymentinfo.query.filter_by(cardnumber = sha_hash(payment['cardNumber']), securitycode = sha_hash(payment['cardSecurityCode'])).first()
      isMember = False
      if paymentCheck:
        paymentinfoid = paymentCheck.paymentid
      else:
        lastFourDigits = int(str(payment['cardNumber'])[len(str(payment['cardNumber'])) - 4 :])
        newPaymentInfo = Paymentinfo(paymentname = payment['cardName'], cardnumber = sha_hash(payment['cardNumber']), expirationdate = sha_hash(payment['cardExpiration']), securitycode = sha_hash(payment['cardSecurityCode']), lastfourdigits = lastFourDigits)
        db.session.merge(newPaymentInfo)
        db.session.commit()
        userPayment = Paymentinfo.query.filter_by(cardnumber = sha_hash(payment['cardNumber']), securitycode = sha_hash(payment['cardSecurityCode'])).first()
        paymentinfoid= userPayment.paymentid

    currReservations = Reservations.query.filter((Reservations.reservationday == reservationDay) & (Reservations.reservationstarttime >= reservationStartTime) & (Reservations.reservationstarttime <= reservationEndTime) | 
    (Reservations.reservationday == reservationDay) & (Reservations.reservationendtime >= reservationStartTime) & (Reservations.reservationendtime <= reservationEndTime)).all()
    for res in currReservations:
      NUM_EIGHT_TABLE = NUM_EIGHT_TABLE - res.numeighttable
      NUM_SIX_TABLE = NUM_SIX_TABLE - res.numsixtable
      NUM_FOUR_TABLE = NUM_FOUR_TABLE - res.numfourtable
      NUM_TWO_TABLE = NUM_TWO_TABLE - res.numtwotable

    avail = {"8": NUM_EIGHT_TABLE, "6": NUM_SIX_TABLE,"4": NUM_FOUR_TABLE, "2": NUM_TWO_TABLE}
    sum = 0
    print("Available tables:")
    for en in avail:
      sum += int(en) * avail[en]
      print("%d tables of size %s" %(avail[en], en))
    if numGuests <= MAX_PARTY_SIZE or numGuests <= sum:
      used = minTablesNeeded(int(numGuests), avail)
      for occup in used:
        if used[occup]:
          print("Used %d table(s) of size %s" %(used[occup], occup))
      newReservation = Reservations(ismember = bool(isMember), userinfo_useridnum = userid, reservationday = reservationDay, reservationstarttime = reservationStartTime,
                      reservationendtime = reservationEndTime, numpeople = numGuests, numtwotable = used["2"], numfourtable = used["4"], numsixtable = used["6"], numeighttable = used["8"], extracharge = extraCharge, paymentinfo_paymentid = paymentinfoid)
      db.session.merge(newReservation)
      db.session.commit()
      return json.dumps("Reserved successfully")
    else:
      print('No available seats')
      return make_response('No available seats', 400) 

@app.route('/api/editReservation', methods=['POST'])
def editReservation_endpoint():
  if request.method == 'POST':
    NUM_EIGHT_TABLE = 4
    NUM_SIX_TABLE = 4
    NUM_FOUR_TABLE = 4
    NUM_TWO_TABLE = 4
    MAX_PARTY_SIZE = 80

    reservationNum = request.form['reservationNum']
    reservationDay = request.form['reservationDay']
    reservationStartTime = request.form['reservationStartTime']
    reservationEndTime = request.form['reservationEndTime']
    numGuests = int(request.form['numGuests'])
    dayOfTheWeek = request.form['dayOfTheWeek']
    us_holidays = holidays.US()

    if dayOfTheWeek == 'Fri' or dayOfTheWeek == 'Sat' or reservationDay in us_holidays:
      extraFee = 20
    else:
      extraFee = 0

    reservation = Reservations.query.filter_by(reservationnumber = reservationNum).first()

    currReservations = Reservations.query.filter(((Reservations.reservationday == reservationDay) & (Reservations.reservationstarttime >= reservationStartTime) & (Reservations.reservationstarttime <= reservationEndTime) | 
      (Reservations.reservationday == reservationDay) & (Reservations.reservationendtime >= reservationStartTime) & (Reservations.reservationendtime <= reservationEndTime)) & (Reservations.reservationnumber != reservationNum)).all()
    for res in currReservations:
          NUM_EIGHT_TABLE = NUM_EIGHT_TABLE - res.numeighttable
          NUM_SIX_TABLE = NUM_SIX_TABLE - res.numsixtable
          NUM_FOUR_TABLE = NUM_FOUR_TABLE - res.numfourtable
          NUM_TWO_TABLE = NUM_TWO_TABLE - res.numtwotable

    avail = {"8": NUM_EIGHT_TABLE, "6": NUM_SIX_TABLE,"4": NUM_FOUR_TABLE, "2": NUM_TWO_TABLE}
    sum = 0
    for en in avail:
      sum += int(en) * avail[en]
      print(avail[en])
    if numGuests <= MAX_PARTY_SIZE or numGuests <= sum:
      used = minTablesNeeded(int(numGuests), avail)
      for occup in used:
        if used[occup]:
          print("Used %d table(s) of size %s" %(used[occup], occup))

      reservation.reservationday = reservationDay
      reservation.reservationstarttime = reservationStartTime
      reservation.reservationendtime = reservationEndTime
      reservation.numpeople = numGuests
      reservation.numtwotable = used["2"]
      reservation.numfourtable = used["4"]
      reservation.numsixtable = used["6"]
      reservation.numeighttable = used["8"]
      reservation.extracharge = extraFee
      db.session.commit()
      return "success"
    else:
      return make_response('No available seats', 400) 

@app.route('/api/reservations', methods=['GET'])
def reservations_endpoint():
  username = request.values.get('username')
  user = Userinfo.query.filter_by(usercredentials_username = username).first()
  today = date.today()
  time = datetime.now().time()
  time = time.strftime('%H:%M:%S')
  reservations = Reservations.query.filter((Reservations.userinfo_useridnum == user.useridnum) & ((Reservations.reservationday > today) | ((Reservations.reservationday == today) & (Reservations.reservationstarttime > time)))).all()
  print(reservations)
  if reservations:
    data = []
    for res in reservations:
      data.append({"reservationNum": str(res.reservationnumber), "reservationDate": str(res.reservationday), "reservationStartTime": str(res.reservationstarttime), "reservationEndTime": str(res.reservationendtime), "numGuests": str(res.numpeople)})
    return json.dumps(data)
  else:
    return jsonify(reservations)
@app.route('/api/avail', methods=['POST'])
def avail():
    g = request.form['numGuests']
    reservationDay = request.form['date']
    reservationStartTime = request.form['sTime']
    reservationEndTime = request.form['eTime']
    NUM_EIGHT_TABLE = 4
    NUM_SIX_TABLE = 4
    NUM_FOUR_TABLE = 4
    NUM_TWO_TABLE = 4
    print(g, reservationDay, reservationStartTime, reservationEndTime)
    currReservations = Reservations.query.filter((Reservations.reservationday == reservationDay) & (Reservations.reservationstarttime >= reservationStartTime) & (Reservations.reservationstarttime <= reservationEndTime) | 
    (Reservations.reservationday == reservationDay) & (Reservations.reservationendtime >= reservationStartTime) & (Reservations.reservationendtime <= reservationEndTime)).all()
    for res in currReservations:
        NUM_EIGHT_TABLE = NUM_EIGHT_TABLE - res.numeighttable
        NUM_SIX_TABLE = NUM_SIX_TABLE - res.numsixtable
        NUM_FOUR_TABLE = NUM_FOUR_TABLE - res.numfourtable
        NUM_TWO_TABLE = NUM_TWO_TABLE - res.numtwotable
    avail = {"2": NUM_TWO_TABLE, "4": NUM_FOUR_TABLE, "6": NUM_SIX_TABLE, "8": NUM_EIGHT_TABLE}
    return json.dumps(avail)
