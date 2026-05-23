function jsonRequestValid(req, res, next) {
    if (!req.is('application/json')) {
        //return res.status(415).json({ error: 'Content-Type debe ser application/json' }); mucha info para el cliente dar esa response (bandeeera)
         return res.status(415).json({ error: 'Formato incorrecto, intente nuevamente' });
    }
    if(!req.body || Object.keys(req.body).length === 0){
        return res.status(400).json({message: 'Debe enviar datos validos'});
    }
    next();
}

export default jsonRequestValid;
