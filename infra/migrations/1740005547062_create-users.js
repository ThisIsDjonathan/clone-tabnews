exports.up = (pgm) => {
  pgm.createTable("users", {
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
    // For reference: bcrypt hash result length is 60 characters
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};

exports.down = false;
