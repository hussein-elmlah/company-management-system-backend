import CustomError from '../lib/customError.js';

export const handleQueryParams = async (model, queryParams, searchField) => {
    const { page = 1, limit = 10, order, search, ...filters } = queryParams;
  
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const maxLimit = 30;
  
    if (parsedPage < 1 || parsedLimit < 1 || parsedLimit > maxLimit) {
      throw new CustomError('Invalid pagination parameters', 400);
    }
  
    let filterConditions = {};
  
    if (search && searchField) {
      const searchRegex = new RegExp(search, 'i');
      filterConditions[searchField] = { $regex: searchRegex };
    }
    if (search && !searchField) {
        throw new CustomError('Invalid search parameters', 400);
    }
  
    Object.keys(filters).forEach(param => {
      filterConditions[param] = filters[param];
    });
  
    const startIndex = (parsedPage - 1) * parsedLimit;
  
    let query = model.find(filterConditions);
  
    if (order) {
      const sortOrder = order.startsWith('-') ? -1 : 1;
      const field = order.replace(/^-/, '');
  
      if (Object.keys(model.schema.paths).includes(field)) {
        const sortObject = {};
        sortObject[field] = sortOrder;
        query = query.sort(sortObject);
      } else {
        throw new CustomError('Invalid order field', 400);
      }
    }
  
    const dataQuery = query.skip(startIndex).limit(parsedLimit);
    const data = await dataQuery;
  
    const totalCount = await model.countDocuments(filterConditions);
    const totalPages = Math.ceil(totalCount / parsedLimit);
  
    return {
      data,
      currentPage: parsedPage,
      totalPages,
      totalCount,
    };
  };
  