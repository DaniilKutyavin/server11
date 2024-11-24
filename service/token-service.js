const jwt = require('jsonwebtoken')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_KEY_REFRESH);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(model, idColumn, userId, refreshToken) {
        const tokenData = await model.findOne({ where: { [idColumn]: userId } });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await model.create({ [idColumn]: userId, refreshToken });
        return token;
    }

    async removeToken(model, refreshToken) {
        const tokenData = await model.destroy({ where: { refreshToken } });
        return tokenData;
    }

    async findToken(model, refreshToken) {
        const tokenData = await model.findOne({ where: { refreshToken } });
        return tokenData;
    }
}

module.exports = new TokenService();

