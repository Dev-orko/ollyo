/**
 * Build Prisma pagination params from query string.
 * @param {object} query - req.query
 * @returns {{ skip: number, take: number, page: number, limit: number }}
 */
const paginate = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};

/**
 * Build a standard paginated response.
 */
const paginatedResponse = (data, total, page, limit) => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});

module.exports = { paginate, paginatedResponse };
