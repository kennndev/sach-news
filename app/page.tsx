"use client"
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Home, TrendingUp, Wallet, User, Play, MessageSquare, Share2,
  CheckCircle2, X, Search, Bell, ChevronRight, ArrowUp, ArrowDown,
  Zap, Globe, Trophy, Smartphone, CloudRain, Pause,
  Coins, Video, ThumbsUp, Send, Reply, Heart,
  Flame, Clock, Bookmark, BookmarkCheck, Sparkles,
  Award, Target, BarChart3, History, CreditCard,
  ArrowUpRight, ArrowDownRight, Gamepad2, Grid3X3, Hash, Brain,
  RotateCcw, Delete, ChevronLeft, HelpCircle, Shuffle,
  GraduationCap, BookOpen, Users, MessageCircle, Shield, Eye,
  ThumbsDown, Scale, Lightbulb, Star, Lock, Volume2, VolumeX,
  PlayCircle, CheckCircle, XCircle, ChevronDown, Mic, Plus, Minus, Copy, Loader2
} from 'lucide-react';
import { fetchYouTubeVideos, getCategoryQuery, type YouTubeVideo } from '@/lib/youtube';
import { fetchNewsArticles, getNewsCategoryQuery, type NewsArticle } from '@/lib/newsapi';
import { fetchWeatherData, generateWeatherMarket, type WeatherData } from '@/lib/weather';

// ==================== UTILITY FUNCTIONS ====================
const formatNumber = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// ==================== MOCK USER ====================
const MOCK_USER = {
  name: "Bilal Khan", handle: "@bilal_k", avatar: "BK",
  balance_pkr: 84500, reputation: 89, rank: "Truth Seeker",
  streak: 24, winRate: 67, totalBets: 156, activeBets: 8,
  gamesPlayed: 45, gamesWon: 38, lessonsCompleted: 12,
  criticalThinkingScore: 78, certificates: 3
};

// ==================== CATEGORIES ====================
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Zap, color: 'from-violet-500 to-purple-600' },
  { id: 'politics', label: 'Politics', icon: Globe, color: 'from-blue-500 to-indigo-600' },
  { id: 'cricket', label: 'Cricket', icon: Trophy, color: 'from-green-500 to-emerald-600' },
  { id: 'economy', label: 'Economy', icon: Coins, color: 'from-amber-500 to-orange-600' },
  { id: 'tech', label: 'Tech', icon: Smartphone, color: 'from-cyan-500 to-blue-600' },
  { id: 'weather', label: 'Weather', icon: CloudRain, color: 'from-slate-500 to-gray-600' },
];

// ==================== COMMENTS GENERATOR ====================
const generateComments = (count = 3) => {
  const users = [
    { name: 'Ahmed Hassan', avatar: 'AH' },
    { name: 'Sara Ali', avatar: 'SA' },
    { name: 'Usman Khan', avatar: 'UK' },
    { name: 'Fatima Zahra', avatar: 'FZ' },
    { name: 'Ali Raza', avatar: 'AR' },
    { name: 'Ayesha Malik', avatar: 'AM' },
  ];
  const texts = [
    'This is huge if true! The market seems to be pricing this correctly.',
    'I think the odds are way off here. Betting NO.',
    'Anyone else think this is clickbait?',
    'Great analysis, but I disagree with the conclusion.',
    'The AI trust score seems accurate based on my research.',
    'Need more sources to confirm this.',
    'This changed my mind. Going with YES now.',
    'Classic media manipulation. Stay skeptical.',
  ];
  const times = ['Just now', '2m ago', '5m ago', '15m ago', '1h ago', '2h ago', '3h ago'];

  return Array(count).fill(null).map((_, i) => {
    const user = users[i % users.length];
    const hasReplies = Math.random() > 0.5;
    return {
      id: generateId(),
      author: user.name,
      avatar: user.avatar,
      text: texts[Math.floor(Math.random() * texts.length)],
      timestamp: times[Math.floor(Math.random() * times.length)],
      likes: Math.floor(Math.random() * 50),
      liked: false,
      replies: hasReplies ? [{
        id: generateId(),
        author: users[(i + 1) % users.length].name,
        avatar: users[(i + 1) % users.length].avatar,
        text: texts[Math.floor(Math.random() * texts.length)],
        timestamp: times[Math.floor(Math.random() * times.length)],
        likes: Math.floor(Math.random() * 20),
        liked: false,
        replies: []
      }] : []
    };
  });
};

// ==================== TYPES ====================
interface FeedItem {
  id: number;
  type: 'text' | 'video';
  category: string;
  author: {
    name: string;
    verified: boolean;
    score: number;
    avatar: string;
  };
  timestamp: string;
  headline: string;
  summary: string;
  videoUrl?: string;
  duration?: string;
  ai_score: number;
  market: {
    question: string;
    vol: string;
    yes: number;
    no: number;
    end: string;
    totalPool: number;
  };
  comments: any[];
  bookmarked: boolean;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
}

// ==================== GAMES DATA ====================
const WORDLE_WORDS = ['SACH', 'JANG', 'AMAN', 'HAWA', 'PANI', 'NAYA', 'GHAR', 'DOST', 'RAAT', 'SUBH'];

const CONNECTIONS_PUZZLE = {
  categories: [
    { name: 'Pakistani Cricketers', color: 'bg-yellow-500', words: ['BABAR', 'SHAHEEN', 'RIZWAN', 'SHADAB'] },
    { name: 'Pakistani Cities', color: 'bg-green-500', words: ['LAHORE', 'KARACHI', 'MULTAN', 'QUETTA'] },
    { name: 'Currencies', color: 'bg-blue-500', words: ['RUPEE', 'DOLLAR', 'POUND', 'DIRHAM'] },
    { name: 'News Channels', color: 'bg-purple-500', words: ['GEO', 'ARY', 'DUNYA', 'SAMAA'] },
  ]
};

const NUMBER_PUZZLES = [
  { target: 150, numbers: [2, 5, 10, 25, 3, 7] },
  { target: 236, numbers: [4, 6, 8, 15, 25, 2] },
  { target: 100, numbers: [1, 3, 5, 7, 11, 13] },
  { target: 75, numbers: [2, 4, 6, 8, 10, 12] },
];

// ==================== LEARNING DATA ====================
const LESSONS = [
  { id: 1, title: "Is this news or opinion?", topic: "Media Literacy", duration: "15 min", difficulty: "Beginner", emoji: "📰", xp: 50, completed: true },
  { id: 2, title: "Spotting Deepfakes", topic: "Digital Literacy", duration: "20 min", difficulty: "Intermediate", emoji: "🤖", xp: 75, completed: true },
  { id: 3, title: "The Headline Trap", topic: "Critical Reading", duration: "12 min", difficulty: "Beginner", emoji: "🎣", xp: 50, completed: false, isToday: true },
  { id: 4, title: "Following the Money", topic: "Source Analysis", duration: "25 min", difficulty: "Advanced", emoji: "💰", xp: 100, completed: false, locked: true },
  { id: 5, title: "Echo Chambers", topic: "Social Media", duration: "18 min", difficulty: "Intermediate", emoji: "🔄", xp: 75, completed: false, locked: true },
];

const FACT_CHECKS = [
  { id: 1, headline: "Scientists discover drinking 8 glasses of water daily is a myth", source: "HealthDaily Blog", isReal: true, explanation: "Multiple studies have shown water needs vary by individual. The 8 glasses rule has no scientific basis.", flags: ["Verified by research", "Multiple sources confirm"] },
  { id: 2, headline: "Local boy finds Rs. 10 million buried in backyard, keeps it all", source: "ViralNews24", isReal: false, explanation: "Treasure trove laws require reporting to authorities. Source is not credible.", flags: ["Unknown source", "Legally impossible claim"] },
  { id: 3, headline: "Pakistan cricket team announces squad for upcoming series", source: "PCB Official", isReal: true, explanation: "Official announcement from verified Pakistan Cricket Board account.", flags: ["Official source", "Verified account"] },
  { id: 4, headline: "Eating chocolate daily increases IQ by 20 points", source: "FoodFacts.net", isReal: false, explanation: "No scientific evidence supports this. Extraordinary claims need extraordinary evidence.", flags: ["Sensationalist claim", "No citations"] },
];

