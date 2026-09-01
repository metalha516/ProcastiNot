import React, { useState } from 'react';
import {
  Users,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Clock,
  MessageSquare,
  LogOut,
  Send,
  Zap,
  Coffee,
  CheckCircle,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useTimer } from '../../context/TimerContext';
import { FocusRoomPeer } from '../../types';

export const VirtualFocusRooms: React.FC = () => {
  const { rooms, activeRoomId, joinRoom, leaveRoom } = useGamification();
  const { isRunning, mode, timeRemaining } = useTimer();

  const [activeChat, setActiveChat] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sarah Lin', text: 'Finishing the DP recurrence proof, 12 mins left!', time: '13:42' },
    { sender: 'Marcus Brody', text: 'Div 2 LeetCode problem C accepted! 🔥', time: '13:44' },
  ]);
  const [chatMessage, setChatMessage] = useState<string>('');

  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setActiveChat(prev => [
      ...prev,
      { sender: 'You (Alex)', text: chatMessage.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatMessage('');
  };

  const handleQuickReaction = (emojiText: string) => {
    setActiveChat(prev => [
      ...prev,
      { sender: 'You', text: emojiText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="stitch-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Virtual Focus Rooms & Peer Co-working
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Synchronized focus sessions with students worldwide. Study silently alongside peers with shared 40 Hz entrainment and mutual accountability.
            </p>
          </div>

          {activeRoomId && (
            <button
              type="button"
              onClick={leaveRoom}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Room</span>
            </button>
          )}
        </div>
      </div>

      {/* Room Directory Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map(room => {
          const isJoined = room.id === activeRoomId;
          return (
            <div
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className={`stitch-card rounded-2xl p-5 cursor-pointer transition-all border ${
                isJoined
                  ? 'border-violet-500/50 bg-gradient-to-b from-violet-950/20 to-[#191a1f] ring-1 ring-violet-500/30'
                  : 'stitch-card-hover border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                  {room.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {room.activeParticipants}/{room.maxParticipants} online
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{room.name}</h3>
              <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                {room.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                <span className="text-violet-400 font-mono text-[11px] flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  {room.soundscape}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isJoined ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {isJoined ? 'Active Room' : 'Join Session'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inside Active Room Display */}
      {currentRoom && (
        <div className="stitch-card rounded-2xl p-6 border-violet-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentRoom.name}</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  Synced Study Grid
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Audio Stream: 40 Hz Gamma Neural Entrainment + Silent Peer Presence
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121316] border border-white/10 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-neutral-300">Room Status:</span>
                <span className="text-white font-bold uppercase">{mode} ({Math.floor(timeRemaining / 60)}m left)</span>
              </div>
            </div>
          </div>

          {/* Peer Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Current User Tile */}
            <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/30 flex flex-col justify-between space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Alex Chen"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#191a1f]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Alex Chen (You)</span>
                    <span className="text-[10px] text-violet-400 font-semibold uppercase">Stanford</span>
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400">
                  <VolumeX className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block truncate">
                  CS161: Dynamic Programming Proofs
                </span>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                  <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Deep Work
                  </span>
                  <span className="text-neutral-400 flex items-center gap-1 font-mono">
                    <Flame className="w-3 h-3 text-amber-500" />
                    18d streak
                  </span>
                </div>
              </div>
            </div>

            {/* Other Peers in Room */}
            {currentRoom.peers.map(peer => (
              <div
                key={peer.id}
                className="p-4 rounded-xl bg-[#121316] border border-white/5 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-[#121316] ${
                        peer.status === 'focusing' || peer.status === 'deep_work'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{peer.name}</span>
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                        {peer.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-neutral-800 text-neutral-500">
                    <VolumeX className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-neutral-400 block truncate">
                    {peer.currentTask}
                  </span>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                    <span className="text-cyan-400 font-mono">
                      {Math.floor(peer.timeRemainingSeconds / 60)}m remaining
                    </span>
                    <span className="text-neutral-400 flex items-center gap-1 font-mono">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {peer.activeStreak}d
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reaction Cheers & Room Chat */}
          <div className="bg-[#121316] rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                <span>Peer Shoutouts & Quick Encouragement</span>
              </span>

              {/* Quick cheer buttons */}
              <div className="flex items-center gap-1.5">
                {[
                  '🚀 Deep Work Mode!',
                  '🔥 Keep the streak alive!',
                  '☕ Grab water & stretch',
                  '🧠 40Hz Locked In',
                ].map((reaction, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickReaction(reaction)}
                    className="hidden sm:inline-flex px-2 py-1 rounded-lg bg-neutral-800 hover:bg-violet-600/20 text-neutral-300 hover:text-violet-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat message feed */}
            <div className="space-y-1.5 max-h-28 overflow-y-auto mb-3 font-mono text-xs pr-1">
              {activeChat.map((msg, i) => (
                <div key={i} className="text-neutral-400 flex items-baseline gap-2">
                  <span className="text-neutral-600 text-[10px]">{msg.time}</span>
                  <span className="text-violet-300 font-medium font-sans">{msg.sender}:</span>
                  <span className="text-neutral-200">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Send a quiet cheer to study room peers..."
                className="flex-1 bg-[#191a1f] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
