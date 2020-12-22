const PERSON = objectType(ObjectModel, 'dxn:echo.dxos:object/person')
const ORG = objectType(ObjectModel, 'dxn:echo.dxos:object/ORG')

const WORKS_FOR = linkType(PERSON, 'dxn:echo.dxos:link/works-for', ORG)
const FRIENDS_WITH = linkType(PERSON, 'dxn:echo.dxos:link/friends-with', PERSON)



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

// Find all friends of Alice who work at Google
database.query(alice)
  .linked(FRIENDS_WITH).other()   // Query<Item<ObjectModel>>
  .where(a => database.query(a)
    .linkFrom(WORKS_FOR).to()
    .contains(google)
  )
  .exec()


// Find all friends of Alice who work at Google
const googleEmployees = database.query(google)
  .linkedTo(WORKS_FOR).from()
  .exec()

database.query(alice)
  .linked(FRIENDS_WITH).other()
  .intersect(googleEmployees)
  .exec()


//
// Match syntax
//


// Find all companies Alice works for
database.query([alice, linkTo(WORKS_FOR), { org: ORG }])         // Query<{ org: Item<ObjectModel> }>

// Find all employees of google
database.query([google, linkFrom(WORKS_FOR), { employee: PERSON }]) // Query<{ org: Item<ObjectModel> }>

// Find all companies friends of Alice work at
database.query([alice, link(FRIENDS_WITH), PERSON, linkTo(WORKS_FOR), { org: ORG }]) // Query<{ org: Item<ObjectModel> }>

// Find all friends of Alice who work at Google
database.query([alice, link(FRIENDS_WITH), { friend: PERSON }, linkTo(WORKS_FOR), google]) // Query<{ friend: Item<ObjectModel> }>
