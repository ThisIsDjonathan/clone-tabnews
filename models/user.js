import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  const newUser = await runInsertQuery(userInputValues);
  return newUser;
}

async function validateUniqueEmail(email) {
  const dbResult = await database.query({
    text: `SELECT email FROM users WHERE LOWER(email) = LOWER($1);`,
    values: [email],
  });

  if (dbResult.rowCount > 0) {
    throw new ValidationError({
      message: `Email "${email}" is already in use.`,
      action: `Try again with a different email.`,
    });
  }
}

async function validateUniqueUsername(username) {
  const dbResult = await database.query({
    text: `SELECT email FROM users WHERE LOWER(username) = LOWER($1);`,
    values: [username],
  });

  if (dbResult.rowCount > 0) {
    throw new ValidationError({
      message: `Username "${username}" is already in use.`,
      action: `Try again with a different username.`,
    });
  }
}


async function runInsertQuery(userInputValues) {
  const dbResult = await database.query({
    text: `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });

  return dbResult.rows[0];
}

const user = {
  create,
};

export default user;
