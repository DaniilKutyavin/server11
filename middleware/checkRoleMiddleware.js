const ApiError = require('../error/ApiError')
const tokenService = require('../service/token-service')
const jwt = require('jsonwebtoken')


module.exports = function(role) {
    return function(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                return next(ApiError.UnauthorizedError())
            }
    
            const accessToken = authorizationHeader.split(' ') [1]
            if (!accessToken) {
                return next(ApiError.UnauthorizedError())
            }
    
            const userData = tokenService.validateAccessToken(accessToken)
            if(!userData) {
                return next(ApiError.UnauthorizedError())
            }
    
            const decoded = jwt.verify(accessToken, process.env.SECRET_KEY)
            if (userData.role !== role) {
                return next(ApiError.noAccessError())
            }
    
            req.user = userData
            next()
        } catch (e) {
            return next(ApiError.UnauthorizedError())
        }
    }
}
