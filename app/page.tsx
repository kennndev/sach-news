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
  PlayCircle, CheckCircle, XCircle, ChevronDown, Mic, Plus, Minus, Copy, Loader2, ArrowLeft, Check, AlertTriangle
} from 'lucide-react';
import { fetchYouTubeVideos, getCategoryQuery, type YouTubeVideo } from '@/lib/youtube';
import { fetchNewsArticles, getNewsCategoryQuery, type NewsArticle } from '@/lib/newsapi';
import { fetchWeatherData, generateWeatherMarket, type WeatherData } from '@/lib/weather';
import { formatNumber, generateId, generateComments } from '@/lib/utils';
import { FeedItem, Lesson, CryptoModule } from '@/types';
import { MOCK_USER } from '@/data/mockUser';
import { WORDLE_WORDS, CONNECTIONS_PUZZLE, NUMBER_PUZZLES } from '@/data/games';
import { FACT_CHECKS } from '@/data/factChecks';
import { DEBATES } from '@/data/debates';
import { DISCUSSIONS } from '@/data/discussions';
import { LESSONS } from '@/data/lessons';
import { CRYPTO_MODULES } from '@/data/cryptoModules';

// ==================== CATEGORIES ====================
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Zap, color: 'from-violet-500 to-purple-600' },
  { id: 'politics', label: 'Politics', icon: Globe, color: 'from-blue-500 to-indigo-600' },
  { id: 'cricket', label: 'Cricket', icon: Trophy, color: 'from-green-500 to-emerald-600' },
  { id: 'economy', label: 'Economy', icon: Coins, color: 'from-amber-500 to-orange-600' },
  { id: 'tech', label: 'Tech', icon: Smartphone, color: 'from-cyan-500 to-blue-600' },
  { id: 'weather', label: 'Weather', icon: CloudRain, color: 'from-slate-500 to-gray-600' },
];



// ==================== COMPONENTS ====================

// Trust Badge
const TrustBadge = ({ score, onClick }: { score: number; onClick?: () => void }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`px-1.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-0.5 ${score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'
      } text-white hover:opacity-80 transition-opacity cursor-pointer`}>
    <Sparkles size={8} />{score}%
  </button>
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
            <h3 className="font-bold text-lg text-black">{title}</h3>
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

