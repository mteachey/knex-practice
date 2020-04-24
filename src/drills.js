require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client:'pg',
    connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

function searchByItemName(searchTerm){
    knexInstance
        .select('item_id', 'name' , 'price' , 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

//searchByItemName('chicken');

function paginateProducts(pageNumber){
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber-1);
    knexInstance
    .select('item_id', 'name' , 'price' , 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result=>{
        console.log(result)
    })
}

//paginateProducts(1);

function afterDate(daysAgo){
    knexInstance
    .select('item_id', 'name' , 'price' , 'category','date_added')
    .from('shopping_list')
    .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result=>{
        console.log(result)
    })
}

//afterDate(1);
//select and groupBy have to match
function totalCostCategory(){
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result=>{
            console.log(result)
        })
}
totalCostCategory();