const router = require('express').Router();
const { pool } = require('../db');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// Trade history with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, status, symbol } = req.query;
    const conditions = ['tc.user_id = $1'];
    const values = [req.user.id];
    let i = 2;

    if (status) { conditions.push(`tc.status = $${i++}`); values.push(status); }
    if (symbol) { conditions.push(`tc.symbol ILIKE $${i++}`); values.push(`%${symbol}%`); }

    values.push(Number(limit), Number(offset));
    const result = await pool.query(
      `SELECT tc.*,
        ma.account_name AS master_name,
        fa.account_name AS follower_name,
        fa.scale_factor
       FROM trade_copies tc
       JOIN tradovate_accounts ma ON ma.id = tc.master_account_id
       JOIN tradovate_accounts fa ON fa.id = tc.follower_account_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY tc.created_at DESC
       LIMIT $${i} OFFSET $${i + 1}`,
      values
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// Trade summary stats
router.get('/stats', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'filled') AS total_filled,
        COUNT(*) FILTER (WHERE status = 'error') AS total_errors,
        COUNT(DISTINCT master_account_id) AS master_count,
        COUNT(DISTINCT follower_account_id) AS follower_count,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 day') AS today_count
       FROM trade_copies WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
