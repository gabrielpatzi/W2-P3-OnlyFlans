import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

// Perfil público del creador (1-a-1 con users donde role='creador')
const CreatorProfile = sequelize.define('creator_profiles', {
    profileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    // URL de la foto de perfil (guardada via multer)
    profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // URL del banner
    bannerPhoto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Precio por flan en bolivianos (default Bs. 10)
    flanPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 10.00
    }
});

export default CreatorProfile;
