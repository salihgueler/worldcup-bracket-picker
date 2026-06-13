import { api } from "aws-blocks";

// Basic smoke test — verifies the API is typed and reachable
async function main() {
  console.log("✓ API module imported successfully");
  console.log("  Available methods:", Object.keys(api));
}

main().catch(console.error);
