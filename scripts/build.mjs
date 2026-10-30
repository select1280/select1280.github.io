import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export async function build() {
  const dist = path.join(root, "dist");
  if (dist !== path.join(root, "dist")) throw Error("Invalid build directory");
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });
  await fs.cp(path.join(root, "src"), path.join(dist, "src"), {
    recursive: true,
    filter: async (source) =>
      (await fs.stat(source)).isDirectory() || source.endsWith(".js"),
  });
  await fs.cp(path.join(root, "public"), dist, { recursive: true });
  await fs.mkdir(path.join(dist, "assets"), { recursive: true });
  const baseStyles = await fs.readFile(path.join(root,'src/styles/site.css'),'utf8');
  const refinement = await fs.readFile(path.join(root,'src/styles/refinement.css'),'utf8');
  await fs.writeFile(path.join(dist,'assets/site.css'),baseStyles+'\n'+refinement);
  const nav = await fs.readFile(path.join(root, "src/shared/nav.html"), "utf8"),
    footer = await fs.readFile(
      path.join(root, "src/shared/footer.html"),
      "utf8",
    );
  for (const name of ["index", "games", "tools", "journal", "about"]) {
    let html = await fs.readFile(
      path.join(root, "src/pages", name + ".html"),
      "utf8",
    );
    html = html
      .replace(
        "<!-- NAV -->",
        nav.replace(
          `data-page="${name}"`,
          `data-page="${name}" aria-current="page"`,
        ),
      )
      .replace("<!-- FOOTER -->", footer);
    await fs.writeFile(path.join(dist, name + ".html"), html);
  }
  console.log("已建置五個分頁至 dist/");
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();
