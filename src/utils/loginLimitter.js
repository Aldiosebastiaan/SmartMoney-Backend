import db from "../config/db.js";

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 60;

// ================================
// CHECK LOCK
// ================================
export const checkLoginLock = async (identifier) => {
  const [[row]] = await db.query(
    `
    SELECT
      attempts,
      locked_until,
      locked_until IS NOT NULL
      AND locked_until > NOW() AS is_locked,
      locked_until <= NOW() AS is_expired
    FROM login_attempts
    WHERE identifier = ?
    `,
    [identifier]
  );

  if (!row) return { allowed: true };

  // 🔓 expired → reset total
  if (row.is_expired) {
    await db.query(
      "DELETE FROM login_attempts WHERE identifier = ?",
      [identifier]
    );
    return { allowed: true };
  }

  // 🔒 still locked
  if (row.is_locked) {
    return {
      allowed: false,
      retryAfter: LOCK_SECONDS,
    };
  }

  return { allowed: true };
};

// ================================
// RECORD FAILED LOGIN
// ================================
export const recordFailedLogin = async (identifier) => {
  const [[row]] = await db.query(
    "SELECT attempts FROM login_attempts WHERE identifier = ?",
    [identifier]
  );

  if (!row) {
    await db.query(
      "INSERT INTO login_attempts (identifier, attempts) VALUES (?, 1)",
      [identifier]
    );
    return;
  }

  const attempts = row.attempts + 1;

  if (attempts >= MAX_ATTEMPTS) {
    await db.query(
      `
      UPDATE login_attempts
      SET attempts = ?, locked_until = DATE_ADD(NOW(), INTERVAL ? SECOND)
      WHERE identifier = ?
      `,
      [attempts, LOCK_SECONDS, identifier]
    );
  } else {
    await db.query(
      "UPDATE login_attempts SET attempts = ? WHERE identifier = ?",
      [attempts, identifier]
    );
  }
};

// ================================
// RESET AFTER SUCCESS
// ================================
export const resetLoginAttempts = async (identifier) => {
  await db.query(
    "DELETE FROM login_attempts WHERE identifier = ?",
    [identifier]
  );
};
