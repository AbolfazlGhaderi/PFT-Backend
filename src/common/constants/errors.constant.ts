// ErrorCode 1000 - 1010 is reserved for HttpException(s)
// ErrorCode before 2000 is reserved !!  -------=-------------------
// Start from 1011
export const API_ERROR_CODES = {
  BAD_REQUEST: {
    message: 'BadRequest',
    HttpStatusCode: 400,
    errorCode: 1011,
  },

  // -------------------------

  ROLE_NOT_FOUND: {
    message: 'Role not found',
    HttpStatusCode: 404,
    errorCode: 2001,
  },
  PERMISSION_NOT_FOUND: {
    message: 'Permission not found',
    HttpStatusCode: 404,
    errorCode: 2002,
  },
  ROLE_ALREADY_EXISTS: {
    message: 'Role already exists',
    HttpStatusCode: 409,
    errorCode: 2003,
  },
  PERMISSION_ALREADY_EXISTS: {
    message: 'Permission already exists',
    HttpStatusCode: 409,
    errorCode: 2004,
  },
  INPUT_DATA_INCORRECT: {
    message: 'Input data inCorrect',
    HttpStatusCode: 422,
    errorCode: 2005,
  },
  ROLE_PERMISSION_NOT_FOUND: {
    message: 'RolePermission not found',
    HttpStatusCode: 404,
    errorCode: 2006,
  },
  OTP_ALREADY_SENT: {
    message: 'The OTP code has already been sent. Please wait until it expires',
    HttpStatusCode: 429,
    errorCode: 2007,
  },
  USER_IS_BLOCKED: {
    message: 'User access denied: Account is currently blocked',
    HttpStatusCode: 403,
    errorCode: 2008,
  },
  OTP_CODE_EXPIRED: {
    message: 'OTP Code expired',
    HttpStatusCode: 401,
    errorCode: 2009,
  },
  OTP_TOKEN_INVALID: {
    message: 'Token invalid',
    HttpStatusCode: 401,
    errorCode: 2010,
  },
  OTP_CODE_INVALID: {
    message: 'OTP Code invalid',
    HttpStatusCode: 401,
    errorCode: 2011,
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    HttpStatusCode: 404,
    errorCode: 2012,
  },
  LOGIN_AGAIN: {
    message: 'Login again',
    HttpStatusCode: 401,
    errorCode: 2013,
  },
  AUTH_TOKEN_INVALID: {
    message: 'Token invalid',
    HttpStatusCode: 401,
    errorCode: 2014,
  },
  PAGINATION_PARAM_INCORRECT: {
    message: 'PaginationParams are incorrect',
    HttpStatusCode: 422,
    errorCode: 2015,
  },
  USER_ROLE_NOT_FOUND: {
    message: 'UserRole not found',
    HttpStatusCode: 404,
    errorCode: 2016,
  },
  COMPANY_NOT_FOUND: {
    message: 'Company not found',
    HttpStatusCode: 404,
    errorCode: 2017,
  },
  COMPANY_CONFIG_NOT_FOUND: {
    message: 'CompanyConfig not found',
    HttpStatusCode: 404,
    errorCode: 2018,
  },
  COMPANY_CONFIG_KEY_ALREADY_EXISTS: {
    message: 'CompanyConfig key already exists',
    HttpStatusCode: 409,
    errorCode: 2019,
  },
  COMPANY_CONFIG_KEY_NOT_FOUND: {
    message: 'CompanyConfig key not found',
    HttpStatusCode: 404,
    errorCode: 2020,
  },
  CONFIG_KEY_ALREADY_EXISTS: {
    message: 'Config key already exists',
    HttpStatusCode: 409,
    errorCode: 2021,
  },
  CONFIG_NOT_FOUND: {
    message: 'Config not found',
    HttpStatusCode: 404,
    errorCode: 2022,
  },
  PRODUCT_NOT_FOUND: {
    message: 'Product not found',
    HttpStatusCode: 404,
    errorCode: 2023,
  },
  COMPANY_NAME_ALREADY_EXISTS: {
    message: 'Company name already exists',
    HttpStatusCode: 409,
    errorCode: 2024,
  },
  COMPANY_BOT_USERNAME_ALREADY_EXISTS: {
    message: 'Company bot username already exists',
    HttpStatusCode: 409,
    errorCode: 2025,
  },
  COMPANY_TELEGRAM_ID_ALREADY_EXISTS: {
    message: 'Company telegram ID already exists',
    HttpStatusCode: 409,
    errorCode: 2026,
  },
  SERVER_NOT_FOUND: {
    message: 'Server not found',
    HttpStatusCode: 404,
    errorCode: 2027,
  },
  SERVER_NAME_ALREADY_EXISTS: {
    message: 'Server name already exists for this company',
    HttpStatusCode: 409,
    errorCode: 2028,
  },
  SERVER_IP_ALREADY_EXISTS: {
    message: 'Server IP already exists for this company',
    HttpStatusCode: 409,
    errorCode: 2029,
  },
};
