import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

const Post = sequelize.define('posts', {
    postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // URL de imagen opcional
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Post;
