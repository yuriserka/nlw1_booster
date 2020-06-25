import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('collection_points', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('image').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('collection_points');
}
