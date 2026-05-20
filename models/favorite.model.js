import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

// Tabla pivot: seguidor marca un creador como favorito
const Favorite = sequelize.define('favorites', {
    favoriteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Favorite;
