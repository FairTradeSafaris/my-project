import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "jw971r14", // ← Replace this
  dataset: "production", // or your dataset name
  apiVersion: "2023-01-01",
  token:
    "skQaJiwZRt72irJOimBJqt1Bdq61nPzLMi5kD27BhFhLv2ut01kucbEBiA8Yc5VEItAl33Aoy0iyZuzEaYQSwpFDftbnhx4taf0qVXJJpCBm0VLp4mbF2OzDcOlHzXQPBzaLQLF3bQfr63fKiaBcZl7Lgm1VDC7CvyE6PKGnjcEZghDwA1xI", // ← Replace this with a secure token
  useCdn: false,
});

const generalTagId = "d8407030-532c-4b86-876e-4e5828b6542b"; // ← your "General" tag ID

async function assignGeneralTagToBrokenPosts() {
  const posts = await client.fetch(`
    *[_type == "blog" && (
      !defined(tags) || count(tags) == 0 || count(tags[!(_type == "reference")]) > 0
    )] {_id, title}
  `);

  console.log(`Found ${posts.length} posts to update.\n`);

  for (const post of posts) {
    await client
      .patch(post._id)
      .set({
        tags: [{ _type: "reference", _ref: generalTagId }],
      })
      .commit();

    console.log(`✅ Fixed: ${post.title}`);
  }

  console.log('\n🎉 All posts updated with the "General" tag.');
}

assignGeneralTagToBrokenPosts().catch((err) => {
  console.error("❌ Migration failed:", err.message);
});
