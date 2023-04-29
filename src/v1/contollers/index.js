exports.getServices = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      "SELECT * FROM services WHERE geohash6 = ?",
      [req.query.geohash]
    );
    res.json({
      message: "Services fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getTopServices = async (req, res) => {
  try {
    let rows;

    const query = `
  SELECT services.*, users.first_name, users.last_name, users.profile_picture, users.geohash4, users.geohash5, users.geohash6, users.city
  FROM services
  INNER JOIN users ON services.provider_uid = users.uid
  WHERE services.provider_uid != ? AND %GEOHASH_COLUMN% = ?
  ORDER BY rating DESC
  LIMIT 10
`;

    const geohash6Query = query.replace("%GEOHASH_COLUMN%", "users.geohash6");
    [rows] = await req.db.query(geohash6Query, [
      req.user.uid,
      req.query.geohash.substring(0, 6),
    ]);

    if (rows.length < 10) {
      const geohash5Query = query.replace("%GEOHASH_COLUMN%", "users.geohash5");
      [rows] = await req.db.query(geohash5Query, [
        req.user.uid,
        req.query.geohash.substring(0, 5),
      ]);
    }

    if (rows.length < 10) {
      const geohash4Query = query.replace("%GEOHASH_COLUMN%", "users.geohash4");
      [rows] = await req.db.query(geohash4Query, [
        req.user.uid,
        req.query.geohash.substring(0, 4),
      ]);
    }

    res.json({
      message: "Services fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getUserServices = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      `SELECT services.*, users.first_name, users.last_name, users.profile_picture, users.geohash4, users.geohash5, users.geohash6, users.city
       FROM services
       INNER JOIN users ON services.provider_uid = users.uid
       WHERE provider_uid = ?`,
      [req.params.uid]
    );
    res.json({
      message: "Services fetched successfully",
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getService = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      `SELECT services.*, users.first_name, users.last_name, users.profile_picture, users.geohash4, users.geohash5, users.geohash6, users.city
       FROM services
       INNER JOIN users ON services.provider_uid = users.uid
       WHERE services.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({
      message: "Service fetched successfully",
      data: rows[0],
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.createService = async (req, res) => {
  const { category, serviceName, description, duration, price } = req.body;
  try {
    const _images = req.files.service_images.map((image) => image.path);
    const { uid } = req.user;
    const [result] = await req.db.query(
      "INSERT INTO services (category, provider_uid, name, duration, description, price, images) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        category.toLowerCase(),
        req.user.uid,
        serviceName,
        parseInt(duration),
        description,
        parseInt(price),
        JSON.stringify(_images),
      ]
    );
    res.status(201).json({
      message: "Service created successfully",
      data: {
        id: result.insertId,
        category: category.toLowerCase(),
        provider_uid: uid,
        name: serviceName,
        duration: parseInt(duration),
        description,
        price: parseInt(price),
        images: JSON.stringify(_images),
      },
    });
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
