import type { StructureResolver } from "sanity/structure";

// Language configuration matching your portfolio
const SUPPORTED_LANGUAGES = ["en", "zh", "ms", "ta", "ar"] as const;
const LANGUAGE_NAMES = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
  ta: "தமிழ்",
  ar: "العربية",
};

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Blog Content")
    .items([
      // Posts organized by language
      S.listItem()
        .id("posts-by-language")
        .title("📝 Posts by Language")
        .child(
          S.list()
            .title("Posts by Language")
            .items([
              ...SUPPORTED_LANGUAGES.map((lang) =>
                S.listItem()
                  .id(`posts-${lang}`)
                  .title(`${LANGUAGE_NAMES[lang]} Posts`)
                  .child(
                    S.documentList()
                      .title(`${LANGUAGE_NAMES[lang]} Posts`)
                      .filter('_type == "post" && language == $lang')
                      .params({ lang })
                      .defaultOrdering([
                        { field: "publishedAt", direction: "desc" },
                      ])
                  )
              ),
              S.divider(),
              S.listItem()
                .id("all-posts")
                .title("📊 All Posts")
                .child(
                  S.documentList()
                    .title("All Posts")
                    .filter('_type == "post"')
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ])
                ),
            ])
        ),

      // Categories organized by language
      S.listItem()
        .id("categories-by-language")
        .title("🏷️ Categories by Language")
        .child(
          S.list()
            .title("Categories by Language")
            .items([
              ...SUPPORTED_LANGUAGES.map((lang) =>
                S.listItem()
                  .id(`categories-${lang}`)
                  .title(`${LANGUAGE_NAMES[lang]} Categories`)
                  .child(
                    S.documentList()
                      .title(`${LANGUAGE_NAMES[lang]} Categories`)
                      .filter('_type == "category" && language == $lang')
                      .params({ lang })
                      .defaultOrdering([{ field: "baseKey", direction: "asc" }])
                  )
              ),
              S.divider(),
              S.listItem()
                .id("all-categories")
                .title("📊 All Categories")
                .child(
                  S.documentList()
                    .title("All Categories")
                    .filter('_type == "category"')
                    .defaultOrdering([{ field: "baseKey", direction: "asc" }])
                ),
            ])
        ),

      // Content status views
      S.listItem()
        .id("content-by-status")
        .title("📋 Content by Status")
        .child(
          S.list()
            .title("Content by Status")
            .items([
              S.listItem()
                .id("draft-posts")
                .title("📝 Draft Posts")
                .child(
                  S.documentList()
                    .title("Draft Posts")
                    .filter('_type == "post" && status == "draft"')
                    .defaultOrdering([
                      { field: "_updatedAt", direction: "desc" },
                    ])
                ),
              S.listItem()
                .id("published-posts")
                .title("✅ Published Posts")
                .child(
                  S.documentList()
                    .title("Published Posts")
                    .filter('_type == "post" && status == "published"')
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ])
                ),
              S.listItem()
                .id("archived-posts")
                .title("📦 Archived Posts")
                .child(
                  S.documentList()
                    .title("Archived Posts")
                    .filter('_type == "post" && status == "archived"')
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ])
                ),
            ])
        ),

      S.divider(),

      // Authors
      S.listItem()
        .id("authors")
        .title("👥 Authors")
        .child(
          S.documentList()
            .title("Authors")
            .filter('_type == "author"')
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),

      S.divider(),

      // Quick actions
      S.listItem()
        .id("quick-actions")
        .title("⚡ Quick Actions")
        .child(
          S.list()
            .title("Quick Actions")
            .items([
              S.listItem()
                .id("create-new-post")
                .title("➕ Create New Post")
                .child(
                  S.list()
                    .title("Select Language")
                    .items(
                      SUPPORTED_LANGUAGES.map((lang) =>
                        S.listItem()
                          .id(`create-post-${lang}`)
                          .title(`New ${LANGUAGE_NAMES[lang]} Post`)
                          .child(
                            S.editor()
                              .schemaType("post")
                              .documentId(`post-${lang}-${Date.now()}`)
                              .initialValueTemplate("post-by-language", {
                                language: lang,
                              })
                          )
                      )
                    )
                ),
              S.listItem()
                .id("create-new-category")
                .title("➕ Create New Category")
                .child(
                  S.list()
                    .title("Select Language")
                    .items(
                      SUPPORTED_LANGUAGES.map((lang) =>
                        S.listItem()
                          .id(`create-category-${lang}`)
                          .title(`New ${LANGUAGE_NAMES[lang]} Category`)
                          .child(
                            S.editor()
                              .schemaType("category")
                              .documentId(`category-${lang}-${Date.now()}`)
                              .initialValueTemplate("category-by-language", {
                                language: lang,
                              })
                          )
                      )
                    )
                ),
            ])
        ),

      S.divider(),

      // Other document types
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["post", "category", "author"].includes(item.getId()!)
      ),
    ]);
