import { DataTypes } from "sequelize";
import sequelize from "../../connection/database.js";

const UpsellProduct = sequelize.define("UpsellProduct", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    shop: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    variantId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    tableName: "UpsellProduct",
});

export default UpsellProduct;
