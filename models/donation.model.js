import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

// Donacion de un seguidor a un creador
// flanCount: cantidad de flanes enviados (cada flan = precio fijo)
const Donation = sequelize.define('donations', {
    donationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // userId del seguidor que dona
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // userId del creador que recibe
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    flanCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    // precio por flan al momento de la donacion (para historico)
    flanPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 10.00
    },
    // mensaje opcional del donador
    message: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Donation;
