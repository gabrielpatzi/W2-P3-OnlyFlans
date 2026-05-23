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

async function loginUser(req, res) { // de aqui se movio la forma de manejar la sesion, en vez de mandar el token pelado, usaremos cookies
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

        res.cookie('sessionToken', sessionToken, {
            maxAge: 8 * 60 * 60 * 1000,
            httpOnly: true, //para que la galletita no pueda ser accedida desde js en el navegador  x document.cookie
            secure: false //esto es para que la cookie solo sea enviada si la coneccion es https (mas segura), ahorita la usamos en false porque estamos en entorno de desarrollo para produ cambiamos a true
        });

        //lo que acabamos de hacer coloca la cookie en el header de nuestra response y ahora viajara automaticamente entre request

        //entonces solo queda responder al cliente para que la cookie viaje en el header de esta response
        return res.status(200).json({message: 'Sesion iniciada con exito'}); 

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error interno en el servidor, intente nuevamente' });
    }
}


function logoutUser(req, res) {

   res.clearCookie('sessionToken', { //en el response le daremos la instruccion al navegador que vuele la cookie para que su proxima request ya venga limpia
        httpOnly: true, 
        secure: false
   });

   return res.status(200).json({message: 'Sesion cerrada correctamente'}); //mandamos la respuesta con la instruccion dada previamente
}

export { registerUser, loginUser, logoutUser };
