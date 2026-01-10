export const getPagination = (page = 1, limit = 10) => {
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

