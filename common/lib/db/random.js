module.exports = (res, next, Collection, options, done)=>{
  const {limit, populate, query, min} = options
// Get the count of all users
Collection.countDocuments(query).exec(function (err, count) {
    if(count <= (limit || 10)) return Collection.find(query)
    .populate(populate)
    .limit(limit || 10)
    .exec(
      function (err, result) {
        done(result) 
      })

    // Get a random entry
    const random = Math.floor(Math.random() * count)
    Collection.find(query)
    .populate(populate)
    .skip(random)
    .limit(limit || 10)
    .exec(
      function (err, result) {
        done(result) 
      })
  })
}