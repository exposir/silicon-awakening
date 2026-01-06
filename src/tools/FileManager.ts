import * as fs from "fs";
import * as path from "path";

export class FileManager {
  private rootDir: string;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
  }

  /**
   * Reads a file safely.
   * Enforces Token Economy by warning on large files (TODO).
   */
  public async readFile(relativePath: string): Promise<string> {
    const fullPath = path.resolve(this.rootDir, relativePath);
    if (!fullPath.startsWith(this.rootDir)) {
      throw new Error(`访问拒绝: 无法读取根目录以外的文件: ${relativePath}`);
    }
    return fs.promises.readFile(fullPath, "utf-8");
  }

  /**
   * Writes a file safely.
   * Prevents overwriting critical system files unless explicitly allowed.
   */
  public async writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.resolve(this.rootDir, relativePath);
    if (!fullPath.startsWith(this.rootDir)) {
      throw new Error(`访问拒绝: 无法写入根目录以外的文件: ${relativePath}`);
    }

    // Safety check: Don't kill git
    if (relativePath.includes(".git/")) {
      throw new Error("即死协议触发 (Self-Preservation): 禁止直接修改 .git 目录。");
    }

    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, content, "utf-8");
    console.log(`[FileManager] 已写入: ${relativePath}`);
  }

  /**
   * Lists files recursively.
   */
  public async listFiles(dir: string = "."): Promise<string[]> {
    const fullPath = path.resolve(this.rootDir, dir);
    const entries = await fs.promises.readdir(fullPath, {
      withFileTypes: true,
    });

    const files: string[] = [];
    for (const entry of entries) {
      const relPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue; // Ignore noise
        files.push(...(await this.listFiles(relPath)));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }
}
