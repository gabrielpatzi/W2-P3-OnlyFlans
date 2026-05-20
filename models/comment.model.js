import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.config.js';

// Solo seguidores pueden comentar; solo el creador puede ver los comentarios
const Comment = sequelize.define('comments', {
    commentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // userId del seguidor que comenta
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Comment;
