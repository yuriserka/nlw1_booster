import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { name: 'Lâmpadas', image: 'lampada.svg' },
    { name: 'Pilhas e Baterias', image: 'bateria.svg' },
    { name: 'Papéis e Papelão', image: 'papel.svg' },
    { name: 'Resíduos Eletrônico', image: 'eletronico.svg' },
    { name: 'Resíduos Orgânicos', image: 'organico.svg' },
    { name: 'Óleo de Cozinha', image: 'oleo.svg' },
  ]);
}