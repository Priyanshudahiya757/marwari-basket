exports.getSales = (req, res) => {
  res.json({ sales: 120000 });
};
exports.getOrders = (req, res) => {
  res.json({ orders: 320 });
};
exports.getRevenue = (req, res) => {
  res.json({ revenue: 250000 });
};
exports.getTopProducts = (req, res) => {
  res.json({ topProducts: ['Block Print Saree', 'Kundan Necklace', 'Blue Pottery Vase'] });
};
exports.getStockAlerts = (req, res) => {
  res.json({ stockAlerts: [{ name: 'Bandhani Dupatta', stock: 2 }, { name: 'Camel Figurine', stock: 1 }] });
};
exports.getTraffic = (req, res) => {
  res.json({ traffic: 1200 });
}; 