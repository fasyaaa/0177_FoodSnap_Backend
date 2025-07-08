const db = require('../config/db');

// GET all clients
exports.getAllClients = (req, res) => {
    const sql = 'SELECT id_client, name, username, email, gender, role, created_at_client, update_at_client FROM client WHERE role = "client"';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching clients', error: err });
        res.status(200).json(results);
    });
};

// GET client by ID
exports.getClientById = (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT id_client, name, username, email, gender, role, created_at_client, update_at_client FROM client WHERE id_client = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching client', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Client not found' });
        res.status(200).json(results[0]);
    });
};

// CREATE a new client
exports.createClient = (req, res) => {
    const { name, username, email, password, gender } = req.body;
    const img_profile = req.file ? req.file.buffer : null;

    if (!name || !username || !email || !password || !gender) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `
        INSERT INTO client (name, username, email, password, gender, img_profile, role)
        VALUES (?, ?, ?, ?, ?, ?, 'client')
    `;
    db.query(sql, [name, username, email, password, gender, img_profile], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to create client', error: err });
        res.status(201).json({ message: 'Client created successfully', id_client: result.insertId });
    });
};

// UPDATE client
exports.updateClient = (req, res) => {
    const id = req.params.id;
    const { name, username, email, gender } = req.body;
    const img_profile = req.file ? req.file.buffer : null;

    const sql = `
        UPDATE client SET name = ?, username = ?, email = ?, gender = ?, img_profile = ?
        WHERE id_client = ? AND role = 'client'
    `;
    db.query(sql, [name, username, email, gender, img_profile, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to update client', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client updated successfully' });
    });
};

// DELETE client
exports.deleteClient = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM client WHERE id_client = ? AND role = "client"';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to delete client', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted successfully' });
    });
};
