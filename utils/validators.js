const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const userValidationRules = {
    createUser: [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Tên đăng nhập phải từ 3-30 ký tự')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
            .matches(/\d/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 số')
            .matches(/[a-zA-Z]/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 chữ cái'),
        body('email')
            .isEmail()
            .withMessage('Vui lòng nhập địa chỉ email hợp lệ')
            .normalizeEmail(),
        body('role')
            .notEmpty()
            .withMessage('Vai trò là bắt buộc'),
        validate
    ],

    updateUser: [
        body('email')
            .optional()
            .isEmail()
            .withMessage('Vui lòng nhập địa chỉ email hợp lệ')
            .normalizeEmail(),
        body('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
            .matches(/\d/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 số')
            .matches(/[a-zA-Z]/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 chữ cái'),
        body('imgURL')
            .optional()
            .isURL()
            .withMessage('Vui lòng nhập URL hợp lệ'),
        validate
    ],

    changePassword: [
        body('oldPassword')
            .notEmpty()
            .withMessage('Mật khẩu cũ là bắt buộc'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
            .matches(/\d/)
            .withMessage('Mật khẩu mới phải chứa ít nhất 1 số')
            .matches(/[a-zA-Z]/)
            .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ cái')
            .custom((value, { req }) => {
                if (value === req.body.oldPassword) {
                    throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ');
                }
                return true;
            }),
        validate
    ],

    login: [
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Tên đăng nhập là bắt buộc'),
        body('password')
            .notEmpty()
            .withMessage('Mật khẩu là bắt buộc'),
        validate
    ],

    createRole: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Tên vai trò là bắt buộc')
            .isLength({ min: 2, max: 50 })
            .withMessage('Tên vai trò phải từ 2-50 ký tự'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 200 })
            .withMessage('Mô tả không được vượt quá 200 ký tự'),
        validate
    ],

    updateRole: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Tên vai trò phải từ 2-50 ký tự'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 200 })
            .withMessage('Mô tả không được vượt quá 200 ký tự'),
        validate
    ]
};

module.exports = userValidationRules; 