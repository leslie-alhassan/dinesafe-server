/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('ratings', (table) => {
    table.increments('id').primary();
    table.integer('establishment_id').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.float('rating').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table
      .foreign('establishment_id')
      .references('id')
      .inTable('establishments')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('ratings');
};