const DEBATES = [
  {
    id: 1, question: "Should social media platforms be held responsible for misinformation?", category: "Tech & Society",
    forPoints: ["Platforms profit from engagement", "They have technology to detect false info", "Public health impact"],
    againstPoints: ["Impossible to fact-check everything", "Risk of censorship", "Users should be responsible"]
  },
  {
    id: 2, question: "Is it ethical to use AI to write news articles?", category: "AI & Ethics",
    forPoints: ["Faster news delivery", "Reduces costs", "No political bias"],
    againstPoints: ["AI can hallucinate", "Removes human judgment", "Job losses"]
  },
  {
    id: 3, question: "Should voting be mandatory?", category: "Politics",
    forPoints: ["Higher participation", "More representative democracy", "Civic duty"],
    againstPoints: ["Freedom includes not voting", "Uninformed votes", "Enforcement issues"]
  },
];

const DISCUSSIONS = [
  { id: 1, title: "Should schools teach financial literacy?", participants: 312, comments: 124, category: "Education", trending: true },
  { id: 2, title: "Are sports stars paid too much?", participants: 456, comments: 178, category: "Sports", trending: true },
  { id: 3, title: "Is remote work the future?", participants: 289, comments: 98, category: "Work", trending: false },
];

// ==================== COMPONENTS ====================

