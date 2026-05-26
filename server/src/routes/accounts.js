const router = require('express').Router();
const { pool } = require('../db');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// List all accounts for user
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, role, account_id, account_name, env, scale_factor, active, connected_at
       FROM tradovate_accounts WHERE user_id = $1 ORDER BY role, connected_at`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// Update follower scale factor or active status
router.patch('/:id', async (req, res, next) => {
  try {
    const { scale_factor, active } = req.body;
    const fields = [];
    const values = [];
    let i = 1;
    if (scale_factor !== undefined) { fields.push(`scale_factor = $${i++}`); values.push(scale_factor); }
    if (active !== undefined) { fields.push(`active = $${i++}`); values.push(active); }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });

    values.push(req.params.id, req.user.id);
    const result = await pool.query(
      `UPDATE tradovate_accounts SET ${fields.join(', ')}
       WHERE id = $${i} AND user_id = $${i + 1}
       RETURNING id, role, account_id, account_name, scale_factor, active`,
      values
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Account not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// Get copy rules for a master account
router.get('/:masterId/rules', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM copy_rules WHERE user_id = $1 AND master_account_id = $2',
      [req.user.id, req.params.masterId]
    );
    res.json(result.rows[0] || null);
  } catch (err) { next(err); }
});

// Upsert copy rules
router.put('/:masterId/rules', async (req, res, next) => {
  try {
    const { copy_enabled, max_daily_loss, pause_on_max_loss } = req.body;
    const result = await pool.query(
      `INSERT INTO copy_rules (user_id, master_account_id, copy_enabled, max_daily_loss, pause_on_max_loss)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id, master_account_id)
         DO UPDATE SET copy_enabled=$3, max_daily_loss=$4, pause_on_max_loss=$5
       RETURNING *`,
      [req.user.id, req.params.masterId, copy_enabled ?? true, max_daily_loss ?? null, pause_on_max_loss ?? true]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