// Fact Check Modal
const FactCheckModal = ({ isOpen, onClose, article, result, loading }: { isOpen: boolean; onClose: () => void; article: any; result: any; loading: boolean }) => {
  if (!isOpen) return null;

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'verified': return 'text-emerald-600 bg-emerald-50';
      case 'partially-verified': return 'text-yellow-600 bg-yellow-50';
      case 'questionable': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'questionable': return <XCircle className="text-orange-500" size={16} />;
      default: return <HelpCircle className="text-gray-400" size={16} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Fact-Check">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[70vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
            <p className="text-gray-600 font-medium">Analyzing article...</p>
            <p className="text-sm text-gray-400 mt-1">Checking facts and sources</p>
          </div>
        ) : result ? (
          <>
            {/* Overall Verdict */}
            <div className={`p-4 rounded-xl ${getVerdictColor(result.overallVerdict)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} />
                <span className="font-bold text-sm uppercase">Overall Verdict</span>
              </div>
              <p className="font-bold text-lg capitalize">{result.overallVerdict.replace('-', ' ')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">Trust Score:</span>
                <span className="font-bold">{result.trustScore}%</span>
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Brain size={16} />
                AI Analysis
              </h4>
              <p className="text-sm text-gray-700">{result.analysis}</p>
            </div>

            {/* Key Claims */}
            {result.keyClaims && result.keyClaims.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Key Claims Verified
                </h4>
                <div className="space-y-2">
                  {result.keyClaims.map((claim: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(claim.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{claim.claim}</p>
                          <p className="text-xs text-gray-500 mt-1">{claim.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credible Sources */}
            {result.credibleSources && result.credibleSources.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Globe size={16} />
                  Credible Sources to Verify
                </h4>
                <div className="space-y-2">
                  {result.credibleSources.map((source: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="text-purple-600 shrink-0 mt-0.5" size={16} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{source.name}</p>
                            <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">
                              {source.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{source.relevance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-red-700">
                  <AlertTriangle size={16} />
                  Red Flags
                </h4>
                <ul className="space-y-1">
                  {result.redFlags.map((flag: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-blue-700">
                  <Lightbulb size={16} />
                  Recommendations
                </h4>
                <p className="text-sm text-blue-700">{result.recommendations}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Shield size={32} className="mx-auto mb-2 opacity-50" />
            <p>No fact-check results available</p>
          </div>
        )}
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
const FeedCard = ({ data, onComment, onBet, onBookmark, onFactCheck }: { data: any; onComment: () => void; onBet: (side: string) => void; onBookmark: () => void; onFactCheck?: () => void }) => {
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
                <TrustBadge score={data.ai_score} onClick={onFactCheck} />
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
        <h3 className="font-bold text-base sm:text-lg mb-2 leading-snug text-black">{data.headline}</h3>
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const content: string[] = lesson.content || [];
  const quizData = lesson.quiz || [];

  const handleQuizAnswer = (qIndex: number, aIndex: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...currentQuizAnswers];
    newAnswers[qIndex] = aIndex;
    setCurrentQuizAnswers(newAnswers);
  };

  const correctCount = currentQuizAnswers.filter((ans, idx) => ans === quizData[idx]?.correctAnswer).length;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="font-bold truncate flex-1 text-center px-4">{lesson.title}</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!showQuiz ? (
          <div className="space-y-6">
            {/* Lesson Header */}
            <div className="text-center py-4">
              <div className="text-6xl mb-4">{lesson.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
              <p className="text-sm text-gray-500">{lesson.topic} • {lesson.duration}</p>
              <p className="text-gray-600 mt-4">{lesson.description}</p>
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {content.map((paragraph: string, index: number) => (
                <div key={index} className={`p-4 rounded-xl ${index === 0 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                  <p className={`leading-relaxed ${index === 0 ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            {/* Continue to Quiz Button */}
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Brain size={20} />
              Take the Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain size={24} className="text-purple-600" />
              Knowledge Check
            </h2>

            {/* Quiz Questions */}
            {quizData.map((q: any, qIndex: number) => (
              <div key={qIndex} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-800">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt: string, oIndex: number) => {
                    const isSelected = currentQuizAnswers[qIndex] === oIndex;
                    const isCorrect = oIndex === q.correctAnswer;
                    const showResult = quizSubmitted;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        disabled={quizSubmitted}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${showResult && isCorrect ? 'border-green-500 bg-green-50' :
                          showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-50' :
                            isSelected ? 'border-indigo-500 bg-indigo-50' :
                              'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                            showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                              isSelected ? 'border-indigo-500 bg-indigo-500 text-white' :
                                'border-gray-300'
                            }`}>
                            {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + oIndex)}
                          </div>
                          <span className="text-sm">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-900">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Submit/Complete Buttons */}
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={currentQuizAnswers.length !== quizData.length}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="text-3xl mb-2">{correctCount === quizData.length ? '🎉' : '💪'}</div>
                  <p className="font-bold text-lg">{correctCount}/{quizData.length} Correct</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {correctCount === quizData.length ? 'Perfect!' : 'Review the explanations above.'}
                  </p>
                </div>
                <button
                  onClick={onComplete}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Complete Lesson (+{lesson.xp} XP)
                </button>
              </div>
            )}
          </div>
        )}
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
        <h3 className="text-lg font-bold mt-2 text-black">{topic.title}</h3>
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

