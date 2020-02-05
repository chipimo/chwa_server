exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("users", function(table) {
      table.increments("id");
      table.string("user_id").notNullable();
      table.string("user_name").notNullable(); 
      table.string("email").notNullable();
      table.string("Fname").notNullable();
      table.string("Lname").notNullable();
      table.string("Password").notNullable();
      table.jsonb("Profile_pic").notNullable();
      table.jsonb("Purchases").notNullable();
      table.string("NotificationId").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })

    .createTable("assignments", function(table) { 
      table.increments("key");
      table.string("id").notNullable();
      table.string("name").notNullable();
      table.string("downloads").notNullable();
      table.string("state").notNullable();
      table.string("link").notNullable();
      table.jsonb("overview").notNullable();
      table.jsonb("comment_status").notNullable();
      table.string("author").notNullable();
      table.jsonb("featured_image").notNullable();
      table.string("price").notNullable();
      table.text("secure_url").notNullable();
      table.boolean("is_active").notNullable();
      table.timestamp("date").defaultTo(knex.fn.now());
      table.timestamp("modified").defaultTo(knex.fn.now());
    })

    .createTable("past_papers", function(table) {
      table.increments("key");
      table.string("id").notNullable();
      table.string("name").notNullable();
      table.string("downloads").notNullable();
      table.string("state").notNullable();
      table.string("link").notNullable();
      table.jsonb("overview").notNullable();
      table.jsonb("comment_status").notNullable();
      table.string("author").notNullable();
      table.jsonb("featured_image").notNullable();
      table.string("price").notNullable();
      table.text("secure_url").notNullable();
      table.boolean("is_active").notNullable();
      table.timestamp("date").defaultTo(knex.fn.now());
      table.timestamp("modified").defaultTo(knex.fn.now());
    })

    .createTable("books", function(table) {
      table.increments("key");
      table.string("id").notNullable();
      table.string("name").notNullable();
      table.string("downloads").notNullable();
      table.string("state").notNullable();
      table.string("link").notNullable();
      table.jsonb("overview").notNullable();
      table.jsonb("comment_status").notNullable();
      table.string("author").notNullable();
      table.jsonb("featured_image").notNullable();
      table.string("price").notNullable();
      table.text("secure_url").notNullable();
      table.boolean("is_active").notNullable();
      table.timestamp("date").defaultTo(knex.fn.now());
      table.timestamp("modified").defaultTo(knex.fn.now());
    })

    .createTable("news_papers", function(table) {
      table.increments("key");
      table.string("id").notNullable();
      table.string("name").notNullable();
      table.string("downloads").notNullable();
      table.string("state").notNullable();
      table.string("link").notNullable();
      table.jsonb("overview").notNullable();
      table.jsonb("comment_status").notNullable();
      table.string("author").notNullable();
      table.jsonb("featured_image").notNullable();
      table.string("price").notNullable();
      table.text("secure_url").notNullable();
      table.boolean("is_active").notNullable();
      table.timestamp("date").defaultTo(knex.fn.now());
      table.timestamp("modified").defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("users")
    .dropTable("assignments")
    .dropTable("past_papers")
    .dropTable("books")
    .dropTable("news_papers");
};
