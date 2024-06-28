const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to Exclude
  const removeFields = ['select', 'sort'];

  //Loop over removedFields and delete them from reqQuery
  removeFields.forEach(val => {
    delete reqQuery[val];
  });

  //Create query string
  let queryString = JSON.stringify(reqQuery);
  //Create mongo operators
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  console.log(queryString);

  queryString = JSON.parse(queryString);
  //Finding the resource
  query = model.find(queryString);
  //SELECT fields needed.
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort 
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); //dECENDING CREATED AT
  }


  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate)
  }

  const results = await query;


  //Pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  };
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data:results
  };
  next();
}


module.exports = advancedResults