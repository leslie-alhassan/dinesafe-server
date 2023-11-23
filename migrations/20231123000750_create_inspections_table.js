/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('inspections', (table) => {
    table.integer('id').primary().notNullable();
    table.integer('establishment_id').notNullable();
    table.string('inspection_date').notNullable();
    table.string('status').notNullable();
    table.text('inspection_details');
    table.string('severity');
    table.string('action');
    table.string('outcome');
    table.string('amount_fined');
    table.string('establishment_type');
    table
      .foreign('establishment_id')
      .references('id')
      .inTable('establishments')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('inspections');
};
