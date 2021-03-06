const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { socialAuthenticationConstants } = require('../constants/auth.constants');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const loginUserBySocialDetails = async (userSocialDetails) => {
  // userSocialDetails = userInfo got from social login api + provider name. ex: Google, Facebook
  // This service function must return an user object and then controller will take care the rest
  const { provider, userInfo } = userSocialDetails
  switch (provider) {
    case socialAuthenticationConstants.GOOGLE: {
      const { user } = userInfo
      const { email, name, photo, id } = user
      if (!email || email.length <= 0) throw new ApiError(httpStatus.UNAUTHORIZED, "Can't login with the given social provider email");
      const existingUser = await userService.getUserByEmail(email);
      const userBody = {isEmailVerified: true, email, name, password: 'nihongo365', photo, providerUserId: id, provider: socialAuthenticationConstants.GOOGLE, socialUserDetails: JSON.stringify(userInfo) }
      if (!existingUser) {
        // create a new user account based on this email
        const newUser = await User.create(userBody)
        return newUser
      } else {
        // check for provider user id
        // if the current providerUserId empty => update all fields. If not, check matching. If match => update all fields else throw error fake login
        // if (!existingUser.providerUserId || existingUser.providerUserId === id) {
        //   Object.assign(existingUser, userBody);
        //   await existingUser.save();
        //   return existingUser;
        // }
        // else throw new ApiError(httpStatus.UNAUTHORIZED, "Provider userId and email do not match");
        Object.assign(existingUser, userBody); // override provider
        await existingUser.save();
        return existingUser;
      }
    }

    case socialAuthenticationConstants.FACEBOOK: {
      const { user } = userInfo
      const { email, name, photo, id } = user
      if (!email || email.length <= 0) throw new ApiError(httpStatus.UNAUTHORIZED, "Can't login with the given social provider email");
      const existingUser = await userService.getUserByEmail(email);
      const userBody = {isEmailVerified: true, email, name, password: 'nihongo365', photo, providerUserId: id, provider: socialAuthenticationConstants.FACEBOOK, socialUserDetails: JSON.stringify(userInfo) }
      if (!existingUser) {
        // create a new user account based on this email
        const newUser = await User.create(userBody)
        return newUser
      } else {
        // check for provider user id
        // if the current providerUserId empty => update all fields. If not, check matching. If match => update all fields else throw error fake login
        // if (!existingUser.providerUserId || existingUser.providerUserId === id) {
        //   Object.assign(existingUser, userBody);
        //   await existingUser.save();
        //   return existingUser;
        // }
        // else throw new ApiError(httpStatus.UNAUTHORIZED, "Provider userId and email do not match");
        Object.assign(existingUser, userBody); // override provider
        await existingUser.save();
        return existingUser;
      }
    }

    default:
      throw new ApiError(httpStatus.UNAUTHORIZED, "Can't login with this social provider");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginUserBySocialDetails
};
