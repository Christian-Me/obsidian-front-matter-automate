# How to Share Code Across Obsidian Plugins

To share and reuse code like your logger or UI components across multiple Obsidian plugins (or other projects), the best practice is to organize them into a separate GitHub repository as a library/package. Here’s how you can do it:

1. **Create a Shared Library Repository**  
   Make a new repo, e.g., `obsidian-shared-utils` or `obsidian-common`.  
   Organize your code into folders like `/logger`, `/ui`, etc.  
   Add a `package.json` if you want to publish as an npm package (recommended for easy versioning and installation).

   **Example structure:**
   ```
   obsidian-shared-utils/
   ├── src/
   │   ├── logger.ts
   │   ├── ui/
   │   │   ├── MultiPropertySetting.ts
   │   │   └── ...
   │   └── ...
   ├── package.json
   └── README.md
   ```

2. **Use TypeScript and Export Modules**  
   Use `export` for your classes/functions so they can be imported elsewhere.  
   Keep dependencies minimal and compatible with Obsidian’s environment.

3. **Publish or Link Your Library**  
   - **Option A: Publish to npm**  
     Run `npm publish` (after `npm login`).  
     In your plugin projects, install with:  
     ```
     npm install your-github-username/obsidian-shared-utils
     ```
     or, if published to npm:
     ```
     npm install obsidian-shared-utils
     ```
   - **Option B: Use GitHub as a dependency**  
     In your plugin’s `package.json`:
     ```json
     "dependencies": {
       "obsidian-shared-utils": "github:your-github-username/obsidian-shared-utils"
     }
     ```
   - **Option C: Use local linking for development**  
     Use `npm link` or `yarn link` to symlink your shared library locally.

4. **Import in Your Plugins**  
   ```typescript
   import { Logger } from "obsidian-shared-utils/dist/logger";
   import { MultiPropertySetting } from "obsidian-shared-utils/dist/ui/MultiPropertySetting";
   ```

5. **Version and Update**  
   Bump the version in your shared library when you make changes.  
   Update the dependency in your plugins as needed.

**Tip:**  
If you want to keep the code private, use a private GitHub repo and GitHub Packages or npm private packages.

---

**Summary:**

- Move shared code to a new repo.
- Export as modules.
- Publish or link as a dependency.
- Import and use in your plugins.