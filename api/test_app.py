import unittest
import json
from flask import Flask
from unittest.mock import patch
from flask.globals import request
from werkzeug.wrappers import response
from api import app, db
from flask_jwt_extended import create_access_token


class FlaskTest(unittest.TestCase):

    CURR_USERNAME = "Test4"

    REGISTER_AND_LOGIN_OBJ={
        "username":CURR_USERNAME,
        "password":"pass123"
    }
    TEST_ADDRESS= {
        "address":"1234 Test Address",
        "city":"Houston",
        "state":"TX",
        "zip":"77423"
    }
    TEST_ADDRESS_2= {
        "address":"5678 Test Address",
        "city":"Houston",
        "state":"TX",
        "zip":"77423"
    }
    TEST_ADDRESS_BROKEN_1= {
        "address":"1234 Test Address 1234 Test Address 1234 Test Address 1234 Test Address",
        "city":"Houston",
        "state":"TX",
        "zip":"77423"
    }
    TEST_ADDRESS_BROKEN_2= {
        "address":"1234 Test Address",
        "city":"Houston Houston Houston Houston Houston Houston",
        "state":"TX",
        "zip":"77423"
    }
    TEST_ADDRESS_BROKEN_3= {
        "address":"1234 Test Address 1234",
        "city":"Houston",
        "state":"T",
        "zip":"77423"
    }
    TEST_ADDRESS_BROKEN_4= {
        "address":"1234 Test Address 1234",
        "city":"Houston",
        "state":"TX",
        "zip":"12"
    }
    PAYMENT_OBJECT = {
        "cardName": "Bob Smith",
        "cardNumber": "4111111111111111",
        "cardExpiration": "12/24",
        "cardSecurityCode": "321"
    }
    PROFILE_OBJ={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS),
        "payment": json.dumps(PAYMENT_OBJECT),
        "cardUpdated": "true"
    }
    PROFILE_OBJ_2={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS_2),
        "payment": json.dumps(PAYMENT_OBJECT),
        "cardUpdated": "true"
    }
    PROFILE_OBJ_BROKEN_1={
        "name":"Test Test Test Test Test Test Test Test Test Test Test Test Test Test",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_BROKEN_2={
        "name":"Bob Smith",
        "phonenumber": "123",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_BROKEN_3={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com testemail@gmail.com testemail@gmail.com testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_BROKEN_4={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS_BROKEN_1),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_BROKEN_5={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS_BROKEN_2),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_BROKEN_6={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS_BROKEN_3),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_BROKEN_7={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS_BROKEN_4),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    RESERVATION_TEST_1 = {
        "isMember": "false",
        "name": "Bob Smith",
        "number": "1234567890",
        "email": "yup@gmail.com",
        "reservationDay":"2023-12-03",
        "reservationStartTime": "10:00:00",
        "reservationEndTime": "12:00:00",
        "numGuests": "2",
        "extraCharge": "20",
        "payment": json.dumps(PAYMENT_OBJECT)
    }
    RESERVATION_TEST_BROKEN2 = {
        "isMember": "true",
        "username": CURR_USERNAME,
        "name": "Gary Al",
        "number": "1234567890",
        "email": "yup@gmail.com",
        "reservationDay":"2023-12-03",
        "reservationStartTime": "12:00:00",
        "reservationEndTime": "10:00:00",
        "numGuests": "2",
        "extraCharge": "20",
    }
    HOLIDAY_OBJECT1 = {
        "reservationDay": "2021-12-25",
        "dayOfTheWeek": "Sat"
    }
    HOLIDAY_OBJECT2 = {
        "reservationDay": "2021-01-25",
        "dayOfTheWeek": "Mon"
    }
    AVAIL_OBJECT1 = {
        "numGuests": 1,
        "date": "2023-12-03",
        "sTime": "10:00:00",
        "eTime": "12:00:00",
    }
    AVAIL_OBJECT_BROKEN1 = {
        "numGuests": 1,
        "date": "2023-12-03",
        "sTime": "12:00:00",
        "eTime": "10:00:00",
    }

    def test1_home(self):
        tester= app.test_client(self)
        response= tester.get('http://localhost:5000/')
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test2_register(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/register',
        data=FlaskTest.REGISTER_AND_LOGIN_OBJ)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test3_login(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/login',
        data=FlaskTest.REGISTER_AND_LOGIN_OBJ)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test4_profile_equal_address(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile?username=' + FlaskTest.CURR_USERNAME,
        data=FlaskTest.PROFILE_OBJ)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test5_profile_unequal_address(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile?username=' + FlaskTest.CURR_USERNAME,
        data=FlaskTest.PROFILE_OBJ_2)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test6_profile_broken1(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_1)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test7_profile_broken2(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_2)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test8_profile_broken3(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_3)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test9_profile_broken4(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_4)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)
    
    def test10_profile_broken5(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_5)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test11_profile_broken6(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_6)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test12_profile_broken7(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:5000/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_7)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test13_getprofile(self):
        tester= app.test_client(self)
        response= tester.get('http://localhost:5000/api/profile?username=')
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test14_reserve1(self):
        tester = app.test_client(self)
        response = tester.post('http://localhost:5000/api/reserve',
        data = FlaskTest.RESERVATION_TEST_1)
        status_code = response.status_code
        self.assertEqual(status_code, 200)
        
    def test15_reserve2(self):
        tester = app.test_client(self)
        response = tester.post('http://localhost:5000/api/reserve',
        data = FlaskTest.RESERVATION_TEST_BROKEN2)
        status_code = response.status_code
        self.assertEqual(status_code, 400)

    def test16_holiday1(self):
        tester = app.test_client(self)
        response = tester.post('http://localhost:5000/api/holiday',
        data = FlaskTest.HOLIDAY_OBJECT1)
        status_code = response.status_code
        self.assertEqual(status_code, 200)

    def test17_holiday2(self):
        tester = app.test_client(self)
        response = tester.post('http://localhost:5000/api/holiday',
        data = FlaskTest.HOLIDAY_OBJECT2)
        status_code = response.status_code
        self.assertEqual(status_code, 200)

    def test18_checkavail(self):
        tester = app.test_client(self)
        response = tester.post('http://localhost:5000/api/avail',
        data = FlaskTest.AVAIL_OBJECT1)
        status_code = response.status_code
        self.assertEqual(status_code, 200)

    def test19_checkavail2(self):
        tester = app.test_client(self)
        response = tester.post('http://localhost:5000/api/avail',
        data = FlaskTest.AVAIL_OBJECT_BROKEN1)
        status_code = response.status_code
        self.assertEqual(status_code, 400)

if __name__== "__main__":
    unittest.main()
