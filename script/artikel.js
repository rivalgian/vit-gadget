
document.addEventListener("DOMContentLoaded", () => {
    loadManualArticles();
    loadAutoSEOArticles();
});

// Mengubah alamat gambar menjadi URL yang valid.
// Mendukung gambar lokal dan URL HTTPS.
function getSafeImageUrl(path) {
    if (!path) return "";

    try {
        const url = new URL(path, window.location.origin);

        if (["https:", "http:"].includes(url.protocol)) {
            return url.href;
        }
    } catch (error) {
        console.warn("Alamat gambar tidak valid:", path);
    }

    return "";
}

// Membuat kartu artikel
function createArticleCard(article, source = "manual") {
    const card = document.createElement("div");
    card.className = "card artikel-card normal-card autoseo-card";

    const imageUrl = getSafeImageUrl(article.featured_image);

    if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = article.title || "Artikel VIT Gadget";
        image.className = "card-img";
        image.loading = "lazy";
        card.appendChild(image);
    }

    const overlay = document.createElement("div");
    overlay.className = "card-img-overlay artikel-overlay";

    const category = document.createElement("span");
    category.className = "artikel-tag";
    category.textContent = article.category || "ARTIKEL VIT GADGET";

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = article.title || "Artikel VIT Gadget";

    const excerpt = document.createElement("p");
    excerpt.className = "card-text";
    excerpt.textContent =
        article.excerpt || "Baca artikel terbaru dari VIT Gadget.";

    const link = document.createElement("a");

    if (source === "manual") {
        link.href =
            "blog-dinamis.html?source=manual&slug=" +
            encodeURIComponent(article.slug);
    } else {
        link.href =
            "blog-dinamis.html?slug=" +
            encodeURIComponent(article.slug);
    }

    link.className = "btn-baca";
    link.textContent = "Baca Selengkapnya";

    overlay.append(category, title, excerpt, link);
    card.appendChild(overlay);

    return card;
}

// Memuat artikel manual dari file JSON
async function loadManualArticles() {
    const container = document.getElementById("manual-articles");

    if (!container) return;

    try {
        const response = await fetch("/data/artikel-manual.json");

        if (!response.ok) {
            throw new Error("File artikel manual tidak ditemukan");
        }

        const articles = await response.json();

        if (!Array.isArray(articles)) {
            throw new Error("Format JSON artikel tidak valid");
        }

        container.innerHTML = "";

        articles.forEach(article => {
            if (!article.slug || !article.title) return;

            const card = createArticleCard(article, "manual");
            container.appendChild(card);
        });

        if (container.children.length === 0) {
            container.innerHTML =
                '<p class="text-muted">Belum ada artikel manual.</p>';
        }

    } catch (error) {
        console.error("Artikel manual:", error);
        container.innerHTML =
            '<p class="text-muted">Artikel manual belum dapat dimuat.</p>';
    }
}

// Memuat artikel dari AutoSEO
async function loadAutoSEOArticles() {
    const container = document.getElementById("autoseo-articles");

    if (!container) return;

    try {
        const response = await fetch("/api/articles?limit=50");

        if (!response.ok) {
            throw new Error("Gagal mengambil artikel AutoSEO");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Format data AutoSEO tidak valid");
        }

        container.innerHTML = "";

        result.data.forEach(article => {
            if (!article.slug || !article.title) return;

            const card = createArticleCard(article, "autoseo");
            container.appendChild(card);
        });

        if (container.children.length === 0) {
            container.innerHTML =
                '<p class="text-muted">Belum ada artikel AutoSEO.</p>';
        }

    } catch (error) {
        console.error("AutoSEO Articles:", error);
        container.innerHTML =
            '<p class="text-muted">Artikel AutoSEO belum dapat dimuat.</p>';
    }
}
