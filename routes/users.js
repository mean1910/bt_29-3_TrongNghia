var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { CreateSuccessResponse, CreateErrorResponse } = require('../utils/responseHandler')
let { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');
const userValidationRules = require('../utils/validators');

/* GET users listing. */
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  console.log(req.headers.authorization);
  let users = await userController.GetAllUser();
  CreateSuccessResponse(res, 200, users)
});

// Tạo mới user với validation
router.post('/', userValidationRules.createUser, async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessResponse(res, 200, newUser)
  } catch (error) {
    CreateErrorResponse(res, 404, error.message)
  }
});

// Cập nhật user với validation
router.put('/:id', check_authentication, userValidationRules.updateUser, async function (req, res, next) {
  try {
    let body = req.body;
    let updatedResult = await userController.UpdateAnUser(req.params.id, body);
    CreateSuccessResponse(res, 200, updatedResult)
  } catch (error) {
    next(error)
  }
});

// Đổi mật khẩu với validation
router.post('/change-password', check_authentication, userValidationRules.changePassword, async function (req, res, next) {
  try {
    let user = await userController.GetUserByID(req.user.id);
    await userController.Change_Password(user, req.body.oldPassword, req.body.newPassword);
    CreateSuccessResponse(res, 200, { message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    CreateErrorResponse(res, 400, error.message);
  }
});

// Đăng nhập với validation
router.post('/login', userValidationRules.login, async function (req, res, next) {
  try {
    let userId = await userController.CheckLogin(req.body.username, req.body.password);
    CreateSuccessResponse(res, 200, { userId });
  } catch (error) {
    CreateErrorResponse(res, 401, error.message);
  }
});

module.exports = router;
