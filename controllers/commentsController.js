const db = require('../config/database');

// ======================
// CREATE Comment / Reply
// ======================
exports.createComment = (req, res) => {
    const { id_feeds, content, id_parent } = req.body;
    const id_client = req.user.id;

    if (!content || !id_feeds) {
        return res.status(400).json({ message: 'Feed ID and content are required' });
    }

    const sql = `
        INSERT INTO comments (id_client, id_feeds, id_parent, content)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [id_client, id_feeds, id_parent || null, content], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to add comment', error: err });

        res.status(201).json({ message: 'Comment added', commentId: result.insertId });
    });
};

// ======================
// READ Comments by Feed (nested)
// ======================
exports.getCommentsByFeed = (req, res) => {
    const id_feeds = req.params.id;

    const sql = `
        SELECT c.*, cl.name AS client_name
        FROM comments c
        JOIN client cl ON c.id_client = cl.id_client
        WHERE c.id_feeds = ?
        ORDER BY c.created_at ASC
    `;

    db.query(sql, [id_feeds], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching comments', error: err });

        const map = {};
        const root = [];

        results.forEach(comment => {
            comment.replies = [];
            map[comment.id_comments] = comment;
        });

        results.forEach(comment => {
            if (comment.id_parent) {
                map[comment.id_parent]?.replies.push(comment);
            } else {
                root.push(comment);
            }
        });

        res.status(200).json(root);
    });
};

// ======================
// UPDATE Comment (only by owner)
// ======================
exports.updateComment = (req, res) => {
    const id = req.params.id;
    const id_client = req.user.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: 'Content is required' });

    const sql = `
        UPDATE comments SET content = ?
        WHERE id_comments = ? AND id_client = ?
    `;

    db.query(sql, [content, id, id_client], (err, result) => {
        if (err) return res.status(500).json({ message: 'Update failed', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Comment not found or unauthorized' });

        res.json({ message: 'Comment updated successfully' });
    });
};

// ======================
// DELETE Comment (only by owner)
// ======================
exports.deleteComment = (req, res) => {
    const id = req.params.id;
    const id_client = req.user.id;

    const sql = `DELETE FROM comments WHERE id_comments = ? AND id_client = ?`;

    db.query(sql, [id, id_client], (err, result) => {
        if (err) return res.status(500).json({ message: 'Delete failed', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Comment not found or unauthorized' });

        res.json({ message: 'Comment deleted successfully' });
    });
};

// ======================
// Count Down the replies
// ======================
exports.getCommentsByFeed = (req, res) => {
    const id_feeds = req.params.id;

    const sql = `
        SELECT c.*, cl.name AS client_name,
            (SELECT COUNT(*) FROM comments r WHERE r.id_parent = c.id_comments) AS reply_count
        FROM comments c
        JOIN client cl ON c.id_client = cl.id_client
        WHERE c.id_feeds = ?
        ORDER BY c.created_at ASC
    `;

    db.query(sql, [id_feeds], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching comments', error: err });

        const map = {};
        const root = [];

        results.forEach(comment => {
            comment.replies = [];
            map[comment.id_comments] = comment;
        });

        results.forEach(comment => {
            if (comment.id_parent) {
                map[comment.id_parent]?.replies.push(comment);
            } else {
                root.push(comment);
            }
        });

        res.status(200).json(root);
    });
};
