// 静态文件服务器 for Deno Deploy

// 1. 为 files 添加索引签名
const files: Record<string, string> = {
  "/": "index.html",
  "/index.html": "index.html",
  "/h5/static/index.63b34199.css": "h5/static/index.63b34199.css",
  "/h5/static/js/chunk-vendors.1debdf41.js": "h5/static/js/chunk-vendors.1debdf41.js",
  "/h5/static/js/index.92e71c7f.js": "h5/static/js/index.92e71c7f.js",
};

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = files[url.pathname] || url.pathname.slice(1);

  try {
    const file = await Deno.readFile(path);
    const ext = path.split(".").pop();
    // 2. 为 contentType 添加索引签名
    const contentTypeMap: Record<string, string> = {
      html: "text/html",
      js: "application/javascript",
      css: "text/css",
    };
    const contentType = contentTypeMap[ext || ""] || "application/octet-stream";
    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
});