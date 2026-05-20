import bcrypt from 'bcrypt';
import tokenUtils from '../utils/jwt.utils.js';
import { findUserByEmailService, registerUserService } from '../services/auth.service.js';

async function registerUser(req, res) {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await findUserByEmailService(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya esta registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await registerUserService({ name, email, hashedPassword, role });

        return res.status(201).json({ message: 'Usuario registrado con exito !' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno en el servidor, intente nuevamente' });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmailService(email);
        if (!user) {
            return res.status(400).json({ message: 'Email o contraseña incorrectos' });
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Email o contraseña incorrectos' });
        }

        const sessionToken = tokenUtils.generateToken({
            userId: user.userId,
            name: user.name,
            role: user.role
        });

        return res.status(200).json({ sessionToken, role: user.role }); 
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno en el servidor, intente nuevamente' });
    }
}

// El logout en JWT stateless se maneja en el frontend (eliminar el token)
// Opcionalmente aqui podriamos invalidar tokens con una blacklist, pero por ahora:
function logoutUser(req, res) {
    return res.status(200).json({ message: 'Sesion cerrada correctamente' });
}

export { registerUser, loginUser, logoutUser };
