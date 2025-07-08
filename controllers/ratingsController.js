const db = require('../config/database');

// ======================
// CREATE or UPDATE Rating
// ======================
exports.setRating = (req, res) => {
    const id_client = req.user.id;
    const { id_feeds, rating } = req.body;

    if (!id_feeds || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'id_feeds and valid rating (1–5) required' });
    }

    const sql = `
        INSERT INTO ratings (id_client, id_feeds, rating)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at_ratings = CURRENT_TIMESTAMP
    `;

    db.query(sql, [id_client, id_feeds, rating], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to submit rating', error: err });
        res.status(200).json({ message: 'Rating submitted successfully' });
    });
};

// ======================
// GET Rating by Feed ID (Average & Total Count)
// ======================
exports.getRatingByFeed = (req, res) => {
    const id_feeds = req.params.id;

    const sql = `
        SELECT 
            AVG(rating) AS average_rating, 
            COUNT(*) AS total_ratings
        FROM ratings
        WHERE id_feeds = ?
    `;

    db.query(sql, [id_feeds], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to get ratings', error: err });
        res.status(200).json(results[0]);
    });
};

// ======================
// GET User's Rating on a Feed
// ======================
exports.getUserRating = (req, res) => {
    const id_client = req.user.id;
    const id_feeds = req.params.id;

    const sql = `SELECT rating FROM ratings WHERE id_client = ? AND id_feeds = ?`;

    db.query(sql, [id_client, id_feeds], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch user rating', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'No rating found' });
        res.status(200).json(results[0]);
    });
};

// ======================
// DELETE Rating (optional)
// ======================
exports.deleteRating = (req, res) => {
    const id_client = req.user.id;
    const id_feeds = req.params.id;

    const sql = `DELETE FROM ratings WHERE id_client = ? AND id_feeds = ?`;

    db.query(sql, [id_client, id_feeds], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to delete rating', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Rating not found' });

        res.status(200).json({ message: 'Rating deleted successfully' });
    });
};
