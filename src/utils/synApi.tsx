import { db } from "./db";

export const getOrders = (cb) => {
  db.executeSql("SELECT * FROM orders", [], (_, res) => {
    cb(res.rows._array);
  });
};

export const saveOrderOffline = (order) => {
  db.executeSql(
    `INSERT INTO orders 
    (recipient, address, status, is_synced, updated_at)
    VALUES (?, ?, ?, ?, ?)`,
    [
      order.recipient,
      order.address,
      "Pending",
      0,
      new Date().toISOString()
    ]
  );
};
