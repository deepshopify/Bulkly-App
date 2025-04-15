import sequelize from "../connection/database.js";

export const getAccessTokenForShop = async (shop) => {
  try {
    const results = await sequelize.query(
      'SELECT * FROM shopify_sessions WHERE shop = :shopName',
      {
        replacements: { shopName: shop },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const accessToken = results[0]?.accessToken;
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    return accessToken;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    throw new Error('Error retrieving access token');
  }
};
