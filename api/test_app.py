import unittest
import json
from flask import Flask
from unittest.mock import patch
from flask.globals import request
from api import app, db
from flask_jwt_extended import create_access_token


class FlaskTest(unittest.TestCase):

    CURR_USERNAME = "Test3"

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
    PROFILE_OBJ={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS)
    }
    PROFILE_OBJ_2={
        "name":"Bob Smith",
        "phonenumber": "1231231234",
        "email": "testemail@gmail.com",
        "billingAddress": json.dumps(TEST_ADDRESS),
        "mailingAddress": json.dumps(TEST_ADDRESS_2)
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

    def test1_home(self):
        tester= app.test_client(self)
        response= tester.get('http://localhost:5000/')
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test2_register(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/register',
        data=FlaskTest.REGISTER_AND_LOGIN_OBJ)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test3_login(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/login',
        data=FlaskTest.REGISTER_AND_LOGIN_OBJ)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test4_profile_equal_address(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile?username=' + FlaskTest.CURR_USERNAME,
        data=FlaskTest.PROFILE_OBJ)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test5_profile_unequal_address(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile?username=' + FlaskTest.CURR_USERNAME,
        data=FlaskTest.PROFILE_OBJ_2)
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)

    def test6_profile_broken1(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_1)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test7_profile_broken2(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_2)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test8_profile_broken3(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_3)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test9_profile_broken4(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_4)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)
    
    def test10_profile_broken5(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_5)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test11_profile_broken6(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_6)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test12_profile_broken7(self):
        tester= app.test_client(self)
        response= tester.post('http://localhost:8080/api/profile',
        data=FlaskTest.PROFILE_OBJ_BROKEN_7)
        statuscode= response.status_code
        self.assertEqual(statuscode, 400)

    def test13_getprofile(self):
        tester= app.test_client(self)
        response= tester.get('http://localhost:5000/api/profile?username=')
        statuscode= response.status_code
        self.assertEqual(statuscode, 200)


if __name__== "__main__":
    unittest.main()
