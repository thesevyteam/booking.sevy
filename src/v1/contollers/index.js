exports.getServices = async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM services");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getService = async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM services WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.createService = async (req, res) => {
  try {
    const [result] = await req.db.query(
      "INSERT INTO services (name, description, price) VALUES (?, ?, ?)",
      [req.body.name, req.body.description, req.body.price]
    );
    const [service] = await req.db.query(
      "SELECT * FROM services WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json(service[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.updateService = async (req, res) => {
  try {
    const [result] = await req.db.query(
      "UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?",
      [req.body.name, req.body.description, req.body.price, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    const [service] = await req.db.query(
      "SELECT * FROM services WHERE id = ?",
      [req.params.id]
    );
    res.json(service[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const [result] = await req.db.query("DELETE FROM services WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getBookings = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      "SELECT * FROM bookings WHERE user_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getBooking = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      "SELECT * FROM bookings WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.createBooking = async (req, res) => {};

exports.updateBooking = async (req, res) => {};

exports.deleteBooking = async (req, res) => {
  try {
    const [result] = await req.db.query(
      "DELETE FROM bookings WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
