
const { neon } = require("@neondatabase/serverless");

module.exports = async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    const slug = String(req.query.slug || "").trim();

    if (!slug) {
        return res.status(400).json({
            success: false,
            error: "Slug artikel wajib diisi"
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

        const result = await sql`
            SELECT
                id,
                title,
                slug,
                content,
                excerpt,
                featured_image,
                category,
                tags,
                author,
                seo,
                published_at
            FROM articles
            WHERE slug = ${slug}
              AND published_at IS NOT NULL
              AND published_at <= NOW()
            LIMIT 1
        `;

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Artikel tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        console.error("Article detail error:", error);

        return res.status(500).json({
            success: false,
            error: "Gagal mengambil detail artikel"
        });
    }
};
