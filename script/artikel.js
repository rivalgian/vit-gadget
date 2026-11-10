
document.addEventListener("DOMContentLoaded", () => {
    loadAutoSEOArticles();
});

async function loadAutoSEOArticles() {
    const container = document.getElementById("autoseo-articles");

    if (!container) return;

    try {
        const response = await fetch("/api/articles?limit=50");

        if (!response.ok) {
            throw new Error("Gagal mengambil artikel");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Format data artikel tidak valid");
        }

        container.innerHTML = "";

        if (result.data.length === 0) {
            container.innerHTML = `
                <p class="text-muted">
                    Belum ada artikel terbaru.
                </p>
            `;
            return;
        }

        result.data.forEach(article => {
            const card = document.createElement("div");
            card.className = "card artikel-card normal-card autoseo-card";

            // Gambar artikel
            if (article.featured_image) {
                try {
                    const imageUrl = new URL(article.featured_image);

                    if (["https:", "http:"].includes(imageUrl.protocol)) {
                        const image = document.createElement("img");
                        image.src = imageUrl.href;
                        image.alt = article.title;
                        image.className = "card-img";
                        image.loading = "lazy";

                        card.appendChild(image);
                    }
                } catch {
                    console.warn("URL gambar artikel tidak valid");
                }
            }

            const overlay = document.createElement("div");
            overlay.className = "card-img-overlay artikel-overlay";

            const category = document.createElement("span");
            category.className = "artikel-tag";
            category.textContent = article.category || "ARTIKEL VIT GADGET";

            const title = document.createElement("h2");
            title.className = "card-title";
            title.textContent = article.title;

            const excerpt = document.createElement("p");
            excerpt.className = "card-text";

            const description = article.excerpt ||
                "Baca artikel terbaru dari Vit Gadget.";

            excerpt.textContent = description;

            const link = document.createElement("a");
            link.href = `blog-dinamis.html?slug=${encodeURIComponent(article.slug)}`;
            link.className = "btn-baca";
            link.textContent = "Baca Selengkapnya";

            overlay.append(category, title, excerpt, link);
            card.appendChild(overlay);

            container.appendChild(card);
        });

    } catch (error) {
        console.error("AutoSEO Articles:", error);

        container.innerHTML = `
            <p class="text-danger">
                Artikel terbaru belum dapat dimuat.
            </p>
        `;
    }
}