// Crypto Lesson View
const CryptoLessonView = ({ module, lesson, onBack, onComplete }: { module: CryptoModule; lesson: any; onBack: () => void; onComplete: () => void }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const correctCount = quizSubmitted ? lesson.quiz.reduce((count: number, q: any, i: number) =>
    count + (quizAnswers[i] === q.correctAnswer ? 1 : 0), 0) : 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={24} /></button>
        <h2 className="font-bold text-lg">Crypto Learning</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!showQuiz ? (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="text-6xl mb-4">{module.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
              <p className="text-sm text-gray-500">{module.title} • {lesson.duration}</p>
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {lesson.content.map((paragraph: string, index: number) => (
                <div key={index} className={`p-4 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200' : 'bg-gray-50'}`}>
                  <p className={`leading-relaxed ${index === 0 ? 'text-purple-800 font-medium' : 'text-gray-700'}`}>
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Points */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-600" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {lesson.keyPoints.map((point: string, i: number) => (
                  <li key={i} className="text-amber-800 flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 mt-1 shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Continue to Quiz Button */}
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Brain size={20} />
              Test Your Knowledge
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain size={24} className="text-purple-600" />
              Knowledge Check
            </h2>

            {/* Quiz Questions */}
            {lesson.quiz.map((q: any, qIndex: number) => (
              <div key={qIndex} className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-800">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt: string, oIndex: number) => {
                    const isSelected = quizAnswers[qIndex] === oIndex;
                    const isCorrect = oIndex === q.correctAnswer;
                    const showResult = quizSubmitted;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        disabled={quizSubmitted}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${showResult && isCorrect ? 'border-green-500 bg-green-50' :
                          showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-50' :
                            isSelected ? 'border-purple-500 bg-purple-50' :
                              'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                            showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                              isSelected ? 'border-purple-500 bg-purple-500 text-white' :
                                'border-gray-300'
                            }`}>
                            {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + oIndex)}
                          </div>
                          <span className="text-sm">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-900">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Submit/Complete Buttons */}
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={quizAnswers.length !== lesson.quiz.length}
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700 transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="text-3xl mb-2">{correctCount === lesson.quiz.length ? '🎉' : '💪'}</div>
                  <p className="font-bold text-lg">{correctCount}/{lesson.quiz.length} Correct</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {correctCount === lesson.quiz.length ? 'Perfect! You\'ve mastered this lesson!' : 'Review the explanations above.'}
                  </p>
                </div>
                <button
                  onClick={onComplete}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Complete Lesson (+{lesson.xp} XP)
                </button>
              </div>
            )}
          </div>
        )}
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
        {[{ id: 'lessons', label: 'Lessons', icon: BookOpen }, { id: 'crypto', label: 'Crypto', icon: Coins }, { id: 'factcheck', label: 'Fact Check', icon: Shield }, { id: 'debate', label: 'Debate', icon: Scale }, { id: 'discuss', label: 'Discuss', icon: MessageCircle }].map(t => (
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
                <h3 className="text-xl font-bold mb-2 text-black">The Headline Trap 🎣</h3>
                <p className="text-sm opacity-90 mb-3">Why headlines don't always tell the full story</p>
                <button onClick={() => onSelectLesson(LESSONS[2])} className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-50 transition-colors">
                  <PlayCircle size={16} />Start Lesson
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-black">All Lessons</h3>
            {/* Media Literacy Lessons */}
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
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${lesson.stage === 'beginner' ? 'bg-green-100 text-green-700' : lesson.stage === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{lesson.stage}</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 shrink-0" />
              </button>
            ))}

            {/* Crypto Lessons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-lg text-black mb-4 flex items-center gap-2">
                <Coins size={20} className="text-purple-600" />
                Crypto Academy
              </h3>
            </div>
            {CRYPTO_MODULES.map(module => (
              <div key={module.id} className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <span className="text-2xl">{module.emoji}</span>
                  <div>
                    <h4 className="font-bold text-sm text-black">{module.title}</h4>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </div>
                {module.lessons.map(lesson => (
                  <button
                    key={`crypto-${module.id}-${lesson.id}`}
                    onClick={() => {
                      (window as any).selectCryptoLesson?.(module, lesson);
                    }}
                    className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 text-left hover:shadow-md transition-all mb-2"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                      {lesson.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-black truncate">{lesson.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span><Clock size={12} className="inline mr-1" />{lesson.duration}</span>
                        <span className="flex items-center gap-1">
                          <Coins size={12} />+{lesson.xp} XP
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${module.level === 'beginner' ? 'bg-green-100 text-green-700' :
                          module.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            module.level === 'advanced' ? 'bg-red-100 text-red-700' :
                              'bg-purple-100 text-purple-700'
                          }`}>
                          {module.level}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {tab === 'factcheck' && (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2"><Shield size={20} /><span className="font-bold">Fact Check Challenge</span></div>
              <p className="text-sm opacity-90">Can you spot the fake news? Test your skills!</p>
            </div>
            <h3 className="font-bold text-lg text-black">Today's Headlines</h3>
            {FACT_CHECKS.map((c, i) => (
              <button key={c.id} onClick={() => onSelectChallenge(c)} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1 leading-snug text-black">"{c.headline}"</h4>
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
                <h4 className="font-bold mt-2 text-black">{d.question}</h4>
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

        {tab === 'crypto' && (
          <>
            <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2"><Coins size={20} /><span className="font-bold">Crypto Academy</span></div>
              <p className="text-sm opacity-90">Master cryptocurrency from basics to security</p>
            </div>

            {CRYPTO_MODULES.map(module => (
              <div key={module.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{module.emoji}</div>
                  <div>
                    <h3 className="font-bold text-lg">{module.title}</h3>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${module.level === 'beginner' ? 'bg-green-100 text-green-700' :
                    module.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      module.level === 'advanced' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                    }`}>
                    {module.level.charAt(0).toUpperCase() + module.level.slice(1)}
                  </span>
                </div>

                {module.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => (window as any).selectCryptoLesson?.(module, lesson)}
                    className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-purple-700">
                        {lesson.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-black">{lesson.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span><Clock size={12} className="inline mr-1" />{lesson.duration}</span>
                          <span><Star size={12} className="inline mr-1" />{lesson.xp} XP</span>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-300 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// ==================== AI CHAT COMPANION ====================
const ChatCompanion = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Sach AI, your guide to this app! 👋 Ask me anything about features, learning modules, or crypto concepts!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const SUGGESTED_QUESTIONS = [
    "What features does this app have?",
    "How do I earn XP and level up?",
    "Tell me about the crypto learning modules",
    "How can I protect myself from crypto scams?",
    "What's the difference between hot and cold wallets?",
    "Explain blockchain technology simply",
    "What are the best practices for wallet security?",
    "How does the prediction market work?",
    "What are fact-check challenges?",
    "How do I play the games?"
  ];

  const messagesEndRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = { role: 'user' as const, content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Sorry, I encountered an error. Please try again! 😊',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again! 😊',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:w-[440px] h-full sm:h-[680px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Sach AI</h3>
              <p className="text-xs text-white/80">Your Learning Companion</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                : 'bg-gradient-to-br from-violet-100 to-purple-100 text-purple-600'
                }`}>
                {msg.role === 'user' ? MOCK_USER.avatar : <Sparkles size={16} />}
              </div>
              <div className={`flex-1 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                  }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                <Sparkles size={16} className="text-purple-600" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {showSuggestions && messages.length <= 1 && (
          <div className="p-4 bg-white border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 6).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full disabled:opacity-50 hover:from-purple-700 hover:to-indigo-700 transition-all disabled:hover:from-purple-600 disabled:hover:to-indigo-600 active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
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
  const [activeCryptoLesson, setActiveCryptoLesson] = useState<{ module: CryptoModule; lesson: any } | null>(null);

  // Chat companion state
  const [chatOpen, setChatOpen] = useState(false);

  // Fact-check states
  const [factCheckOpen, setFactCheckOpen] = useState(false);
  const [factCheckLoading, setFactCheckLoading] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<any>(null);
  const [factCheckArticle, setFactCheckArticle] = useState<any>(null);

  // Learn section state
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('completedLessons');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Save completed lessons to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
  }, [completedLessons]);

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

  const handleFactCheck = useCallback(async (article: any) => {
    setFactCheckArticle(article);
    setFactCheckOpen(true);
    setFactCheckLoading(true);
    setFactCheckResult(null);

    try {
      const response = await fetch('/api/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: article.headline,
          summary: article.summary,
          category: article.category
        })
      });

      const data = await response.json();

      if (data.success && data.result) {
        setFactCheckResult(data.result);
      } else {
        showToast('❌ Failed to perform fact-check');
        setFactCheckOpen(false);
      }
    } catch (error) {
      console.error('Fact-check error:', error);
      showToast('❌ Error performing fact-check');
      setFactCheckOpen(false);
    } finally {
      setFactCheckLoading(false);
    }
  }, [showToast]);

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
    setFeedData((prev: FeedItem[]) => prev.map((item: FeedItem) => item.id === id ? { ...item, bookmarked: !item.bookmarked } : item));
    showToast('Bookmark updated!');
  };

  const handlePlaceBet = (side: string, amount: { toLocaleString: () => any; }, potential: { toLocaleString: () => any; }) => {
    showToast(`🎯 Bet placed: ${side.toUpperCase()} Rs.${amount.toLocaleString()} → Rs.${potential.toLocaleString()}`);
  };

  // Expose selectCryptoLesson function to window for crypto lesson selection
  useEffect(() => {
    (window as any).selectCryptoLesson = (module: CryptoModule, lesson: any) => {
      setActiveCryptoLesson({ module, lesson });
    };
    return () => {
      delete (window as any).selectCryptoLesson;
    };
  }, []);

  // Render sub-views
  if (activeGame === 'wordle') return <WordleGame onBack={() => setActiveGame(null)} onWin={() => showToast('🎉 You won! +25 XP')} showToast={showToast} />;
  if (activeGame === 'connections') return <ConnectionsGame onBack={() => setActiveGame(null)} onWin={() => showToast('🎉 Perfect! +50 XP')} showToast={showToast} />;
  if (activeGame === 'numbers') return <NumbersGame onBack={() => setActiveGame(null)} onWin={() => showToast('🎉 Brilliant! +30 XP')} showToast={showToast} />;
  if (activeLesson) return <LessonView lesson={activeLesson} onBack={() => setActiveLesson(null)} onComplete={() => { setActiveLesson(null); showToast('🎓 Lesson completed! +50 XP'); }} />;
  if (activeChallenge) return <FactCheckView challenge={activeChallenge} onBack={() => setActiveChallenge(null)} onComplete={() => setActiveChallenge(null)} />;
  if (activeDebate) return <DebateView topic={activeDebate} onBack={() => setActiveDebate(null)} />;
  if (activeDiscussion) return <DiscussionView topic={activeDiscussion} onBack={() => setActiveDiscussion(null)} showToast={showToast} />;
  if (activeCryptoLesson) return <CryptoLessonView module={activeCryptoLesson.module} lesson={activeCryptoLesson.lesson} onBack={() => setActiveCryptoLesson(null)} onComplete={() => { setActiveCryptoLesson(null); showToast(`🎓 Crypto lesson completed! +${activeCryptoLesson.lesson.xp} XP`); }} />;

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

      {/* Fact Check Modal */}
      <FactCheckModal
        isOpen={factCheckOpen}
        onClose={() => setFactCheckOpen(false)}
        article={factCheckArticle}
        result={factCheckResult}
        loading={factCheckLoading}
      />

      {/* App Container */}
      <div className="w-full max-w-md h-full bg-white shadow-2xl relative flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center z-40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">S</div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-black">SACH</h1>
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
                  return (
                    <button key={c.id} onClick={() => setCat(c.id)}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === c.id ? `bg-gradient-to-r ${c.color} text-white shadow-lg scale-105` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                      <Icon size={14} />{c.label}
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
                        onBookmark={() => handleBookmark(item.id)}
                        onFactCheck={() => handleFactCheck(item)} />
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

          {/* Learn Section */}
          {tab === 'learn' && !activeLesson && (
            <div className="h-full overflow-y-auto pb-24">
              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 pb-8 text-white">
                <h1 className="text-2xl sm:text-3xl font-black mb-2">📚 Learn</h1>
                <p className="text-white/80 text-sm">Master media literacy & critical thinking</p>

                {/* Progress Overview */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Overall Progress</span>
                    <span className="text-sm font-bold">{completedLessons.length}/{LESSONS.length}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${(completedLessons.length / LESSONS.length) * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-black">{completedLessons.filter(id => LESSONS.find(l => l.id === id)?.stage === 'beginner').length}/4</div>
                      <div className="text-xs opacity-80">Beginner</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black">{completedLessons.filter(id => LESSONS.find(l => l.id === id)?.stage === 'intermediate').length}/4</div>
                      <div className="text-xs opacity-80">Intermediate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black">{completedLessons.filter(id => LESSONS.find(l => l.id === id)?.stage === 'advanced').length}/4</div>
                      <div className="text-xs opacity-80">Advanced</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons by Stage */}
              <div className="p-4 space-y-6">
                {/* Stage 1: Beginner */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-black text-green-600">1</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Fundamentals</h2>
                      <p className="text-xs text-gray-500">Start your learning journey</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {LESSONS.filter(l => l.stage === 'beginner').map(lesson => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className="w-full bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-green-300 transition-all text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{lesson.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold truncate">{lesson.title}</h3>
                                {isCompleted && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{lesson.topic}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={12} />{lesson.duration}</span>
                                <span className="flex items-center gap-1"><Award size={12} />{lesson.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stage 2: Intermediate */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-black text-blue-600">2</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Analysis</h2>
                      <p className="text-xs text-gray-500">Develop critical analysis skills</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {LESSONS.filter(l => l.stage === 'intermediate').map(lesson => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className="w-full bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-blue-300 transition-all text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{lesson.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold truncate">{lesson.title}</h3>
                                {isCompleted && <CheckCircle2 size={16} className="text-blue-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{lesson.topic}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={12} />{lesson.duration}</span>
                                <span className="flex items-center gap-1"><Award size={12} />{lesson.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stage 3: Advanced */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-black text-purple-600">3</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Expert Level</h2>
                      <p className="text-xs text-gray-500">Master advanced techniques</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {LESSONS.filter(l => l.stage === 'advanced').map(lesson => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className="w-full bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-purple-300 transition-all text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{lesson.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold truncate text-black">{lesson.title}</h3>
                                {isCompleted && <CheckCircle2 size={16} className="text-purple-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{lesson.topic}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={12} />{lesson.duration}</span>
                                <span className="flex items-center gap-1"><Award size={12} />{lesson.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Detail View */}
          {tab === 'learn' && activeLesson && (
            <div className="h-full overflow-y-auto pb-24">
              {/* Header */}
              <div className={`p-6 pb-8 text-white ${activeLesson.stage === 'beginner' ? 'bg-gradient-to-br from-green-600 to-emerald-700' :
                activeLesson.stage === 'intermediate' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' :
                  'bg-gradient-to-br from-purple-600 to-violet-700'
                }`}>
                <button
                  onClick={() => {
                    setActiveLesson(null);
                    setCurrentQuizAnswers([]);
                    setQuizSubmitted(false);
                  }}
                  className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-semibold">Back to Lessons</span>
                </button>
                <div className="text-4xl mb-3">{activeLesson.emoji}</div>
                <h1 className="text-2xl sm:text-3xl font-black mb-2">{activeLesson.title}</h1>
                <p className="text-white/80 text-sm mb-4">{activeLesson.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1"><Clock size={14} />{activeLesson.duration}</span>
                  <span className="flex items-center gap-1"><Award size={14} />{activeLesson.xp} XP</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">{activeLesson.stage}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-600" />
                    Lesson Content
                  </h2>
                  <div className="space-y-4">
                    {activeLesson.content.map((paragraph: string, index: number) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Quiz */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Brain size={20} className="text-purple-600" />
                    Knowledge Check
                  </h2>
                  <div className="space-y-6">
                    {activeLesson.quiz.map((question: any, qIndex: number) => (
                      <div key={qIndex} className="space-y-3">
                        <p className="font-semibold text-gray-800">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option: string, oIndex: number) => {
                            const isSelected = currentQuizAnswers[qIndex] === oIndex;
                            const isCorrect = oIndex === question.correctAnswer;
                            const showResult = quizSubmitted;

                            return (
                              <button
                                key={oIndex}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    const newAnswers = [...currentQuizAnswers];
                                    newAnswers[qIndex] = oIndex;
                                    setCurrentQuizAnswers(newAnswers);
                                  }
                                }}
                                disabled={quizSubmitted}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${showResult && isCorrect ? 'border-green-500 bg-green-50' :
                                  showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-50' :
                                    isSelected ? 'border-indigo-500 bg-indigo-50' :
                                      'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${showResult && isCorrect ? 'border-green-500 bg-green-500' :
                                    showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500' :
                                      isSelected ? 'border-indigo-500 bg-indigo-500' :
                                        'border-gray-300'
                                    }`}>
                                    {showResult && isCorrect && <Check size={14} className="text-white" />}
                                    {showResult && isSelected && !isCorrect && <X size={14} className="text-white" />}
                                    {isSelected && !showResult && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <span className="text-sm">{option}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-blue-900">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit/Complete Button */}
                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={currentQuizAnswers.length !== activeLesson.quiz.length}
                      className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="mt-6 space-y-3">
                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                        <div className="text-3xl mb-2">
                          {currentQuizAnswers.filter((ans, idx) => ans === activeLesson.quiz[idx].correctAnswer).length === activeLesson.quiz.length ? '🎉' : '💪'}
                        </div>
                        <p className="font-bold text-lg">
                          {currentQuizAnswers.filter((ans, idx) => ans === activeLesson.quiz[idx].correctAnswer).length}/{activeLesson.quiz.length} Correct
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentQuizAnswers.filter((ans, idx) => ans === activeLesson.quiz[idx].correctAnswer).length === activeLesson.quiz.length
                            ? 'Perfect score! You\'ve mastered this lesson!'
                            : 'Good effort! Review the explanations and try again.'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (!completedLessons.includes(activeLesson.id)) {
                            setCompletedLessons([...completedLessons, activeLesson.id]);
                            showToast(`🎉 Lesson completed! +${activeLesson.xp} XP`);
                          }
                          setActiveLesson(null);
                          setCurrentQuizAnswers([]);
                          setQuizSubmitted(false);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        Complete Lesson
                      </button>
                    </div>
                  )}
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

      {/* AI Chat Companion */}
      <ChatCompanion isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 animate-pulse"
        >
          <Sparkles size={24} />
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-pb { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
}
