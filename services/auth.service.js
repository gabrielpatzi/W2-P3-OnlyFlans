import { User, CreatorProfile } from '../models/index.js';

async function findUserByEmailService(email) {
    try {
        return await User.findOne({ where: { email } });
    } catch (error) {
        throw error;
    }
}

async function registerUserService(userData) {
    try {
        const user = await User.create(userData);

        // Si es creador, creamos su perfil publico automaticamente
        if (user.role === 'creador') {
            await CreatorProfile.create({
                userId: user.userId,
                flanPrice: process.env.FLAN_PRICE || 10
            });
        }

        return user;
    } catch (error) {
        throw error;
    }
}

export { findUserByEmailService, registerUserService };
