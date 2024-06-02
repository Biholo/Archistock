const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const multer = require('multer');
require("dotenv").config();

//--------- Create a user ---------//
