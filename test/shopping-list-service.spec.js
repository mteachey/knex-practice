const ShoppingListService = require('../src/shopping-list-service.js');
const knex = require('knex');

describe('Shopping List service object', function(){
    let db
    let testItems = [
        {
            item_id:1,
            name:'NoBull Burger',
            price: '4.00',
            category: 'Snack',
            checked: false,
            date_added:new Date('2029-01-22T16:28:32.615Z')
        },
        {
            item_id:2,
            name:'Turnip the Beet',
            price: '0.20',
            category: 'Lunch',
            checked: true,
            date_added:new Date('2029-01-22T16:28:32.615Z')
        },
        {
            item_id:3,
            name:'Burgatory',
            price: '1.20',
            category: 'Main',
            checked: true,
            date_added:new Date('2029-01-22T16:28:32.615Z')
        },
    ]

    before('setup db', () =>{
        db = knex({
            client:'pg',
            connection:process.env.TEST_DB_URL,
        })
    })

    before('clean db', ()=>db('shopping_list').truncate());
    afterEach('clean db',()=>db('shopping_list').truncate());

    after('end db connection',()=>db.destroy());
    
    context(`Given 'shopping_list has data`, ()=>{

       beforeEach(()=>{
           return db
              .into('shopping_list')
              .insert(testItems)
       })

        it(`getShoppingItems() resolves all items from 'shopping_list' table`,()=>{
            return ShoppingListService.getShoppingItems(db)
                .then(actual=>{
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getByItemId() reolves an item by item_id for 'shopping_list`,()=>{
            const thirdItemId =3;
            const thirdTestItem = testItems[thirdItemId-1];
            return ShoppingListService.getByItemId(db,thirdItemId)
                .then(actual=>{
                    expect(actual).to.eql({
                        item_id: thirdItemId,
                        name:thirdTestItem.name,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        checked: thirdTestItem.checked,
                        date_added:thirdTestItem.date_added,
                    })
                })
        })

        it(`deleteItem() removes item by id from 'shopping_list' table`,()=>{
            const itemId=3;
            return ShoppingListService.deleteItem(db,itemId)
                .then(()=>ShoppingListService.getShoppingItems(db))
                .then(allItems=>{
                    const expected = testItems.filter(item=>item.item_id !==itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`insertItem() inserts a new item and resolves the new item `,()=>{
            const newItem={
                item_id:4,
                name:'Turnip the Beet',
                price: '0.20',
                category: 'Lunch',
                checked: true,
                date_added:new Date('2029-01-22T16:28:32.615Z')

            }
            return ShoppingListService.insertItem(db,newItem)
                .then(actual=>{
                    expect(actual).to.eql({
                        item_id:4,
                        name:'Turnip the Beet',
                        price: '0.20',
                        category: 'Lunch',
                        checked: true,
                        date_added:new Date('2029-01-22T16:28:32.615Z')
                    })
                });

        })

        it(`updateItem() updates an item from the 'shopping_list' table`,()=>{
            const idOfItemToUpdate = 2;
            const newItemData={
                name:'Whattup new item',
                price: '0.26',
                checked: false,
                date_added:new Date('2029-01-22T16:28:32.615Z')
            }
            const originalItem = testItems[idOfItemToUpdate - 1];
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(()=>ShoppingListService.getByItemId(db,idOfItemToUpdate))
                .then(i =>{
                    expect(i).to.eql({
                        item_id:idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    })
                })
        })

    })//end of data group

    context(`Given 'shopping_list has no data`, ()=>{
        it(`getShoppingItems() resolves an empty array`,()=>{
            return ShoppingListService.getShoppingItems(db)
            .then(actual=>{
                expect(actual).to.eql([])
            })
        })

        it(`insertItem() inserts a new item and resolves the new item with id`,()=>{
            const newItem={
                item_id:1,
                name:'Turnip the Beet',
                price: '0.20',
                category: 'Lunch',
                checked: true,
                date_added:new Date('2029-01-22T16:28:32.615Z')

            }
            return ShoppingListService.insertItem(db,newItem)
                .then(actual=>{
                    expect(actual).to.eql({
                        item_id:1,
                        name:'Turnip the Beet',
                        price: '0.20',
                        category: 'Lunch',
                        checked: true,
                        date_added:new Date('2029-01-22T16:28:32.615Z')
                    })
                });
        })
        
    })//end of no data group

})//end of Obj describe