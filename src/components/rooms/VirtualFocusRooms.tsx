import React, { useState } from 'react';
import {
  Users,
  Radio,
  VolumeX,
  Clock,
  MessageSquare,
  LogOut,
  Send,
  Flame,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useTimer } from '../../context/TimerContext';
import { useAuth } from '../../context/AuthContext';

export const VirtualFocusRooms: React.FC = () => {
  const { rooms, activeRoomId, joinRoom, leaveRoom, streak } = useGamification();
  const { mode, timeRemaining } = useTimer();
  const { user } = useAuth();

  const [activeChat, setActiveChat] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sarah Lin', text: 'Finishing the DP recurrence proof, 12 mins left!', time: '13:42' },
    { sender: 'Marcus Brody', text: 'Div 2 LeetCode problem C accepted! 🔥', time: '13:44' },
  ]);
  const [chatMessage, setChatMessage] = useState<string>('');

  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const myName = user?.name ? user.name.split(' ')[0] : 'You';
    setActiveChat(prev => [
      ...prev,
      { sender: `You (${myName})`, text: chatMessage.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
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
    <div className="flex flex-col w-full gap-6 select-none max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-emerald-500" />
              <h1 className="font-headline-md text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Virtual Focus Rooms & Peer Co-working
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Synchronized study sessions with students worldwide. Study silently alongside peers with shared 40 Hz entrainment and mutual accountability.
            </p>
          </div>

          {activeRoomId && (
            <button
              type="button"
              onClick={leaveRoom}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl clay-btn-light text-red-600 dark:text-red-400 font-telemetry-sm text-xs font-bold cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          )}
        </div>
      </div>

      {/* Room Directory Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {rooms.map(room => {
          const isJoined = room.id === activeRoomId;
          return (
            <div
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className={`clay-card rounded-3xl p-6 cursor-pointer transition-all border ${
                isJoined
                  ? 'ring-2 ring-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-white/80 dark:border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-telemetry-sm text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full clay-pill text-slate-700 dark:text-slate-300">
                  {room.category}
                </span>
                <span className="flex items-center gap-1.5 font-telemetry-sm text-xs text-slate-600 dark:text-slate-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {room.activeParticipants}/{room.maxParticipants} online
                </span>
              </div>

              <h3 className="font-headline-sm text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
                {room.name}
              </h3>
              <p className="font-body-md text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                {room.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="font-telemetry-sm text-[11px] text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  {room.soundscape}
                </span>
                <span className={`font-telemetry-sm text-xs font-bold px-3 py-1.5 rounded-2xl ${
                  isJoined ? 'clay-btn-primary text-white' : 'clay-btn-light text-slate-700 dark:text-slate-300'
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
        <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {currentRoom.name}
                </h2>
                <span className="font-telemetry-sm px-2.5 py-0.5 rounded-full clay-pill text-emerald-600 dark:text-emerald-400 text-xs font-extrabold">
                  Synced Grid
                </span>
              </div>
              <p className="font-body-md text-xs text-slate-500 font-medium mt-0.5">
                Audio Stream: 40 Hz Gamma Neural Entrainment + Silent Peer Presence
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl clay-inset font-telemetry-sm text-xs font-bold">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-slate-500">Room Status:</span>
                <span className="text-slate-900 dark:text-slate-100 uppercase">{mode} ({Math.floor(timeRemaining / 60)}m left)</span>
              </div>
            </div>
          </div>

          {/* Peer Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Current User Tile */}
            <div className="p-4 rounded-3xl clay-card-subtle flex flex-col justify-between space-y-3 border-2 border-orange-500/40 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt={user?.name || "You"}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-orange-500"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div>
                    <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {user?.name || 'Alex Chen'} (You)
                    </span>
                    <span className="font-telemetry-sm text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase">
                      {user?.institution || 'Stanford'}
                    </span>
                  </div>
                </div>
                <div className="p-1.5 rounded-xl clay-pill text-slate-400">
                  <VolumeX className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="font-headline-sm text-xs text-slate-700 dark:text-slate-300 font-medium block truncate">
                  CS161: Dynamic Programming Proofs
                </span>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 font-telemetry-sm text-[10px] font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Deep Work
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {streak}d streak
                  </span>
                </div>
              </div>
            </div>

            {/* Other Peers in Room */}
            {currentRoom.peers.map(peer => (
              <div
                key={peer.id}
                className="p-4 rounded-3xl clay-card-subtle flex flex-col justify-between space-y-3 border border-white/60 dark:border-white/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-10 h-10 rounded-2xl object-cover"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        peer.status === 'focusing' || peer.status === 'deep_work'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`} />
                    </div>
                    <div>
                      <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-slate-100 block">{peer.name}</span>
                      <span className="font-telemetry-sm text-[10px] text-slate-400 font-bold uppercase">
                        {peer.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-xl clay-pill text-slate-400">
                    <VolumeX className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="font-headline-sm text-xs text-slate-700 dark:text-slate-300 font-medium block truncate">
                    {peer.currentTask}
                  </span>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 font-telemetry-sm text-[10px] font-bold">
                    <span className="text-orange-600 dark:text-orange-400">
                      {Math.floor(peer.timeRemainingSeconds / 60)}m left
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {peer.activeStreak}d
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Peer Shoutouts & Room Chat */}
          <div className="clay-inset rounded-2xl p-4 border border-white/60 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline-sm text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span>Peer Shoutouts & Quick Encouragement</span>
              </span>

              <div className="flex items-center gap-1.5">
                {[
                  '🚀 Deep Work Mode!',
                  '🔥 Keep streak alive!',
                  '☕ Hydrate & stretch',
                  '🧠 40Hz Locked In',
                ].map((reaction, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickReaction(reaction)}
                    className="hidden sm:inline-flex px-3 py-1 rounded-xl clay-pill text-slate-700 dark:text-slate-300 font-telemetry-sm text-[11px] font-bold cursor-pointer"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-28 overflow-y-auto mb-3 font-telemetry-sm text-xs pr-1">
              {activeChat.map((msg, i) => (
                <div key={i} className="text-slate-600 dark:text-slate-400 flex items-baseline gap-2">
                  <span className="text-slate-400 text-[10px]">{msg.time}</span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">{msg.sender}:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{msg.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Send a quiet cheer to study room peers..."
                className="flex-1 clay-card-subtle rounded-2xl px-4 py-2.5 font-body-md text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl clay-btn-primary text-white font-headline-sm text-xs font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

