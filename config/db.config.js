import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: false,
    define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

async function connectDb() {
    try {
        await sequelize.authenticate();
        console.log('Conexion a la db exitosa !');
    } catch (error) {
        throw error;
    }
}

export { sequelize, connectDb };
