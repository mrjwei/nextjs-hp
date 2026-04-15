import fs from "fs/promises";
import path from "path";

const CWD = process.cwd();
const CONTENT_INDEX_PATH = path.join(CWD, "app", "data", "content-index.json");
const OUTPUT_PATH = path.join(CWD, "public", "search-index.json");

async function generateSearchIndex() {
  console.log("Reading content index...");

  if (!(await fs.stat(CONTENT_INDEX_PATH).catch(() => false))) {
    console.error("No content-index.json found. Run the index generation script first.");
    process.exit(1);
  }

  const contentIndexStr = await fs.readFile(CONTENT_INDEX_PATH, "utf-8");
  const contentIndex = JSON.parse(contentIndexStr);

  const allPosts = [
    ...(contentIndex.writings || []).map(p => ({ ...p, type: 'writing' })),
    ...(contentIndex.portfolio || []).map(p => ({ ...p, type: 'portfolio' }))
  ];

  console.log(`Found ${allPosts.length} total posts.`);

  const searchDocuments = [];
  let count = 0;

  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/;

  for (const post of allPosts) {
    count++;

    // Read actual file content to get the body
    const filePath = path.join(CWD, post.filePath);
    let fileContent = "";
    try {
      fileContent = await fs.readFile(filePath, "utf-8");
    } catch (e) {
      console.warn(`Could not read file: ${filePath}`);
      continue;
    }

    // Strip frontmatter roughly
    let mainContent = fileContent.replace(frontmatterRegex, "").trim();

    // Clean up basic markdown and keep the string smaller (first 10,000 characters)
    mainContent = mainContent.replace(/[#*`>-_[\]()]/g, " ").replace(/\s+/g, " ").slice(0, 10000);

    const title = post.metadata?.title || post.slug;
    const summary = post.metadata?.summary || "";

    searchDocuments.push({
      id: post.slug, // MiniSearch needs a unique ID
      slug: post.slug,
      collection: post.collection,
      title: title,
      summary: summary,
      type: post.type,
      content: mainContent
    });
  }

  console.log(`Generated ${searchDocuments.length} search documents.`);
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(searchDocuments));
  console.log(`Saved optimized search index to ${OUTPUT_PATH} (served statically in /public)`);
}

generateSearchIndex().catch(console.error);
