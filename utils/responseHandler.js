'use strict';

const success = (res, message, code) => {
  res.status(code).json({
    is_success: true,
    message: message,
    responseCode: code,
  });
};
const data = (res, item, code) => {
  res.status(code).json({
    is_success: true,
    data: item,
    responseCode: code,
  });
};
const token = (res, item, code) => {
  res.status(code).json({
    is_success: true,
    token: item,
    responseCode: code,
  });
};
const failure = (res, error, code) => {
  res.status(code).json({
    is_success: false,
    message: error.message ? error.message : error,
    responseCode: code,
  });
};

module.exports = {
  success,
  data,
  token,
  failure,
};
