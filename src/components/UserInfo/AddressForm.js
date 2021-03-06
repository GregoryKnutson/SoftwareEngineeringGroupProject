import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { checkAuth, setAuth, getUserId } from "../../verifyLogin";
import "./UserInfo.scss";

const AddressForm = ({onAddressChange, address}) => {
  return (
    <div>
                  <div className="billingaddress">
              <div className="in">
                <label>Address:</label>
                <input
                  className="addressInput"
                  type="text"
                  name="address"
                  id="address"
                  value={address.address}
                  onChange={onAddressChange}
                />
              </div>
              <div className="in">
                <div className="address">
                  <div className="address_city">
                    <label>City:</label>
                    <input
                      className="city"
                      type="text"
                      name="city"
                      id="city"
                      value={address.city}
                      onChange={onAddressChange}
                    />
                  </div>
                  <div className="address_state">
                    <label>State:</label>
                    <select
                      key="state"
                      className="state"
                      name="state"
                      id="state"
                      value={address.state}
                      onChange={onAddressChange}
                    >
                      <option value>Select</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregan</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>
                  <div className="address_zip">
                    <label>Zip Code:</label>
                    <input
                      className="zip"
                      type="text"
                      name="zip"
                      id="zip"
                      value={address.zip}
                      onChange={onAddressChange}
                    />
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};
export default AddressForm;