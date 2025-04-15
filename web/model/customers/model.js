import { DataTypes } from "sequelize";
import sequelize from "../../connection/database.js";

const Customer = sequelize.define("customers", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    shop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    email_marketing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sms_marketing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'inactive'),
        defaultValue: 'pending',
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: "customers",
});

export default Customer;
