class APIFeatures {
  constructor( query, querySting ) {
    this.query = query
    this.querySting = querySting
  }

  filter() {

  }

  sort() {
    if ( this.querySting.sort) {
      const sortBy = this.querySting.sort.split(',').join(' ')
    }
  }
}

module.exports = APIFeatures

/*
this.query.find(JSON.parse(queryStr))
  .sort('-createdAt')
  .select('-__v')
  .skip(skip).limit(limit)

*/