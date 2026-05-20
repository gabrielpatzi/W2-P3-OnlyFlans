import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Goal = sequelize.define('goals', {
    goalId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Goal;
