import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Bell, 
  ArrowRight, 
  Clock, 
  ThumbsUp, 
  Share2, 
  ChevronRight, 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  BarChart2, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Quote, 
  Code,
  Rocket,
  History,
  Calendar,
  X,
  Check
} from 'lucide-react';
import { Post, Comment } from './types';
import { database } from './firebase';
import { ref, get, set, push, update, remove, child } from 'firebase/database';

// --- Components ---

const Header = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => onNavigate('home')}>
          <BookOpen className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">BlogHub</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate('home')} className="text-sm font-medium hover:text-primary transition-colors">Home</button>
          <button className="text-sm font-medium hover:text-primary transition-colors">Explore</button>
          <button className="text-sm font-medium hover:text-primary transition-colors">Newsletter</button>
          <button onClick={() => onNavigate('admin')} className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Admin</button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            className="h-9 w-64 rounded-lg border-none bg-slate-100 pl-10 text-sm focus:ring-2 focus:ring-primary" 
            placeholder="Search articles..." 
            type="text"
          />
        </div>
        <button className="h-9 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 transition-all">Subscribe</button>
        <div 
          className="h-9 w-9 rounded-full bg-slate-200 bg-cover bg-center cursor-pointer" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9TPh33Ro7KsK4GfEy1XctbVSL4TJJE660OjhcuxorNKwEzkV_nDQrEYNqQpRtN0T_78GMp-VAjb1rCOQsJiZ--lwPxlMCy8_5Z-Dc90CXpNqZh80G5QwcbikHWIfTI9g1WxKVG5JBlh5oIwT0IejZMKjddoD5W7utyDnqOuij4KtGg_qY2e-yvb2Q0TJI7vb87cWbUN_3xXs2V5ukgPNgLREzasF6xM_YDdtPQxMBMeFx-1t9zUOFBny3Sqjz_Jb3d-j7SMm4sp4')" }}
        />
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="mt-20 border-t border-slate-200 bg-white py-12">
    <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2 text-primary">
        <BookOpen className="w-6 h-6" />
        <span className="font-bold">BlogHub</span>
      </div>
      <div className="flex gap-8 text-sm text-slate-500">
        <a className="hover:text-primary" href="#">Privacy Policy</a>
        <a className="hover:text-primary" href="#">Terms of Service</a>
        <a className="hover:text-primary" href="#">About</a>
        <a className="hover:text-primary" href="#">Contact</a>
      </div>
      <div className="flex gap-4">
        <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-primary transition-colors" />
        <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-primary transition-colors" />
      </div>
    </div>
    <div className="mt-8 text-center text-xs text-slate-400">
      © 2023 BlogHub Media Group. All rights reserved.
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ posts, onNavigate }: { posts: Post[], onNavigate: (page: string, id?: string) => void }) => {
  const featuredPost = posts.find(p => p.status === 'Published') || posts[0];
  const recentPosts = posts.filter(p => p.id !== featuredPost?.id && p.status === 'Published');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto w-full max-w-7xl px-6 py-8"
    >
      {/* Featured Story */}
      {featuredPost && (
        <section className="mb-16">
          <div className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-2xl transition-all duration-500 hover:shadow-primary/10">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto">
                <img 
                  alt={featuredPost.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={featuredPost.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent lg:hidden"></div>
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16 text-white">
                <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Featured Story</span>
                <h2 className="mb-6 text-3xl font-black leading-tight md:text-5xl lg:text-4xl xl:text-5xl font-display">
                  {featuredPost.title}
                </h2>
                <p className="mb-8 text-lg text-slate-300 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-full bg-cover bg-center border border-white/20" 
                      style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYThc1nxb5QXE7VQ1VNbkqfUJJx8wFp09GFA0Z-HmRGe2NgDvdhCWSHQwAjKKSafVbEVTlpr-iH3vK9jAmB_nUQUIj9QG0CMf0ohctDww1t8IVpr7klPywN3OZCgUHl6QhWPuDwjdAcbx3lXB86iR3XViqd-OT4YvF2wjHvxE6o4Us5vzx4LGIta4-LDBVAQL8yVoG9I_V2Ybm1jzibG6LvwpxbKwWfpuqUGcW0QmDK9a4PL5_J23rQe78B6Re51Bfsc8DTkfFCS0')` }}
                    />
                    <div className="text-sm">
                      <p className="font-bold">{featuredPost.author}</p>
                      <p className="text-slate-400">{featuredPost.date} · {featuredPost.readTime}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('reader', featuredPost.id)}
                    className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100"
                  >
                    Read Post <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold tracking-tight">Recent Stories</h3>
            <div className="flex gap-4 text-sm font-medium text-slate-500">
              <button className="text-primary border-b-2 border-primary pb-4">Latest</button>
              <button className="hover:text-primary transition-colors">Trending</button>
              <button className="hover:text-primary transition-colors">Popular</button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {recentPosts.map(post => (
              <article key={post.id} className="group flex flex-col gap-4 cursor-pointer" onClick={() => onNavigate('reader', post.id)}>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                  <img 
                    alt={post.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={post.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">{post.category}</span>
                  <h4 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors font-display">
                    {post.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <button className="rounded-lg border border-slate-200 px-8 py-3 text-sm font-bold hover:bg-slate-50 transition-colors">
              Load More Articles
            </button>
          </div>
        </section>

        <aside className="flex flex-col gap-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['Design', 'Technology', 'Business', 'Lifestyle', 'AI & Robotics', 'Work'].map(cat => (
                <button key={cat} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-primary p-6 text-white shadow-xl shadow-primary/20">
            <h4 className="mb-2 text-xl font-bold">The Sunday Digest</h4>
            <p className="mb-6 text-sm opacity-90 leading-relaxed">Join 12,000+ readers getting our best design and tech stories every week.</p>
            <div className="flex flex-col gap-3">
              <input className="w-full rounded-lg border-none bg-white/20 p-3 text-sm text-white placeholder:text-white/60 focus:ring-2 focus:ring-white" placeholder="Email address" type="email" />
              <button className="w-full rounded-lg bg-white py-3 text-sm font-bold text-primary hover:bg-slate-100 transition-colors">Subscribe Now</button>
            </div>
            <p className="mt-4 text-center text-[10px] opacity-60">No spam. Unsubscribe anytime.</p>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Trending Now</h4>
            <div className="flex flex-col gap-4">
              {[
                { id: '01', title: 'Building the next generation of VR workspaces', time: '3 min read' },
                { id: '02', title: 'Why minimalism is still winning in 2024', time: '6 min read' },
                { id: '03', title: 'The ethics of generative art platforms', time: '9 min read' }
              ].map(item => (
                <a key={item.id} className="group flex gap-4" href="#">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-primary/20">{item.id}</span>
                  <div>
                    <h5 className="font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h5>
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

const ReaderPage = ({ post, onNavigate }: { post: Post, onNavigate: (page: string) => void }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `comments/${post.id}`));
        if (snapshot.exists()) {
          const commentsData = snapshot.val();
          const commentsArray = Object.keys(commentsData).map(key => ({
            ...commentsData[key],
            id: key
          })) as Comment[];
          setComments(commentsArray);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
    
    fetchComments();
  }, [post.id]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    try {
      const commentsRef = ref(database, `comments/${post.id}`);
      const newCommentRef = push(commentsRef);
      
      const commentObj = {
        text: newComment,
        author: "Guest User",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      await set(newCommentRef, commentObj);
      setNewComment('');
      
      // Refresh comments
      const snapshot = await get(commentsRef);
      if (snapshot.exists()) {
        const commentsData = snapshot.val();
        const commentsArray = Object.keys(commentsData).map(key => ({
          ...commentsData[key],
          id: key
        })) as Comment[];
        setComments(commentsArray);
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="mx-auto w-full max-w-7xl px-6 py-8"
  >
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
      <article className="flex flex-col">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-primary">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary cursor-pointer">Articles</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{post.category}</span>
        </nav>

        <header className="mb-8">
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl text-slate-900 font-display">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <div 
                className="h-10 w-10 rounded-full bg-cover bg-center" 
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYThc1nxb5QXE7VQ1VNbkqfUJJx8wFp09GFA0Z-HmRGe2NgDvdhCWSHQwAjKKSafVbEVTlpr-iH3vK9jAmB_nUQUIj9QG0CMf0ohctDww1t8IVpr7klPywN3OZCgUHl6QhWPuDwjdAcbx3lXB86iR3XViqd-OT4YvF2wjHvxE6o4Us5vzx4LGIta4-LDBVAQL8yVoG9I_V2Ybm1jzibG6LvwpxbKwWfpuqUGcW0QmDK9a4PL5_J23rQe78B6Re51Bfsc8DTkfFCS0')` }}
              />
              <span className="font-medium text-slate-900">{post.author}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <time>{post.date}</time>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>
        </header>

        <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-xl shadow-xl">
          <img alt={post.title} className="h-full w-full object-cover" src={post.imageUrl} referrerPolicy="no-referrer" />
        </div>

        <div className="prose prose-slate max-w-none text-slate-800 font-display">
          <p className="text-xl font-medium leading-relaxed mb-8 italic text-slate-600">
            "{post.excerpt}"
          </p>
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        </div>

        <section className="mt-16 border-t border-slate-200 pt-12">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Thoughts on this piece?</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-colors">
                <ThumbsUp className="w-4 h-4" /> 142
              </button>
              <button className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-primary/10 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
          <div className="mb-8 flex gap-4">
            {['😍', '🤔', '🤯', '👏'].map(emoji => (
              <button key={emoji} className="text-2xl grayscale hover:grayscale-0 transition-all p-2 rounded-lg hover:bg-slate-100">
                {emoji}
              </button>
            ))}
          </div>
          <div className="mb-12 space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">{comment.author}</span>
                    <span className="text-xs text-slate-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-slate-700">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-slate-500 italic">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
          
          <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
            <label className="mb-4 block text-sm font-semibold uppercase tracking-wider text-slate-500">Leave a comment</label>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4 w-full rounded-lg border-slate-200 bg-transparent p-4 focus:ring-2 focus:ring-primary min-h-[120px]" 
              placeholder="What are your thoughts on the future of design?"
            ></textarea>
            <div className="flex justify-end">
              <button 
                onClick={handlePostComment}
                disabled={isSubmitting || !newComment.trim()}
                className="rounded-lg bg-primary px-6 py-2.5 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </section>
      </article>

      <aside className="flex flex-col gap-10">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-full bg-cover bg-center" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5AkusL7bBt97bjUAUgyP99JxymvbxmjvQxqCcJ9SWXB8r7QVKkCPAGiJta2O0FYHCrGkX69OthB1ioCH09JiwAQ5bE6KxzVbSFIyfsj6I5HhemWd7iiw3uRf-7_qtYn7dgVnYHn-ZZ_SPM1x20MWTeRwY-E-LBjmS6m1IFFUdjdpAWCAdqYcXVsudJHQal0HhevBW-bN6Rb5v3hfWicHVV0rCrA1pG6sR-dAw7PJ2ZgKrrZtIWhj3JGYgtgTak8UjTYJFH45jPuE')` }}
            />
            <div>
              <h4 className="font-bold text-slate-900">{post.author}</h4>
              <p className="text-xs text-slate-500">Design Strategist</p>
            </div>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Exploring the intersection of technology, psychology, and aesthetics in the digital age. 
          </p>
          <button className="w-full rounded-lg border border-primary/20 bg-primary/5 py-2 text-sm font-bold text-primary hover:bg-primary/10 transition-colors">
            Follow
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Related Posts</h4>
          {[
            { title: 'The Return of Skeuomorphism? Why We Miss Physicality', date: 'Oct 12 · 5 min read', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1TfgtoS2ahaSjI_UPb3cWmOwDgCzuGYHasxTBvc9hXTUuLMQxxwUds2WMZeF98mllp10RFGQWU-MA6H1D-FZQvAn84uREAQJ7GNVNQqMc3qgprkhdncl3Lxd--GcIEJwzA3PsB5k-ohESPX_XNVjBr6IYLEUnSkv5CtTR46hJeelwm_c4XCMahLbiuvm-_iiFMHo5TkqjAnSvWgbDpOgKFDx0BU4W_gZ1-fevxWIAmkTUwzHJksy_PXfHfOUsIODzU7dQmpRW2sw' },
            { title: 'Color Psychology in Modern SaaS Platforms', date: 'Oct 05 · 12 min read', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASCRCKZRCLb7dm7FdyzlY4Qx6BhEwQCMUtRVnAEyDqZxKWWz9qj1d6nE5i7hCCAkbhrSwAJuIg6_9klf7cUz-B3S65g8UJXsKBjYHjHnxrXnQTMLTJ39g50f5kZ-rGXzm83On1CxJKOygK7s5DL16JGpHvHG0ulyid8ZiCKEa3_g2faWXFA1EVWPcJXuoyqLYfQcTLjHEqI0xNP8jy3Q6PffBkcX61YbEGOowNWse-7jjEJHINukO_9jdZ8pqcddb1zF_59UrPVuw' }
          ].map((item, idx) => (
            <a key={idx} className="group flex flex-col gap-2" href="#">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.img} referrerPolicy="no-referrer" />
              </div>
              <h5 className="font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h5>
              <p className="text-xs text-slate-500">{item.date}</p>
            </a>
          ))}
        </div>

        <div className="rounded-xl bg-primary p-6 text-white">
          <h4 className="mb-2 text-lg font-bold">Weekly Insights</h4>
          <p className="mb-4 text-sm opacity-90">Get our best articles delivered to your inbox every Sunday.</p>
          <div className="flex flex-col gap-2">
            <input className="w-full rounded-lg border-none bg-white/20 p-2 text-sm text-white placeholder:text-white/60 focus:ring-2 focus:ring-white" placeholder="Email address" type="email" />
            <button className="w-full rounded-lg bg-white py-2 text-sm font-bold text-primary hover:bg-slate-100 transition-colors">Join 12k Readers</button>
          </div>
        </div>
      </aside>
    </div>
  </motion.div>
);
};

const AdminDashboard = ({ posts, onNavigate, onDelete }: { posts: Post[], onNavigate: (page: string, id?: string) => void, onDelete: (id: string) => void }) => (
  <div className="flex min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-slate-300 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <BookOpen className="text-primary w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight text-white">BlogHub Admin</h1>
      </div>
      <nav className="flex-1 py-6">
        <div className="px-4 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Main Menu</div>
        <ul className="space-y-1">
          <li>
            <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-medium">Go to Home</span>
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('admin')} className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary border-r-4 border-primary transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Posts</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors">
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">Media</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors">
              <BarChart2 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium">Subscribers</span>
            </button>
          </li>
        </ul>
        <div className="px-4 mt-8 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Preferences</div>
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-full bg-cover bg-center border border-slate-600" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9TPh33Ro7KsK4GfEy1XctbVSL4TJJE660OjhcuxorNKwEzkV_nDQrEYNqQpRtN0T_78GMp-VAjb1rCOQsJiZ--lwPxlMCy8_5Z-Dc90CXpNqZh80G5QwcbikHWIfTI9g1WxKVG5JBlh5oIwT0IejZMKjddoD5W7utyDnqOuij4KtGg_qY2e-yvb2Q0TJI7vb87cWbUN_3xXs2V5ukgPNgLREzasF6xM_YDdtPQxMBMeFx-1t9zUOFBny3Sqjz_Jb3d-j7SMm4sp4')" }}
          />
          <div>
            <p className="text-sm font-bold text-white">Admin User</p>
            <p className="text-xs text-slate-400">admin@bloghub.com</p>
          </div>
        </div>
      </div>
    </aside>

    <main className="flex-1 ml-64 p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button onClick={() => onNavigate('editor')} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 shadow-sm transition-all">
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Views</p>
          <h3 className="text-3xl font-bold text-slate-800">128,432</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.2%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">New Subscribers</p>
          <h3 className="text-3xl font-bold text-slate-800">1,240</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Static</span>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Posts</p>
          <h3 className="text-3xl font-bold text-slate-800">{posts.length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Posts</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Filter posts..." type="text" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Views</th>
                <th className="px-6 py-4">Published Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-16 rounded bg-cover bg-center shrink-0" 
                        style={{ backgroundImage: `url('${post.imageUrl}')` }}
                      />
                      <span className="font-semibold text-slate-700">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">{post.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{post.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onNavigate('editor', post.id)} className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Edit">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button onClick={() => onNavigate('reader', post.id)} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors" title="View">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDelete(post.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">View All Posts</button>
        </div>
      </div>
    </main>
  </div>
);

const EditorPage = ({ post, onSave, onNavigate }: { post?: Post, onSave: (p: Partial<Post>) => void, onNavigate: (p: string) => void }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || 'Technology');
  const [status, setStatus] = useState(post?.status || 'Draft');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');

  const handleSave = () => {
    onSave({ title, content, excerpt, category, status, imageUrl });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => onNavigate('admin')}>
            <Edit3 className="w-8 h-8 font-bold" />
            <h2 className="text-xl font-bold tracking-tight">BlogAdmin</h2>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-4"></div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('admin')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Dashboard</button>
            <button className="text-sm font-medium text-slate-900 border-b-2 border-primary py-5">Posts</button>
            <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Media</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 italic">Saved at 10:42 AM</span>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Save Draft
          </button>
          <button onClick={() => { setStatus('Published'); handleSave(); }} className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Publish
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-2 border border-primary/20">
            <Users className="text-primary w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-16 flex flex-col items-center py-6 gap-6 bg-white border-r border-slate-200">
          <button className="p-2 rounded-lg bg-primary/10 text-primary" title="Post Editor">
            <FileText className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" title="SEO Settings">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" title="Social Sharing">
            <Share2 className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors" title="Revision History">
            <History className="w-6 h-6" />
          </button>
        </aside>

        <section className="flex-1 overflow-y-auto bg-white px-12 py-10">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
              <button onClick={() => onNavigate('admin')} className="hover:text-primary">Posts</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900">{post ? 'Edit Post' : 'Create New Post'}</span>
            </nav>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-5xl font-bold border-none focus:ring-0 placeholder:text-slate-200 bg-transparent mb-6 font-display" 
              placeholder="Post Title" 
              type="text"
            />
            
            <div className="flex items-center gap-1 p-2 mb-6 border-y border-slate-100 sticky top-0 bg-white z-10">
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><Bold className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><Italic className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><Underline className="w-5 h-5" /></button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><List className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><ListOrdered className="w-5 h-5" /></button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><LinkIcon className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><ImageIcon className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><Quote className="w-5 h-5" /></button>
              <button className="p-1.5 hover:bg-slate-100 rounded transition-colors"><Code className="w-5 h-5" /></button>
            </div>

            <div className="prose prose-slate max-w-none">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[500px] border-none focus:ring-0 text-xl leading-relaxed text-slate-700 bg-transparent resize-none font-display" 
                placeholder="Start writing your masterpiece..."
              />
            </div>
          </div>
        </section>

        <aside className="w-80 overflow-y-auto bg-slate-50 border-l border-slate-200 p-6 flex flex-col gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Status & Visibility</h3>
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm">Visibility</span>
                <span className="text-sm font-medium text-primary cursor-pointer">Public</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="text-sm font-medium text-primary bg-transparent border-none focus:ring-0 cursor-pointer p-0"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stick to top</span>
                <input className="rounded text-primary focus:ring-primary h-4 w-4" type="checkbox" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Featured Image</h3>
            <div className="relative aspect-video rounded-xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group cursor-pointer hover:border-primary transition-colors overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-primary mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Click to upload or drag & drop</p>
                </div>
              )}
              <input 
                type="text" 
                placeholder="Image URL" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="absolute bottom-2 left-2 right-2 text-xs p-1 rounded border-none bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Categories</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto bg-white p-4 rounded-xl border border-slate-200">
              {['Technology', 'Lifestyle', 'Tutorials', 'Business'].map(cat => (
                <label key={cat} className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="rounded text-primary focus:ring-primary h-4 w-4" 
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
            <button className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add New Category
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Excerpt</h3>
            <textarea 
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-sm rounded-lg border-slate-200 bg-white focus:ring-primary focus:border-primary h-24 resize-none" 
              placeholder="Write a brief summary..."
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'posts'));
      if (snapshot.exists()) {
        const postsData = snapshot.val();
        // Convert object to array and attach keys as ids
        const postsArray = Object.keys(postsData).map(key => ({
          ...postsData[key],
          id: key
        })) as Post[];
        // Sort by date or just keep it as is (RTDB objects are unordered)
        setPosts(postsArray.reverse());
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id !== undefined) {
      setSelectedPostId(id);
    } else {
      setSelectedPostId(null);
    }
    window.scrollTo(0, 0);
  };

  const handleSavePost = async (postData: Partial<Post>) => {
    try {
      if (selectedPostId) {
        // Update existing
        const postRef = ref(database, 'posts/' + selectedPostId);
        await update(postRef, postData);
      } else {
        // Create new
        const postsRef = ref(database, 'posts');
        const newPostRef = push(postsRef);
        
        // Add default fields if missing
        const newPost = {
          ...postData,
          date: postData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: postData.readTime || "5 min read",
          author: postData.author || "Admin User",
          views: 0
        };
        
        await set(newPostRef, newPost);
      }
      
      await fetchPosts();
      setCurrentPage('admin');
    } catch (err) {
      console.error("Failed to save post", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const postRef = ref(database, 'posts/' + id);
      await remove(postRef);
      await fetchPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="min-h-screen bg-background-light">
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header onNavigate={handleNavigate} />
            <HomePage posts={posts} onNavigate={handleNavigate} />
            <Footer />
          </motion.div>
        )}
        {currentPage === 'reader' && selectedPost && (
          <motion.div 
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header onNavigate={handleNavigate} />
            <ReaderPage post={selectedPost} onNavigate={handleNavigate} />
            <Footer />
          </motion.div>
        )}
        {currentPage === 'admin' && (
          <motion.div 
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard 
              posts={posts} 
              onNavigate={handleNavigate} 
              onDelete={handleDeletePost} 
            />
          </motion.div>
        )}
        {currentPage === 'editor' && (
          <motion.div 
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditorPage 
              post={selectedPost} 
              onSave={handleSavePost} 
              onNavigate={handleNavigate} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
