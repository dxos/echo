query([{ a: 'org' }, '<-works--', {b: 'person' }, 'friends', { c: 'person' }])
  .where(({ a }) => a.name === 'Alice')


const PERSON = objectType(ObjectModel, 'dxn:echo.dxos:object/person')
const ORG = objectType(ObjectModel, 'dxn:echo.dxos:object/ORG')

const WORKS_FOR = linkType(PERSON, 'dxn:echo.dxos:link/works-for', ORG)



// Alice --WORKS_FOR-> Google


// Find all companies Alice works for
database.query(alice)     //                             Query<Item<ObjectModel>>
  .linkedFrom(WORKS_FOR)  // all links where from=alice  Query<Link<ObjectModel, ObjectModel, ObjectModel>>
  .to()                   // map(link => link=to)        Query<Item<ObjectModel>>
  .exec()
  

// Find all employees of Google
database.query(google)
  .linkedTo(WORKS_FOR).from() // <--WORKS_FOR--
  .exec()

// Alice --FRIENDS_WITH { since: 2018 }-- Bob

// Find all friends of Alice
database.query(alice)
  .linked(FRIENDS_WITH) // Query<Link<ObjectModel, ObjectModel, ObjectModel>>
  .other()      
  .exec()

// Find all friends of Alice since 2018 or earlier
database.query(alice)
  .linked(FRIENDS_WITH) // Query<Link<ObjectModel, ObjectModel, ObjectModel>>
  .where(l => l.model.getProperty('since') <= 2018)
  .other()      
  .exec()

// Find all companies friends of Alice work in
database.query(alice)
  .linked(FRIENDS_WITH).other()   // Query<Item<ObjectModel>>
  .linkedFrom(WORKS_FOR).to()     // Query<Item<ObjectModel>>
  .exec()