// Trust Badge
const TrustBadge = ({ score }: { score: number }) => (
  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-0.5 ${score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'
    } text-white`}>
    <Sparkles size={8} />{score}%
  </span>
);

// Modal Wrapper
const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
            <h3 className="font-bold text-lg">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// Comments Sheet
const CommentsSheet = ({ isOpen, onClose, comments: initialComments, onAddComment }: { isOpen: boolean; onClose: () => void; comments: any[]; onAddComment?: (comment: string) => void }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => setComments(initialComments), [initialComments]);

  const handleLike = (commentId: any, isReply = false, parentId = null) => {
    setComments((prev: any[]) => prev.map(c => {
      if (!isReply && c.id === commentId) {
        return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
      }
      if (isReply && c.id === parentId) {
        return {
          ...c, replies: c.replies.map((r: { id: any; liked: any; likes: number; }) =>
            r.id === commentId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
          )
        };
      }
      return c;
    }));
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const newC = {
      id: generateId(), author: MOCK_USER.name, avatar: MOCK_USER.avatar,
      text: newComment, timestamp: 'Just now', likes: 0, liked: false, replies: []
    };
    if (replyingTo) {
      setComments((prev: any[]) => prev.map(c => c.id === replyingTo ? { ...c, replies: [...c.replies, newC] } : c));
    } else {
      setComments((prev: any) => [newC, ...prev]);
    }
    onAddComment?.(newComment);
    setNewComment('');
    setReplyingTo(null);
  };

  const totalComments = comments.length + comments.reduce((a: any, c: { replies: string | any[]; }) => a + c.replies.length, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${totalComments} Comments`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {comment.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{comment.author}</span>
                  <span className="text-xs text-gray-400">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2 break-words">{comment.text}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(comment.id)} className={`flex items-center gap-1 text-xs transition-colors ${comment.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                    <Heart size={14} className={comment.liked ? 'fill-current' : ''} />{comment.likes}
                  </button>
                  <button onClick={() => setReplyingTo(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                    <Reply size={14} />Reply
                  </button>
                </div>
              </div>
            </div>
            {comment.replies.length > 0 && (
              <div className="ml-12 space-y-3 pl-3 border-l-2 border-gray-100">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {reply.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">{reply.author}</span>
                        <span className="text-xs text-gray-400">{reply.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 break-words">{reply.text}</p>
                      <button onClick={() => handleLike(reply.id, true, comment.id)} className={`flex items-center gap-1 text-xs transition-colors ${reply.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                        <Heart size={14} className={reply.liked ? 'fill-current' : ''} />{reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first!</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
        {replyingTo && (
          <div className="flex items-center justify-between mb-2 px-3 py-2 bg-blue-50 rounded-lg">
            <span className="text-xs text-blue-600">Replying to {comments.find((c: { id: any; }) => c.id === replyingTo)?.author}</span>
            <button onClick={() => setReplyingTo(null)} className="text-blue-600 p-1"><X size={14} /></button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold shrink-0">{MOCK_USER.avatar}</div>
          <input
            type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Add a comment..."
            className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button onClick={handleSubmit} disabled={!newComment.trim()} className="p-2 bg-black text-white rounded-full disabled:opacity-30 hover:bg-gray-800 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Bet Modal
const BetModal = ({ isOpen, onClose, market, onPlaceBet }: { isOpen: boolean; onClose: () => void; market: any; onPlaceBet?: (side: string, amount: number, potentialWin: number) => void }) => {
  const [side, setSide] = useState('yes');
  const [amount, setAmount] = useState(1000);

  if (!market) return null;

  const odds = side === 'yes' ? market.yes : market.no;
  const potentialWin = Math.round(amount / odds);
  const profit = potentialWin - amount;

  const handleBet = () => {
    onPlaceBet?.(side, amount, potentialWin);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Place Your Bet">
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="text-xs text-gray-500 font-medium mb-1">PREDICTION</div>
          <p className="font-semibold text-gray-900">{market.question}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={12} />Ends {market.end}</span>
            <span className="flex items-center gap-1"><BarChart3 size={12} />Vol: {market.vol}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setSide('yes')} className={`p-4 rounded-xl border-2 transition-all ${side === 'yes' ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className={`text-2xl font-black mb-1 ${side === 'yes' ? 'text-emerald-600' : 'text-gray-400'}`}>YES</div>
            <div className="text-sm text-gray-500">{Math.round(market.yes * 100)}¢</div>
          </button>
          <button onClick={() => setSide('no')} className={`p-4 rounded-xl border-2 transition-all ${side === 'no' ? 'border-rose-500 bg-rose-50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className={`text-2xl font-black mb-1 ${side === 'no' ? 'text-rose-600' : 'text-gray-400'}`}>NO</div>
            <div className="text-sm text-gray-500">{Math.round(market.no * 100)}¢</div>
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Amount (PKR)</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[500, 1000, 2500, 5000].map(a => (
              <button key={a} onClick={() => setAmount(a)} className={`py-2 rounded-lg text-sm font-semibold transition-all ${amount === a ? 'bg-black text-white scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {formatNumber(a)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAmount(Math.max(100, amount - 100))} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><Minus size={18} /></button>
            <input type="number" value={amount} onChange={e => setAmount(Math.max(100, Number(e.target.value)))} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-black/10" />
            <button onClick={() => setAmount(amount + 100)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><Plus size={18} /></button>
          </div>
        </div>

        <div className={`rounded-xl p-4 mb-4 ${side === 'yes' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Potential Win:</span>
            <span className={`text-2xl font-black ${side === 'yes' ? 'text-emerald-600' : 'text-rose-600'}`}>
              Rs. {potentialWin.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Profit</span>
            <span className="font-semibold text-emerald-600">+Rs. {profit.toLocaleString()}</span>
          </div>
        </div>

        <button onClick={handleBet} className={`w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] ${side === 'yes' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-rose-500 to-red-600'}`}>
          Bet {side.toUpperCase()} for Rs. {amount.toLocaleString()}
        </button>
      </div>
    </Modal>
  );
};

// Market Ticker
const MarketTicker = ({ market, onBet }: { market: any; onBet: (side: string) => void }) => (
  <div className="mt-3 rounded-xl overflow-hidden border bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200">
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1"><Target size={10} />Prediction Market</span>
        <span className="text-[10px] font-semibold text-gray-400">Vol: {market.vol}</span>
      </div>
      <p className="text-sm font-semibold mb-3 text-gray-900">{market.question}</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3 flex">
        <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500" style={{ width: `${market.yes * 100}%` }} />
        <div className="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500" style={{ width: `${market.no * 100}%` }} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onBet('yes')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]">
          <ArrowUp size={14} />YES {Math.round(market.yes * 100)}%
        </button>
        <button onClick={() => onBet('no')} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]">
          <ArrowDown size={14} />NO {Math.round(market.no * 100)}%
        </button>
      </div>
    </div>
    <div className="px-3 py-2 bg-gray-100 text-[10px] flex justify-between text-gray-500">
      <span><Clock size={10} className="inline mr-1" />Ends {market.end}</span>
      <span>Pool: Rs. {formatNumber(market.totalPool)}</span>
    </div>
  </div>
);

// Feed Card
const FeedCard = ({ data, onComment, onBet, onBookmark }: { data: any; onComment: () => void; onBet: (side: string) => void; onBookmark: () => void }) => {
  const cat = CATEGORIES.find(c => c.id === data.category);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.engagement.likes);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${cat?.color} flex items-center justify-center text-white text-xs font-bold shadow-lg shrink-0`}>
              {data.author.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm truncate">{data.author.name}</span>
                {data.author.verified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 shrink-0" />}
                <TrustBadge score={data.ai_score} />
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>{data.timestamp}</span>
                <span>•</span>
                <span className={`font-semibold bg-gradient-to-r ${cat?.color} bg-clip-text text-transparent`}>{cat?.label}</span>
              </div>
            </div>
          </div>
          <button onClick={onBookmark} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            {data.bookmarked ? <BookmarkCheck size={20} className="text-black fill-current" /> : <Bookmark size={20} className="text-gray-300" />}
          </button>
        </div>
        <h3 className="font-bold text-base sm:text-lg mb-2 leading-snug">{data.headline}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{data.summary}</p>

        {/* Video Player for video type */}
        {data.type === 'video' && (
          <div className="relative mb-3 rounded-xl overflow-hidden bg-black aspect-video">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer group" onClick={() => setIsPlaying(true)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
                  <Play size={28} className="text-black ml-1" />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs font-semibold">
                    <Clock size={12} />{data.duration}
                  </div>
                  {data.engagement.views && (
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs font-semibold">
                      <Eye size={12} />{formatNumber(data.engagement.views)}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`${data.videoUrl}?autoplay=1`}
                title={data.headline}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )}

        <MarketTicker market={data.market} onBet={onBet} />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex gap-1">
            <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${liked ? 'text-rose-500 bg-rose-50' : 'text-gray-500 hover:bg-gray-100'}`}>
              <Heart size={16} className={liked ? 'fill-current' : ''} />
              <span className="text-xs font-medium">{formatNumber(likeCount)}</span>
            </button>
            <button onClick={onComment} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <MessageSquare size={16} />
              <span className="text-xs font-medium">{formatNumber(data.engagement.comments)}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== GAMES ====================

// Wordle
const WordleGame = ({ onBack, onWin, showToast }: { onBack: () => void; onWin?: () => void; showToast?: (message: string) => void }) => {
  const [targetWord] = useState(() => WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKeyPress = useCallback((key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') {
      if (currentGuess.length !== 4) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        showToast?.('Word must be 4 letters!');
        return;
      }
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      if (currentGuess === targetWord) {
        setWon(true);
        setGameOver(true);
        onWin?.();
      } else if (newGuesses.length >= 6) {
        setGameOver(true);
        showToast?.(`The word was: ${targetWord}`);
      }
      setCurrentGuess('');
    } else if (key === 'DELETE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 4 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameOver, guesses, onWin, showToast, targetWord]);

  const getLetterStatus = (letter: string, index: number, guess: string) => {
    if (targetWord[index] === letter) return 'bg-green-500 border-green-500 text-white';
    if (targetWord.includes(letter)) return 'bg-yellow-500 border-yellow-500 text-white';
    return 'bg-gray-600 border-gray-600 text-white';
  };

  const getKeyStatus = (key: string) => {
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (targetWord[i] === key) return 'bg-green-500 text-white';
          if (targetWord.includes(key)) return 'bg-yellow-500 text-white';
          return 'bg-gray-700 text-white';
        }
      }
    }
    return 'bg-gray-500 text-white hover:bg-gray-400';
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">LAFZ</h2>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors"><HelpCircle size={24} /></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-1.5">
        {[...Array(6)].map((_, rowIndex) => {
          const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
          const isCurrentRow = rowIndex === guesses.length && !gameOver;
          return (
            <div key={rowIndex} className={`flex gap-1.5 ${isCurrentRow && shake ? 'animate-shake' : ''}`}>
              {[...Array(4)].map((_, colIndex) => {
                const letter = guess[colIndex] || '';
                const isGuessed = rowIndex < guesses.length;
                const cellClass = isGuessed && letter ? getLetterStatus(letter, colIndex, guess) : 'bg-gray-800 border-gray-600';
                return (
                  <div key={colIndex} className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold border-2 rounded-lg transition-all ${cellClass} ${letter && !isGuessed ? 'border-gray-400 scale-105' : ''}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
        {gameOver && (
          <div className={`mt-4 p-4 rounded-xl text-center ${won ? 'bg-green-600' : 'bg-red-600'}`}>
            <p className="text-xl font-bold">{won ? '🎉 Brilliant!' : `Word: ${targetWord}`}</p>
            <p className="text-sm opacity-80 mt-1">{won ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}` : 'Better luck next time!'}</p>
          </div>
        )}
      </div>

      <div className="p-2 pb-4 space-y-1.5">
        {keyboard.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map(key => (
              <button key={key} onClick={() => handleKeyPress(key)} className={`${getKeyStatus(key)} ${key.length > 1 ? 'px-2 sm:px-3 text-[10px] sm:text-xs' : 'w-8 sm:w-9'} h-11 sm:h-12 rounded-lg font-bold transition-colors active:scale-95`}>
                {key === 'DELETE' ? <Delete size={16} /> : key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}.animate-shake{animation:shake 0.3s ease-in-out}`}</style>
    </div>
  );
};

// Connections
const ConnectionsGame = ({ onBack, onWin, showToast }: { onBack: () => void; onWin?: () => void; showToast?: (message: string) => void }) => {
  const [shuffledWords, setShuffledWords] = useState(() => {
    const allWords = CONNECTIONS_PUZZLE.categories.flatMap(c => c.words);
    return allWords.sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);

  const remainingWords = shuffledWords.filter(w => !solved.flatMap(s => s.words).includes(w));

  const handleSelect = (word: string) => {
    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 4) return;
    const match = CONNECTIONS_PUZZLE.categories.find(cat =>
      cat.words.every(w => selected.includes(w)) && !solved.find(s => s.name === cat.name)
    );
    if (match) {
      setSolved([...solved, match]);
      setSelected([]);
      if (solved.length + 1 === 4) onWin?.();
      showToast?.(`✓ ${match.name}`);
    } else {
      setMistakes(m => m + 1);
      setShake(true);
      setTimeout(() => { setShake(false); setSelected([]); }, 600);
      if (mistakes + 1 >= 4) showToast?.('Game Over! Try again.');
    }
  };

  const gameOver = mistakes >= 4 || solved.length === 4;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">Connections</h2>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><HelpCircle size={24} /></button>
      </div>

      <div className="p-4 text-center text-sm text-gray-600">Create 4 groups of 4 related items</div>

      <div className="px-4 space-y-2">
        {solved.map((cat, i) => (
          <div key={i} className={`${cat.color} text-white p-3 rounded-xl text-center animate-in zoom-in duration-300`}>
            <div className="font-bold text-sm">{cat.name}</div>
            <div className="text-xs mt-1 opacity-90">{cat.words.join(', ')}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 p-4">
        <div className={`grid grid-cols-4 gap-2 ${shake ? 'animate-shake' : ''}`}>
          {remainingWords.map(word => (
            <button key={word} onClick={() => !gameOver && handleSelect(word)} disabled={gameOver}
              className={`p-2 sm:p-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-all ${selected.includes(word) ? 'bg-gray-800 text-white scale-95' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } disabled:opacity-50`}>
              {word}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <span className="text-sm text-gray-500">Mistakes:</span>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < 4 - mistakes ? 'bg-gray-800' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex gap-3">
        <button onClick={() => setShuffledWords([...remainingWords].sort(() => Math.random() - 0.5))} className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <Shuffle size={18} />Shuffle
        </button>
        <button onClick={() => setSelected([])} className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <RotateCcw size={18} />Clear
        </button>
        <button onClick={handleSubmit} disabled={selected.length !== 4 || gameOver} className="flex-1 py-3 rounded-xl bg-black text-white font-semibold disabled:opacity-30 transition-colors">
          Submit
        </button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}.animate-shake{animation:shake 0.3s ease-in-out}`}</style>
    </div>
  );
};

// Numbers Game
const NumbersGame = ({ onBack, onWin, showToast }: { onBack: () => void; onWin?: () => void; showToast?: (message: string) => void }) => {
  const [puzzle] = useState(() => NUMBER_PUZZLES[Math.floor(Math.random() * NUMBER_PUZZLES.length)]);
  const [expression, setExpression] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);

  const operations = ['+', '-', '×', '÷'];

  const calculate = () => {
    try {
      if (expression.length === 0) return null;
      const expr = expression.map(e => e === '×' ? '*' : e === '÷' ? '/' : e).join('');
      const result = eval(expr);
      return Math.round(result * 100) / 100;
    } catch { return null; }
  };

  const currentResult = calculate();
  const isValid = currentResult === puzzle.target;

  const handleNumber = (num: number, index: number) => {
    if (usedIndices.has(index) || solved) return;
    setExpression([...expression, num.toString()]);
    setUsedIndices(new Set([...usedIndices, index]));
  };

  const handleOp = (op: string) => {
    if (expression.length === 0 || solved) return;
    const last = expression[expression.length - 1];
    if (operations.includes(last)) return;
    setExpression([...expression, op]);
  };

  const handleClear = () => {
    setExpression([]);
    setUsedIndices(new Set());
    setSolved(false);
  };

  const handleUndo = () => {
    if (expression.length === 0) return;
    const last = expression[expression.length - 1];
    setExpression(expression.slice(0, -1));
    if (!operations.includes(last)) {
      const idx = [...usedIndices].find(i => puzzle.numbers[i].toString() === last);
      if (idx !== undefined) {
        const newUsed = new Set(usedIndices);
        newUsed.delete(idx);
        setUsedIndices(newUsed);
      }
    }
  };

  const handleSubmit = () => {
    if (isValid && !solved) {
      setSolved(true);
      onWin?.();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">Number Target</h2>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><HelpCircle size={24} /></button>
      </div>

      <div className="text-center py-6">
        <div className="text-sm opacity-70 mb-2">TARGET</div>
        <div className="text-5xl sm:text-6xl font-black">{puzzle.target}</div>
      </div>

      <div className="mx-4 p-4 bg-white/10 rounded-xl min-h-[70px] flex items-center justify-center flex-wrap gap-2 backdrop-blur-sm">
        {expression.length === 0 ? (
          <span className="text-white/50 text-sm">Tap numbers and operations...</span>
        ) : (
          expression.map((e, i) => (
            <span key={i} className={`text-xl sm:text-2xl font-bold ${operations.includes(e) ? 'text-yellow-400' : ''}`}>{e}</span>
          ))
        )}
      </div>

      {currentResult !== null && expression.length > 0 && (
        <div className={`text-center py-3 text-xl sm:text-2xl font-bold ${isValid ? 'text-green-400' : ''}`}>
          = {currentResult} {isValid && '✓'}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {puzzle.numbers.map((num, i) => (
            <button key={i} onClick={() => handleNumber(num, i)} disabled={usedIndices.has(i) || solved}
              className={`py-5 sm:py-6 rounded-2xl text-xl sm:text-2xl font-bold transition-all ${usedIndices.has(i) ? 'bg-white/5 text-white/30' : 'bg-white/20 hover:bg-white/30 hover:scale-105 active:scale-95'
                }`}>
              {num}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {operations.map(op => (
            <button key={op} onClick={() => handleOp(op)} disabled={solved}
              className="py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold bg-yellow-500 text-yellow-900 hover:bg-yellow-400 transition-colors active:scale-95">
              {op}
            </button>
          ))}
        </div>
      </div>

      {solved && (
        <div className="mx-4 mb-4 p-4 bg-green-500 rounded-xl text-center animate-in zoom-in duration-300">
          <p className="text-xl font-bold">🎉 Perfect!</p>
        </div>
      )}

      <div className="p-4 flex gap-3">
        <button onClick={handleClear} className="flex-1 py-3 rounded-xl bg-white/10 font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
          <RotateCcw size={18} />Clear
        </button>
        <button onClick={handleUndo} className="flex-1 py-3 rounded-xl bg-white/10 font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
          <Delete size={18} />Undo
        </button>
        <button onClick={handleSubmit} disabled={!isValid || solved} className="flex-1 py-3 rounded-xl bg-green-500 font-semibold disabled:opacity-30 transition-colors">
          Submit
        </button>
      </div>
    </div>
  );
};

// Games Hub
const GamesHub = ({ onSelectGame }: { onSelectGame: (game: string) => void }) => (
  <div className="h-full overflow-y-auto pb-24 bg-gray-50">
    <div className="p-6 bg-gradient-to-br from-violet-600 to-purple-700 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><Gamepad2 size={28} /></div>
        <div>
          <h2 className="text-2xl font-bold">Daily Games</h2>
          <p className="text-white/70 text-sm">Train your brain, win rewards!</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
          <div className="text-2xl font-black">{MOCK_USER.gamesPlayed}</div>
          <div className="text-[10px] uppercase opacity-70">Played</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
          <div className="text-2xl font-black">{MOCK_USER.gamesWon}</div>
          <div className="text-[10px] uppercase opacity-70">Won</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
          <div className="text-2xl font-black">{MOCK_USER.streak}🔥</div>
          <div className="text-[10px] uppercase opacity-70">Streak</div>
        </div>
      </div>
    </div>
    <div className="p-4 space-y-4">
      <h3 className="font-bold text-lg text-gray-800">Today's Games</h3>
      {[
        { id: 'wordle', name: 'LAFZ', desc: 'Guess the 4-letter Urdu word', icon: Grid3X3, color: 'from-green-500 to-emerald-600', streak: 5 },
        { id: 'connections', name: 'Connections', desc: 'Group 16 words into 4 categories', icon: Brain, color: 'from-purple-500 to-violet-600', streak: 3 },
        { id: 'numbers', name: 'Number Target', desc: 'Combine numbers to hit the target', icon: Hash, color: 'from-blue-500 to-indigo-600', streak: 7 },
      ].map(game => (
        <button key={game.id} onClick={() => onSelectGame(game.id)} className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 text-left hover:shadow-lg transition-all active:scale-[0.99]">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg shrink-0`}>
            <game.icon size={28} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-lg">{game.name}</h4>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">{game.streak}🔥</span>
            </div>
            <p className="text-sm text-gray-500 truncate">{game.desc}</p>
          </div>
          <ChevronRight className="text-gray-300 shrink-0" />
        </button>
      ))}
    </div>
    <div className="p-4">
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-4 border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shrink-0"><Trophy size={24} className="text-white" /></div>
          <div>
            <h4 className="font-bold text-amber-900">Daily Challenge</h4>
            <p className="text-sm text-amber-700">Complete all 3 games to earn 50 tokens!</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-amber-200 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-amber-500 rounded-full transition-all" />
        </div>
        <p className="text-xs text-amber-600 mt-2">1 of 3 completed</p>
      </div>
    </div>
  </div>
);

// ==================== LEARNING ====================

// Lesson View
const LessonView = ({ lesson, onBack, onComplete }: { lesson: any; onBack: () => void; onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);

  const content = [
    { type: 'intro', title: lesson.title, text: 'Headlines are designed to grab attention. But they often oversimplify or sensationalize. Let\'s learn to look beyond.' },
    { type: 'example', bad: 'Scientists Say Chocolate Cures All Diseases!', good: 'Study finds dark chocolate may have some health benefits', lesson: 'Headlines often exaggerate research findings for clicks.' },
    { type: 'quiz', q: 'Which headline is likely clickbait?', opts: ['Government announces new policy', 'You Won\'t BELIEVE What This Celebrity Did!!!', 'Weather: Rain expected this weekend'], correct: 1 },
    { type: 'tips', tips: ['Always read beyond the headline', 'Check the source', 'Look for emotional manipulation', 'Verify with multiple sources'] }
  ];

  const curr = content[step];
  const isLast = step === content.length - 1;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <div className="flex-1 mx-4"><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${((step + 1) / content.length) * 100}%` }} /></div></div>
        <span className="text-sm text-gray-500">{step + 1}/{content.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {curr.type === 'intro' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">{lesson.emoji}</div>
            <h2 className="text-2xl font-bold mb-4">{curr.title}</h2>
            <p className="text-gray-600 leading-relaxed">{curr.text}</p>
          </div>
        )}
        {curr.type === 'example' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Spot the Problem</h3>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="text-xs text-red-600 font-bold mb-2">⚠️ MISLEADING</div>
              <p className="font-bold text-red-800">"{curr.bad}"</p>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="text-xs text-emerald-600 font-bold mb-2">✓ BETTER</div>
              <p className="font-bold text-emerald-800">"{curr.good}"</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Lightbulb size={18} className="text-blue-600" /><span className="font-bold text-blue-800">Lesson</span></div>
              <p className="text-blue-700">{curr.lesson}</p>
            </div>
          </div>
        )}
        {curr.type === 'quiz' && (
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Quiz</h3>
            <p className="text-gray-700 mb-4">{curr.q}</p>
            <div className="space-y-3">
              {curr.opts?.map((opt, i) => (
                <button key={i} onClick={() => setAnswer(i)} className={`w-full p-4 rounded-xl text-left transition-all border-2 ${answer === null ? 'border-gray-200 hover:border-gray-300' :
                  i === curr.correct ? 'border-emerald-500 bg-emerald-50' :
                    answer === i ? 'border-red-500 bg-red-50' : 'border-gray-200 opacity-50'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${answer !== null && i === curr.correct ? 'bg-emerald-500 text-white' :
                      answer === i && i !== curr.correct ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>{answer !== null && i === curr.correct ? '✓' : String.fromCharCode(65 + i)}</div>
                    <span className="font-medium">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
            {answer !== null && (
              <div className={`mt-4 p-4 rounded-xl ${answer === curr.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {answer === curr.correct ? '🎉 Correct! Excessive punctuation and phrases like "You Won\'t Believe" are classic clickbait.' : '💡 The answer is B. Look for sensational language.'}
              </div>
            )}
          </div>
        )}
        {curr.type === 'tips' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-2xl font-bold mb-6">Key Takeaways</h2>
            <div className="space-y-3 text-left">
              {curr.tips?.map((tip, i) => (
                <div key={i} className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl">
                  <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                  <span className="font-medium text-emerald-800">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 shrink-0">
        <button onClick={() => isLast ? onComplete() : (setStep(step + 1), setAnswer(null))} disabled={curr.type === 'quiz' && answer === null}
          className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-emerald-600 transition-colors active:scale-[0.98]">
          {isLast ? '🎉 Complete (+50 XP)' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

// Fact Check View
const FactCheckView = ({ challenge, onBack, onComplete }: { challenge: any; onBack: () => void; onComplete: () => void }) => {
  const [answer, setAnswer] = useState<boolean | null>(null);

  const handleAnswer = (isReal: boolean) => setAnswer(isReal);
  const isCorrect = answer === challenge.isReal;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="font-bold text-lg">Fact Check</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-gray-500">Is this headline REAL or FAKE?</h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-5 mb-6">
          <h2 className="text-lg sm:text-xl font-bold leading-snug mb-3">"{challenge.headline}"</h2>
          <p className="text-sm text-gray-500">Source: {challenge.source}</p>
        </div>

        {answer === null ? (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAnswer(true)} className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors active:scale-95">
              <ThumbsUp size={32} className="text-emerald-600 mx-auto mb-2" />
              <span className="font-bold text-emerald-700">REAL</span>
            </button>
            <button onClick={() => handleAnswer(false)} className="p-5 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors active:scale-95">
              <ThumbsDown size={32} className="text-red-600 mx-auto mb-2" />
              <span className="font-bold text-red-700">FAKE</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <CheckCircle className="text-emerald-600" /> : <XCircle className="text-red-600" />}
                <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{isCorrect ? 'Correct!' : 'Not quite!'}</span>
              </div>
              <p className={isCorrect ? 'text-emerald-600' : 'text-red-600'}>This headline is {challenge.isReal ? 'REAL' : 'FAKE'}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-bold text-blue-800 mb-2">Explanation</h4>
              <p className="text-blue-700 text-sm">{challenge.explanation}</p>
            </div>
            <div className={`rounded-xl p-4 ${challenge.isReal ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <h4 className={`font-bold mb-2 ${challenge.isReal ? 'text-emerald-800' : 'text-red-800'}`}>{challenge.isReal ? '✓ Green Flags' : '⚠️ Red Flags'}</h4>
              <ul className="space-y-1">
                {challenge.flags.map((flag: string, i: number) => (
                  <li key={i} className={`text-sm ${challenge.isReal ? 'text-emerald-700' : 'text-red-700'}`}>• {flag}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {answer !== null && (
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button onClick={onComplete} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors active:scale-[0.98]">
            Next Challenge
          </button>
        </div>
      )}
    </div>
  );
};

// Debate View
const DebateView = ({ topic, onBack }: { topic: any; onBack: () => void }) => {
  const [side, setSide] = useState<'for' | 'against' | null>(null);
  const [showOther, setShowOther] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="font-bold text-lg">Debate Arena</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center mb-6">
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">{topic.category}</span>
          <h2 className="text-lg sm:text-xl font-bold mt-3">{topic.question}</h2>
        </div>

        {!side ? (
          <div>
            <p className="text-center text-gray-500 mb-6">Pick a side to argue:</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSide('for')} className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl hover:bg-emerald-100 transition-colors active:scale-95">
                <ThumbsUp size={32} className="text-emerald-600 mx-auto mb-2" />
                <span className="font-bold text-emerald-700">FOR</span>
              </button>
              <button onClick={() => setSide('against')} className="p-5 bg-rose-50 border-2 border-rose-300 rounded-xl hover:bg-rose-100 transition-colors active:scale-95">
                <ThumbsDown size={32} className="text-rose-600 mx-auto mb-2" />
                <span className="font-bold text-rose-700">AGAINST</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-4 rounded-xl ${side === 'for' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              <p className="font-bold">You're arguing: {side.toUpperCase()}</p>
            </div>
            <h4 className="font-bold">Your Arguments:</h4>
            <div className="space-y-2">
              {(side === 'for' ? topic.forPoints : topic.againstPoints).map((p: string, i: number) => (
                <div key={i} className={`p-3 rounded-lg ${side === 'for' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {i + 1}. {p}
                </div>
              ))}
            </div>
            <button onClick={() => setShowOther(!showOther)} className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              {showOther ? 'Hide' : 'See'} Counter Arguments
              <ChevronDown className={`transition-transform ${showOther ? 'rotate-180' : ''}`} size={18} />
            </button>
            {showOther && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <h4 className="font-bold text-gray-500">The Other Side:</h4>
                {(side === 'for' ? topic.againstPoints : topic.forPoints).map((p: string, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-100 text-gray-700">{i + 1}. {p}</div>
                ))}
              </div>
            )}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Lightbulb size={18} className="text-blue-600" /><span className="font-bold text-blue-800">Learning Tip</span></div>
              <p className="text-sm text-blue-700">Understanding both sides makes you a better critical thinker!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Discussion View  
const DiscussionView = ({ topic, onBack, showToast }: { topic: any; onBack: () => void; showToast?: (message: string) => void }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', author: 'Sara A.', avatar: 'SA', text: 'I think this is really important for our generation.', time: '2h ago', likes: 12 },
    { id: '2', author: 'Ali R.', avatar: 'AR', text: 'Great point, but we also need to consider the other side.', time: '1h ago', likes: 8 },
  ]);

  const handlePost = () => {
    if (!comment.trim()) return;
    setComments([{ id: generateId(), author: MOCK_USER.name, avatar: MOCK_USER.avatar, text: comment, time: 'Just now', likes: 0 }, ...comments]);
    setComment('');
    showToast?.('Comment posted!');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="font-bold text-lg">Discussion</h2>
        <div className="w-10" />
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 text-white">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold">{topic.category}</span>
        <h3 className="text-lg font-bold mt-2">{topic.title}</h3>
        <div className="flex items-center gap-4 mt-2 text-sm opacity-80">
          <span><Users size={14} className="inline mr-1" />{topic.participants} joined</span>
          <span><MessageSquare size={14} className="inline mr-1" />{topic.comments} comments</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{c.avatar}</div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{c.author}</span>
                <span className="text-xs text-gray-400">{c.time}</span>
              </div>
              <p className="text-sm text-gray-700">{c.text}</p>
              <button className="flex items-center gap-1 text-xs text-gray-400 mt-2 hover:text-red-500 transition-colors">
                <Heart size={12} />{c.likes}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
        <div className="flex gap-2">
          <input type="text" value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePost()}
            placeholder="Share your thoughts..." className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={handlePost} disabled={!comment.trim()} className="p-2 bg-blue-500 text-white rounded-full disabled:opacity-30 hover:bg-blue-600 transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Learn Hub
const LearnHub = ({ onSelectLesson, onSelectChallenge, onSelectDebate, onSelectDiscussion }: { onSelectLesson: (lesson: any) => void; onSelectChallenge: (challenge: any) => void; onSelectDebate: (debate: any) => void; onSelectDiscussion: (discussion: any) => void }) => {
  const [tab, setTab] = useState('lessons');

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><GraduationCap size={28} /></div>
          <div>
            <h2 className="text-2xl font-bold">Topical Talk</h2>
            <p className="text-white/70 text-sm">Think critically. Discuss respectfully.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-black">{MOCK_USER.lessonsCompleted}</div>
            <div className="text-[10px] uppercase opacity-70">Lessons</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-black">{MOCK_USER.criticalThinkingScore}%</div>
            <div className="text-[10px] uppercase opacity-70">CT Score</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-black">{MOCK_USER.certificates}🏆</div>
            <div className="text-[10px] uppercase opacity-70">Badges</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto bg-white border-b border-gray-100">
        {[{ id: 'lessons', label: 'Lessons', icon: BookOpen }, { id: 'factcheck', label: 'Fact Check', icon: Shield }, { id: 'debate', label: 'Debate', icon: Scale }, { id: 'discuss', label: 'Discuss', icon: MessageCircle }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {tab === 'lessons' && (
          <>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2"><Flame size={16} /><span className="text-xs font-bold uppercase">Today's Lesson</span></div>
                <h3 className="text-xl font-bold mb-2">The Headline Trap 🎣</h3>
                <p className="text-sm opacity-90 mb-3">Why headlines don't always tell the full story</p>
                <button onClick={() => onSelectLesson(LESSONS[2])} className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-50 transition-colors">
                  <PlayCircle size={16} />Start Lesson
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg">All Lessons</h3>
            {LESSONS.map(lesson => (
              <button key={lesson.id} onClick={() => !lesson.locked && onSelectLesson(lesson)} disabled={lesson.locked}
                className={`w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 text-left ${lesson.locked ? 'opacity-50' : 'hover:shadow-md'} transition-all`}>
                <div className="text-3xl">{lesson.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold truncate">{lesson.title}</h4>
                    {lesson.completed && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                    {lesson.locked && <Lock size={16} className="text-gray-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{lesson.topic}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span><Clock size={12} className="inline mr-1" />{lesson.duration}</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{lesson.difficulty}</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 shrink-0" />
              </button>
            ))}
          </>
        )}

        {tab === 'factcheck' && (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2"><Shield size={20} /><span className="font-bold">Fact Check Challenge</span></div>
              <p className="text-sm opacity-90">Can you spot the fake news? Test your skills!</p>
            </div>
            <h3 className="font-bold text-lg">Today's Headlines</h3>
            {FACT_CHECKS.map((c, i) => (
              <button key={c.id} onClick={() => onSelectChallenge(c)} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1 leading-snug">"{c.headline}"</h4>
                    <p className="text-xs text-gray-400">Source: {c.source}</p>
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {tab === 'debate' && (
          <>
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2"><Scale size={20} /><span className="font-bold">Debate Arena</span></div>
              <p className="text-sm opacity-90">Practice seeing both sides of every argument</p>
            </div>
            <h3 className="font-bold text-lg">Today's Topics</h3>
            {DEBATES.map(d => (
              <button key={d.id} onClick={() => onSelectDebate(d)} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md transition-all">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">{d.category}</span>
                <h4 className="font-bold mt-2">{d.question}</h4>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-emerald-600 font-semibold">FOR</div>
                    <div className="text-lg font-bold text-emerald-700">{d.forPoints.length}</div>
                  </div>
                  <div className="flex-1 bg-rose-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-rose-600 font-semibold">AGAINST</div>
                    <div className="text-lg font-bold text-rose-700">{d.againstPoints.length}</div>
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {tab === 'discuss' && (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2"><Users size={20} /><span className="font-bold">Discussion Forum</span></div>
              <p className="text-sm opacity-90">Join conversations. Disagree agreeably!</p>
            </div>
            <h3 className="font-bold text-lg">Trending Discussions</h3>
            {DISCUSSIONS.map(d => (
              <button key={d.id} onClick={() => onSelectDiscussion(d)} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-1">
                  {d.trending && <Flame size={14} className="text-orange-500" />}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{d.category}</span>
                </div>
                <h4 className="font-bold">{d.title}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span><Users size={12} className="inline mr-1" />{d.participants} joined</span>
                  <span><MessageSquare size={12} className="inline mr-1" />{d.comments} comments</span>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
export default function App() {
  const [tab, setTab] = useState('feed');
  const [mode, setMode] = useState('read');
  const [cat, setCat] = useState('all');
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Modals
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [betOpen, setBetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Sub-views
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [activeDebate, setActiveDebate] = useState<any>(null);
  const [activeDiscussion, setActiveDiscussion] = useState<any>(null);

  // Fetch YouTube videos
  useEffect(() => {
    const loadYouTubeVideos = async () => {
      setLoadingVideos(true);
      try {
        const query = cat === 'all' ? 'Pakistan news' : getCategoryQuery(cat);
        const videos = await fetchYouTubeVideos(query, 20, cat);

        // Convert YouTube videos to feed format
        const videoFeedItems = videos.map((video: YouTubeVideo, index: number) => ({
          id: 1000 + index,
          type: 'video',
          category: cat === 'all' ? 'politics' : cat, // Default to politics if 'all'
          author: {
            name: video.channelTitle,
            verified: true,
            score: 90 + Math.floor(Math.random() * 10),
            avatar: video.channelTitle.substring(0, 2).toUpperCase()
          },
          timestamp: getTimeAgo(video.publishedAt),
          headline: video.title,
          summary: video.description.substring(0, 150) + '...',
          videoUrl: video.videoUrl,
          duration: video.duration,
          ai_score: 85 + Math.floor(Math.random() * 15),
          market: generateMockMarket(video.title),
          comments: generateComments(Math.floor(Math.random() * 10) + 3),
          bookmarked: false,
          engagement: {
            likes: Math.floor(Math.random() * 10000) + 1000,
            comments: Math.floor(Math.random() * 500) + 50,
            shares: Math.floor(Math.random() * 1000) + 100,
            views: parseInt(video.viewCount)
          }
        }));

        setYoutubeVideos(videoFeedItems);
      } catch (error) {
        console.error('Error loading YouTube videos:', error);
        showToast('Failed to load videos');
      } finally {
        setLoadingVideos(false);
      }
    };

    // Only fetch when in watch mode
    if (mode === 'watch') {
      loadYouTubeVideos();
    }
  }, [cat, mode]);

  // Fetch News articles
  useEffect(() => {
    const loadNewsArticles = async () => {
      setLoadingArticles(true);
      try {
        const query = cat === 'all' ? 'Pakistan' : getNewsCategoryQuery(cat);
        const articles = await fetchNewsArticles(query, 10, cat);

        // Convert news articles to feed format
        const articleFeedItems = articles.map((article: NewsArticle, index: number) => ({
          id: 2000 + index,
          type: 'text',
          category: cat === 'all' ? article.category : cat,
          author: {
            name: article.source,
            verified: true,
            score: 85 + Math.floor(Math.random() * 15),
            avatar: article.source.substring(0, 2).toUpperCase()
          },
          timestamp: getTimeAgo(article.publishedAt),
          headline: article.title,
          summary: article.description,
          ai_score: 80 + Math.floor(Math.random() * 20),
          market: generateMockMarket(article.title),
          comments: generateComments(Math.floor(Math.random() * 8) + 2),
          bookmarked: false,
          engagement: {
            likes: Math.floor(Math.random() * 5000) + 500,
            comments: Math.floor(Math.random() * 300) + 30,
            shares: Math.floor(Math.random() * 500) + 50
          }
        }));

        setNewsArticles(articleFeedItems);
      } catch (error) {
        console.error('Error loading news articles:', error);
        showToast('Failed to load articles');
      } finally {
        setLoadingArticles(false);
      }
    };

    // Only fetch when in read mode
    if (mode === 'read') {
      loadNewsArticles();
    }
  }, [cat, mode]);

  // Fetch Weather data
  useEffect(() => {
    const loadWeatherData = async () => {
      setLoadingWeather(true);
      try {
        const weather = await fetchWeatherData();

        // Convert weather data to feed format
        const weatherFeedItems = weather.map((w: WeatherData, index: number) => ({
          id: 3000 + index,
          type: 'text',
          category: 'weather',
          author: {
            name: 'Pakistan Meteorological Department',
            verified: true,
            score: 98,
            avatar: 'PMD'
          },
          timestamp: 'Now',
          headline: `${w.emoji} ${w.city}: ${w.temperature}°C - ${w.description}`,
          summary: `Current temperature: ${w.temperature}°C (feels like ${w.feelsLike}°C). ${w.condition} with ${w.humidity}% humidity and ${w.windSpeed} km/h winds.`,
          ai_score: 99,
          market: generateWeatherMarket(w),
          comments: generateComments(Math.floor(Math.random() * 5) + 2),
          bookmarked: false,
          engagement: {
            likes: Math.floor(Math.random() * 2000) + 300,
            comments: Math.floor(Math.random() * 150) + 20,
            shares: Math.floor(Math.random() * 300) + 50
          }
        }));

        setWeatherData(weatherFeedItems);
      } catch (error) {
        console.error('Error loading weather data:', error);
        showToast('Failed to load weather data');
      } finally {
        setLoadingWeather(false);
      }
    };

    // Only fetch when weather category is selected
    if (cat === 'weather' && mode === 'read') {
      loadWeatherData();
    }
  }, [cat, mode]);

  // Helper function to generate mock prediction market
  const generateMockMarket = (title: string) => {
    const yesProb = 0.3 + Math.random() * 0.4;
    return {
      question: `Will this story develop further?`,
      vol: `${(Math.random() * 10 + 1).toFixed(1)}M`,
      yes: yesProb,
      no: 1 - yesProb,
      end: ['2 days', '3 days', '1 week', 'Jan 31'][Math.floor(Math.random() * 4)],
      totalPool: Math.floor(Math.random() * 10000000) + 1000000
    };
  };

  // Helper function to format time ago
  const getTimeAgo = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filteredFeed = useMemo(() => {
    let filtered = feedData;

    // Special handling for weather category - show weather data
    if (cat === 'weather' && mode === 'read') {
      return weatherData.length > 0 ? weatherData : filtered.filter((item: { category: string; type: string; }) => item.category === 'weather' && item.type === 'text');
    }

    // Filter by mode (read/watch)
    if (mode === 'read') {
      // Use NewsAPI articles when in read mode
      filtered = newsArticles.length > 0 ? newsArticles : filtered.filter((item: { type: string; }) => item.type === 'text');
    } else if (mode === 'watch') {
      // Use YouTube videos when in watch mode
      filtered = youtubeVideos.length > 0 ? youtubeVideos : filtered.filter((item: { type: string; }) => item.type === 'video');
    }

    // Filter by category (only for fallback data, APIs handle category filtering)
    if (cat !== 'all' && ((mode === 'read' && newsArticles.length === 0) || (mode === 'watch' && youtubeVideos.length === 0))) {
      filtered = filtered.filter((item: { category: string; }) => item.category === cat);
    }

    return filtered;
  }, [cat, feedData, mode, youtubeVideos, newsArticles, weatherData]);

  const handleBookmark = (id: number) => {
    setFeedData((prev: any[]) => prev.map((item: { id: number; bookmarked: any; }) => item.id === id ? { ...item, bookmarked: !item.bookmarked } : item));
    showToast('Bookmark updated!');
  };

  const handlePlaceBet = (side: string, amount: { toLocaleString: () => any; }, potential: { toLocaleString: () => any; }) => {
    showToast(`🎯 Bet placed: ${side.toUpperCase()} Rs.${amount.toLocaleString()} → Rs.${potential.toLocaleString()}`);
  };

  // Render sub-views
  if (activeGame === 'wordle') return <WordleGame onBack={() => setActiveGame(null)} onWin={() => showToast('🎉 You won! +25 XP')} showToast={showToast} />;
  if (activeGame === 'connections') return <ConnectionsGame onBack={() => setActiveGame(null)} onWin={() => showToast('🎉 Perfect! +50 XP')} showToast={showToast} />;
  if (activeGame === 'numbers') return <NumbersGame onBack={() => setActiveGame(null)} onWin={() => showToast('🎉 Brilliant! +30 XP')} showToast={showToast} />;
  if (activeLesson) return <LessonView lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={() => { setActiveLesson(null); showToast('🎓 Lesson completed! +50 XP'); }} />;
  if (activeChallenge) return <FactCheckView challenge={activeChallenge} onBack={() => setActiveChallenge(null)} onComplete={() => setActiveChallenge(null)} />;
  if (activeDebate) return <DebateView topic={activeDebate} onBack={() => setActiveDebate(null)} />;
  if (activeDiscussion) return <DiscussionView topic={activeDiscussion} onBack={() => setActiveDiscussion(null)} showToast={showToast} />;

  return (
    <div className="h-screen w-full flex justify-center bg-gray-900 font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-black text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="text-emerald-400" />{toast}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedItem && (
        <>
          <CommentsSheet isOpen={commentsOpen} onClose={() => setCommentsOpen(false)} comments={selectedItem.comments} onAddComment={() => showToast('Comment posted!')} />
          <BetModal isOpen={betOpen} onClose={() => setBetOpen(false)} market={selectedItem.market} onPlaceBet={handlePlaceBet} />
        </>
      )}

      {/* App Container */}
      <div className="w-full max-w-md h-full bg-white shadow-2xl relative flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center z-40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">S</div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">SACH</h1>
              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">Truth Exchange</span>
            </div>
          </div>
          {tab === 'feed' && (
            <div className="flex bg-gray-100 p-1 rounded-full">
              <button onClick={() => setMode('read')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'read' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Read</button>
              <button onClick={() => setMode('watch')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'watch' ? 'bg-black shadow-sm text-white' : 'text-gray-400'}`}>Watch</button>
            </div>
          )}
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} className="text-gray-600" />
            <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">3</div>
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative bg-gray-50">
          {/* Feed */}
          {tab === 'feed' && (
            <>
              <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100 bg-white sticky top-0 z-30 scrollbar-hide">
                {CATEGORIES.map(c => {
                  const Icon = c.icon;
                  const count = c.id === 'all' ? feedData.length : feedData.filter((f: { category: string; }) => f.category === c.id).length;
                  return (
                    <button key={c.id} onClick={() => setCat(c.id)}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === c.id ? `bg-gradient-to-r ${c.color} text-white shadow-lg scale-105` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                      <Icon size={14} />{c.label}
                      {c.id !== 'all' && <span className="opacity-70">({count})</span>}
                    </button>
                  );
                })}
              </div>
              <div className="h-full overflow-y-auto pb-24">
                {(mode === 'read' && (loadingArticles || (cat === 'weather' && loadingWeather))) || (mode === 'watch' && loadingVideos) ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 size={48} className="text-violet-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-semibold">
                      {cat === 'weather' && mode === 'read' ? 'Loading weather data...' :
                        mode === 'read' ? 'Loading article...' : 'Loading videos from YouTube...'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {cat === 'weather' && mode === 'read' ? 'Fetching latest weather for Pakistani cities' :
                        mode === 'read' ? 'Fetching latest Pakistan news' : 'Fetching latest Pakistan videos'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="m-4 p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3"><Flame size={16} /><span className="text-xs font-bold uppercase opacity-80">Trending</span></div>
                        <h2 className="text-lg sm:text-xl font-bold leading-tight mb-4">Will Pakistan secure IMF tranche by March?</h2>
                        <div className="flex gap-3">
                          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl sm:text-3xl font-black">72%</div>
                            <div className="text-[10px] uppercase font-bold opacity-70">Yes</div>
                          </div>
                          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl sm:text-3xl font-black">28%</div>
                            <div className="text-[10px] uppercase font-bold opacity-70">No</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {filteredFeed.map((item: FeedItem) => (
                      <FeedCard key={item.id} data={item}
                        onComment={() => { setSelectedItem(item); setCommentsOpen(true); }}
                        onBet={() => { setSelectedItem(item); setBetOpen(true); }}
                        onBookmark={() => handleBookmark(item.id)} />
                    ))}
                    <div className="p-8 text-center text-gray-400 text-sm">
                      <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                      You're all caught up!
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Learn */}
          {tab === 'learn' && (
            <LearnHub onSelectLesson={setActiveLesson} onSelectChallenge={setActiveChallenge} onSelectDebate={setActiveDebate} onSelectDiscussion={setActiveDiscussion} />
          )}

          {/* Games */}
          {tab === 'games' && <GamesHub onSelectGame={setActiveGame} />}

          {/* Wallet */}
          {tab === 'wallet' && (
            <div className="h-full overflow-y-auto pb-24">
              <div className="m-4 p-5 sm:p-6 bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="text-gray-400 text-xs font-medium mb-1">Total Portfolio</div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1">Rs. {MOCK_USER.balance_pkr.toLocaleString()}</div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm mb-6"><ArrowUpRight size={16} /><span className="font-semibold">+12.4% this week</span></div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors active:scale-95"><CreditCard size={16} />Deposit</button>
                    <button className="bg-white/10 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors active:scale-95"><ArrowUpRight size={16} />Withdraw</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 px-4 mb-6">
                {[{ label: 'Win Rate', value: `${MOCK_USER.winRate}%`, icon: Target, color: 'text-emerald-500' }, { label: 'Active', value: MOCK_USER.activeBets, icon: Zap, color: 'text-amber-500' }, { label: 'Total', value: MOCK_USER.totalBets, icon: History, color: 'text-blue-500' }].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-3 sm:p-4 text-center border border-gray-100">
                    <s.icon size={18} className={`mx-auto mb-2 ${s.color}`} />
                    <div className="text-lg sm:text-xl font-black">{s.value}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-4">
                <h3 className="font-bold text-lg mb-4">Active Positions</h3>
                <div className="space-y-3">
                  {[{ q: '4-Day Work Week', cat: 'Politics', side: 'NO', price: 65, pnl: 12, amt: 5000, ends: 'Jan 31' },
                  { q: 'Shaheen PSL Opener', cat: 'Cricket', side: 'YES', price: 90, pnl: 8, amt: 2500, ends: '2 days' },
                  { q: 'USD/PKR 285', cat: 'Economy', side: 'YES', price: 60, pnl: -5, amt: 3000, ends: 'Fri 5PM' }].map((bet, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{bet.cat} • {bet.ends}</span>
                          <h4 className="font-semibold truncate">{bet.q}</h4>
                        </div>
                        <div className={`text-right shrink-0 ml-2 ${bet.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          <div className="font-bold text-lg flex items-center gap-1 justify-end">
                            {bet.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            {bet.pnl >= 0 ? '+' : ''}{bet.pnl}%
                          </div>
                          <div className="text-xs text-gray-400">Rs. {bet.amt.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${bet.side === 'YES' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {bet.side === 'YES' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{bet.side} @ {bet.price}¢
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {tab === 'profile' && (
            <div className="h-full overflow-y-auto pb-24">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 pb-16 text-white text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl sm:text-3xl font-black text-purple-600 shadow-xl border-4 border-white/50 relative">
                  {MOCK_USER.avatar}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-white"><CheckCircle2 size={12} className="text-white" /></div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">{MOCK_USER.name}</h2>
                <p className="text-white/70">{MOCK_USER.handle}</p>
              </div>
              <div className="px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-4 grid grid-cols-3 gap-3">
                  <div className="text-center p-2 sm:p-3 bg-emerald-50 rounded-xl"><div className="text-xl sm:text-2xl font-black text-emerald-600">{MOCK_USER.reputation}</div><div className="text-[10px] text-gray-500 font-semibold">Trust</div></div>
                  <div className="text-center p-2 sm:p-3 bg-amber-50 rounded-xl"><div className="text-xl sm:text-2xl font-black text-amber-600">{MOCK_USER.streak}🔥</div><div className="text-[10px] text-gray-500 font-semibold">Streak</div></div>
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-xl"><div className="text-xl sm:text-2xl font-black text-blue-600">{MOCK_USER.criticalThinkingScore}%</div><div className="text-[10px] text-gray-500 font-semibold">CT Score</div></div>
                </div>
                <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shrink-0"><Award size={24} className="text-white" /></div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 font-semibold uppercase">Current Rank</div>
                    <div className="text-lg sm:text-xl font-bold truncate">{MOCK_USER.rank}</div>
                    <div className="text-xs text-gray-500">Top 15% of predictors</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mt-6 mb-3">Achievements</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[{ emoji: '🏆', label: 'First Win', unlocked: true }, { emoji: '⚡', label: '10 Streak', unlocked: true }, { emoji: '💎', label: 'Diamond', unlocked: false }, { emoji: '🎯', label: '100 Bets', unlocked: false }].map((a, i) => (
                    <div key={i} className={`flex-shrink-0 w-16 sm:w-20 h-20 sm:h-24 rounded-xl flex flex-col items-center justify-center ${a.unlocked ? 'bg-white shadow-lg' : 'bg-gray-100 opacity-50'}`}>
                      <span className="text-2xl sm:text-3xl mb-1">{a.emoji}</span>
                      <span className="text-[10px] font-semibold text-gray-500 text-center px-1">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <nav className="bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center z-40 shrink-0 safe-area-pb">
          {[{ id: 'feed', icon: Home, label: 'Home' }, { id: 'learn', icon: GraduationCap, label: 'Learn' }, { id: 'games', icon: Gamepad2, label: 'Games' }, { id: 'wallet', icon: Wallet, label: 'Wallet' }, { id: 'profile', icon: User, label: 'Profile' }].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${tab === item.id ? 'text-black bg-gray-100' : 'text-gray-300 hover:text-gray-500'}`}>
              <item.icon size={22} strokeWidth={tab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-pb { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
}
