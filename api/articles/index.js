
const { neon } = require("@neondatabase/serverless");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      success: false,
      error: "Database configuration missing"
    });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const page = Math.max(
      1,
      parseInt(req.query.page || "1", 10)
    );

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit || "12", 10))
    );

    const offset = (page - 1) * limit;

    const articles = await sql`
      SELECT
        id,
        title,
        slug,
        excerpt,
        featured_image,
        category,
        tags,
        author,
        seo,
        published_at
      FROM articles
      WHERE published_at IS NOT NULL
        AND published_at <= NOW()
      ORDER BY published_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int AS total
      FROM articles
      WHERE published_at IS NOT NULL
        AND published_at <= NOW()
    `;

    const total = countResult[0].total;

    return res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Article API error:", error);

    return res.status(500).json({
      success: false,
      error: "Gagal mengambil artikel"
    });
  }
};
