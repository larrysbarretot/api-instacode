const User = require('./user.model');
const bcrypt = require('bcrypt');
const { generateToken, setError } = require('../../helpers/utils');

// Registro
const create = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        const userExist = await User.findOne({ email: newUser.email });

        if(userExist) return next(setError(409, 'El email ya existe'));
        const userInDb = await newUser.save();
        return res.status(201).json(userInDb);
    } catch (error) {
        return next(setError(500, 'Crear usuario ha fallado'))
    }
}

// Login
const login = async (req, res, next) => {
    try {
        const userInDb = await User.findOne({email: req.body.email});
        if(bcrypt.compareSync(req.body.password, userInDb.password)) {
            const token = generateToken(userInDb._id, userInDb.email);
            return res.status(200).json({
                user: userInDb,
                token
            })
        } else {
            return next(setError(401, 'No coincide contraseña'));
        }
    } catch (error) {
        return next(setError(500, 'Login usuario ha fallado'))
    }
}

// GetUserID
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return next(setError(404, 'No existe'))
        return res.json({
            status: 200,
            message: 'User Info',
            data: {user}
        })
    } catch (error) {
        return next(setError(500, 'usuario por ID ha fallado'))
    }
}

module.exports = {
    create,
    login,
    getById
}