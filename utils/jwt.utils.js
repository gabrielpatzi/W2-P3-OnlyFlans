import jwt from 'jsonwebtoken';

export default {
    generateToken: (payload) => {
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '8h' });
    },
    validateToken: (token) => {
        try {
            return jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            throw error;
        }
    }
};
