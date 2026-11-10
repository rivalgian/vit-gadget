
const { neon } = require("@neondatabase/serverless");

module.exports = async function handler(req, res) {
  // Hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // Validasi konfigurasi
  if (!process.env.DATABASE_URL ||
      !process.env.AUTOSEO_API_KEY) {
    return res.status(500).json({
      success: false,
      error: "Server configuration missing"
    });
  }

  // Validasi API Key
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.AUTOSEO_API_KEY) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  try {
    const payload = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    // Tes koneksi AutoSEO
    if (
      payload.event === "ping" ||
      payload.event === "connect_test"
    ) {
      return res.status(200).json({
        success: true,
        message: "Pong! Vit Gadget siap menerima artikel."
      });
    }

    // Validasi event
    if (payload.event !== "article.published") {
      return res.status(400).json({
        success: false,
        error: "Unsupported event"
      });
    }

    const article = payload.article;

    if (
      !article ||
      article.id == null ||
      !article.title ||
      !article.slug ||
      !article.content
    ) {
      return res.status(400).json({
        success: false,
        error: "Data artikel tidak lengkap"
      });
    }

    // Koneksi Neon
    const sql = neon(process.env.DATABASE_URL);

    // Simpan atau perbarui artikel berdasarkan slug
    await sql`
      INSERT INTO articles (
        external_id,
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
      )
      VALUES (
        ${String(article.id)},
        ${article.title},
        ${article.slug},
        ${article.content},
        ${article.excerpt || null},
        ${article.featured_image || null},
        ${article.category || null},
        ${JSON.stringify(article.tags || [])}::jsonb,
        ${article.author || null},
        ${JSON.stringify(article.seo || {})}::jsonb,
        ${article.published_at || null}
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        external_id = EXCLUDED.external_id,
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        excerpt = EXCLUDED.excerpt,
        featured_image = EXCLUDED.featured_image,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        author = EXCLUDED.author,
        seo = EXCLUDED.seo,
        published_at = EXCLUDED.published_at,
        updated_at = NOW()
    `;

    const siteUrl = (
      process.env.SITE_URL || ""
    ).replace(/\/+$/, "");

    return res.status(200).json({
      success: true,
      message: "Artikel berhasil disimpan ke Vit Gadget",
      url: `${siteUrl}/blog-dinamis.html?slug=${encodeURIComponent(article.slug)}`
    });

  } catch (error) {
    console.error("AutoSEO webhook error:", error);

    return res.status(500).json({
      success: false,
      error: "Gagal menyimpan artikel"
    });
  }
};
