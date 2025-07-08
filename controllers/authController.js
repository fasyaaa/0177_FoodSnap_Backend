const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ===================
// REGISTER
// ===================
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO client (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, email, hashedPassword, role || 'client'], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: 'Register failed', error: err });
            }

            const user = { id: result.insertId, name, email, role: role || 'client' };
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(201).json({ message: 'Register success', token });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ===================
// LOGIN
// ===================
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM client WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

        const token = jwt.sign(
            { id: user.id_client, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: 'Login success', token });
    });
};

// Optional: Dashboard view
exports.dashboard = (req, res) => {
    res.render('dashboard', { user: req.user });
};
