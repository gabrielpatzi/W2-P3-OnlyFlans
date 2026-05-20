import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const User = sequelize.define('users', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 'creador' o 'seguidor'
    role: {
        type: DataTypes.ENUM('creador', 'seguidor'),
        allowNull: false
    }
});

export default User;
