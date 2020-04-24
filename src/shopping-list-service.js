const ShoppingListService = {
  getShoppingItems(knex){
      return knex.select('*').from('shopping_list');
  },

  insertItem(knex, newItem){
      return knex   
        .insert(newItem)
        .into('shopping_list')
        .returning('*')
        .then(rows=>{
            return rows[0]
        })
  },

  getByItemId(knex,id){
      return knex.from('shopping_list').select('*').where('item_id',id).first()
  },

  deleteItem(knex,id){
      return knex
      .from('shopping_list')
      .where('item_id',id)
      .delete()
  },

  updateItem(knex,id, newItemData){
      return knex
      .from('shopping_list')
      .where('item_id',id)
      .update(newItemData)
  },


}

module.exports = ShoppingListService;