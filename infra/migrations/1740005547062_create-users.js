
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For reference: Github username length limit is 39 characters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // For reference: RFC 5321 specifies a maximum length of 254 characters
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // For reference: bcrypt hash length is 72 characters
    password: {
      type: "varchar(72)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  })
};

exports.down = false;
