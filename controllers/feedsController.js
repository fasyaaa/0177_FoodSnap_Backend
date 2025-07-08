const db = require('../config/database');

// ======================
// Create Feed
// ======================
exports.createFeed = (req, res) => {
    const { title, description, location_name, latitude, longitude } = req.body;
    const id_client = req.user.id;

    const img_feeds = req.file ? req.file.buffer : null;

    const sql = `
        INSERT INTO feeds (id_client, title, description, img_feeds, location_name, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [id_client, title, description, img_feeds, location_name, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Insert feed failed', error: err });
        }

        res.status(201).json({ message: 'Feed created successfully', feedId: result.insertId });
    });
};

// ======================
// Get All Feeds (Optional)
// ======================
exports.getAllFeeds = (req, res) => {
    const sql = `
        SELECT f.*, c.name AS client_name
        FROM feeds f
        JOIN client c ON f.id_client = c.id_client
        ORDER BY f.created_at_feeds DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching feeds', error: err });
        res.status(200).json(results);
    });
};

// ======================
// Get Feed by ID
// ======================
exports.getFeedById = (req, res) => {
    const feedId = req.params.id;

    const sql = `
        SELECT f.*, c.name AS client_name
        FROM feeds f
        JOIN client c ON f.id_client = c.id_client
        WHERE f.id_feeds = ?
    `;

    db.query(sql, [feedId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving feed', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Feed not found' });

        res.status(200).json(results[0]);
    });
};

// ======================
// Update Feed
// ======================
exports.updateFeed = (req, res) => {
    const id = req.params.id;
    const { title, description, location_name, latitude, longitude } = req.body;
    const userId = req.user.id;

    const sql = `
        UPDATE feeds SET title = ?, description = ?, location_name = ?, latitude = ?, longitude = ?
        WHERE id_feeds = ? AND id_client = ?
    `;

    db.query(sql, [title, description, location_name, latitude, longitude, id, userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Update failed', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Feed not found or unauthorized' });

        res.json({ message: 'Feed updated successfully' });
    });
};

// ======================
// Delete Feed
// ======================
exports.deleteFeed = (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;

    const sql = `DELETE FROM feeds WHERE id_feeds = ? AND id_client = ?`;

    // dont forget to change (,error : err) for not giving user the error 
    db.query(sql, [id, userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Delete failed', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Feed not found or unauthorized' });

        res.json({ message: 'Feed deleted successfully' });
    });
};
