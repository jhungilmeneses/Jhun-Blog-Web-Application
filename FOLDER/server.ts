import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("blog.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    author TEXT DEFAULT 'Alex Rivera',
    date TEXT,
    readTime TEXT,
    category TEXT,
    status TEXT DEFAULT 'Draft',
    views INTEGER DEFAULT 0,
    imageUrl TEXT
  )
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO posts (title, content, excerpt, author, date, readTime, category, status, views, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insert.run(
    "The Future of Minimalist Design in Digital Products",
    "Minimalism is not a lack of something. It's simply the perfect amount of something...",
    "Explore how intentionality and progressive disclosure are shaping the next generation of user interfaces.",
    "Alex Rivera",
    "Oct 24, 2023",
    "8 min read",
    "Design Strategy",
    "Published",
    12402,
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCDe2llBNbUIEMhLv2QniZEsQlfB1QzKTyBdfHqoQP5R5zuBG1a-1hrXK3t6AiHR7iPqHte7HwvHIkCebM9LEI7U-eqrCnuD2DPtz6bf_Bz1yW63T9-1Z3EiXt0VWyG8kswTWqfGz2LN5QeLkBVN1ax0g6Y-x56XNvTXodIJOf6-Rzq3nTvxPBhcV4w6fYIrkPZd1dQut2aW-qXffOWJFCDVtgBRXzoAYcp9M6p8ItsvoOy0dyGZ5M7ajMJtha63a1JNZdL8-lX2o"
  );
  
  insert.run(
    "The Return of Skeuomorphism? Why We Miss Physicality",
    "Examining why modern users are gravitating back towards textures and shadows...",
    "Examining why modern users are gravitating back towards textures and shadows in a flat-design world.",
    "Alex Rivera",
    "Oct 12, 2023",
    "5 min read",
    "Strategy",
    "Published",
    8931,
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1TfgtoS2ahaSjI_UPb3cWmOwDgCzuGYHasxTBvc9hXTUuLMQxxwUds2WMZeF98mllp10RFGQWU-MA6H1D-FZQvAn84uREAQJ7GNVNQqMc3qgprkhdncl3Lxd--GcIEJwzA3PsB5k-ohESPX_XNVjBr6IYLEUnSkv5CtTR46hJeelwm_c4XCMahLbiuvm-_iiFMHo5TkqjAnSvWgbDpOgKFDx0BU4W_gZ1-fevxWIAmkTUwzHJksy_PXfHfOUsIODzU7dQmpRW2sw"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY id DESC").all();
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  app.post("/api/posts", (req, res) => {
    const { title, content, excerpt, category, status, imageUrl } = req.body;
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const readTime = "5 min read";
    const info = db.prepare(`
      INSERT INTO posts (title, content, excerpt, date, readTime, category, status, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, content, excerpt, date, readTime, category, status || 'Draft', imageUrl);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/posts/:id", (req, res) => {
    const { title, content, excerpt, category, status, imageUrl } = req.body;
    db.prepare(`
      UPDATE posts 
      SET title = ?, content = ?, excerpt = ?, category = ?, status = ?, imageUrl = ?
      WHERE id = ?
    `).run(title, content, excerpt, category, status, imageUrl, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/posts/:id", (req, res) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
