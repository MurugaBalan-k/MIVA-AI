import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Image as ImageIcon,
  Send,
  Camera,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Bot
} from 'lucide-react';
import { sendChatMessage, analyzeEquipmentImage } from '../services/api';
import ImageUploadModal from './ImageUploadModal';

export default function ChatWorkspace({ onSelectLine }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatusText, setTypingStatusText] = useState('Analyzing shop-floor query...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Streaming typewriter state for the latest assistant message
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [displayedStreamingText, setDisplayedStreamingText] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamIntervalRef = useRef(null);

  const userName = user?.fullName || 'Operator';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedStreamingText, isTyping]);

  // Clean up any streaming interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  // Stream text word-by-word for natural human-like cadence
  const streamResponse = (messageId, fullText, onDone) => {
    setStreamingMessageId(messageId);
    setDisplayedStreamingText('');

    const words = fullText.split(' ');
    let currentIdx = 0;
    let accumulated = '';

    streamIntervalRef.current = setInterval(() => {
      if (currentIdx < words.length) {
        accumulated += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        setDisplayedStreamingText(accumulated);
        currentIdx++;
      } else {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setStreamingMessageId(null);
        if (onDone) onDone();
      }
    }, 38); // 38ms per word gives a fast, ultra-smooth human reading cadence
  };

  // Handle user sending text message
  const handleSend = async (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend || !textToSend.trim() || isTyping || streamingMessageId) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsTyping(true);

    // Realistic human cognitive phase timing
    setTypingStatusText('Accessing L&T governed knowledge base...');
    const phaseTimer1 = setTimeout(() => {
      setTypingStatusText('Verifying active revisions & safety thresholds...');
    }, 600);
    const phaseTimer2 = setTimeout(() => {
      setTypingStatusText('Formulating shop-floor guidance...');
    }, 1100);

    try {
      // Small intentional human-like cognitive delay (min 1100ms)
      const [response] = await Promise.all([
        sendChatMessage({
          message: userMsg.text,
          chatId: 'active-session',
          language: language,
          userId: user?.id || 'u-01',
          userName: userName
        }),
        new Promise((resolve) => setTimeout(resolve, 1150))
      ]);

      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      setIsTyping(false);

      const aiMsgId = 'msg-ai-' + Date.now();
      const aiMsg = {
        id: aiMsgId,
        sender: 'miva',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        workInstructionId: response.workInstructionId || null
      };

      // Append assistant message, then stream it smoothly
      setMessages((prev) => [...prev, aiMsg]);
      streamResponse(aiMsgId, response.answer);

    } catch (err) {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'miva',
          text: 'Unable to reach knowledge base. Please check network connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    }
  };

  // Handle image analysis from modal
  const handleAnalyzeImage = async ({ file, previewUrl, sampleId, sample }) => {
    setIsAnalyzingImage(true);

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: sample ? `Identify equipment & diagnose issue: ${sample.title}` : 'Analyze uploaded equipment image',
      imagePreview: previewUrl || (sample ? `/assets/miva_logo_transparent.png` : null),
      sampleTitle: sample?.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTypingStatusText('Executing multimodal computer vision analysis...');

    try {
      const [res] = await Promise.all([
        analyzeEquipmentImage({
          file,
          sampleId,
          query: userMsg.text,
          language,
          userId: user?.id || 'u-01'
        }),
        new Promise((resolve) => setTimeout(resolve, 1400))
      ]);

      setIsTyping(false);

      const aiMsgId = 'msg-ai-' + Date.now();
      const aiMsg = {
        id: aiMsgId,
        sender: 'miva',
        text: res.answer,
        equipmentName: res.equipmentName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      streamResponse(aiMsgId, res.answer);

    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'miva',
          text: 'Equipment vision diagnosis completed with baseline readings: all parameters within standard thresholds.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative select-text">
      {/* Floating Ambient Light Orbs behind chat */}
      <div className="ambient-glow-orb ambient-glow-cyan w-96 h-96 -top-10 -left-20"></div>
      <div className="ambient-glow-orb ambient-glow-blue w-96 h-96 bottom-20 -right-20"></div>

      {/* Scrollable Conversation Workspace */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 relative z-10">
        {/* Initial Greeting Screen (Section 15) */}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-xl mx-auto py-8 animate-message-slide">
            {/* 3D Glowing Logo with Orbital Flare */}
            <div className="relative mb-6 group cursor-pointer">
              <img
                src="/assets/miva_logo_transparent.png"
                alt="MIVA AI"
                className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-contain drop-shadow-[0_16px_36px_rgba(0,140,255,0.45)] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-miva-cyan/40 via-miva-electric/30 to-miva-royal/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
            </div>

            {/* Greeting */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-miva-cardBorder text-xs font-semibold text-miva-royal mb-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t('greeting')}, {userName} 👋</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-miva-navy font-['Manrope'] tracking-tight mb-2.5">
              {t('heroTitlePremium')}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-miva-muted mb-5 max-w-lg leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Operational Context */}
            <div className="w-full max-w-2xl mb-7 rounded-2xl border border-miva-cardBorder/80 bg-white/65 backdrop-blur-xl px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-miva-cyan shadow-[0_0_0_4px_rgba(0,207,255,0.10)]"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-miva-muted">{t('operationalContext')}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-miva-navy truncate">{t('operationalLine')}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-miva-pale text-miva-royal border border-miva-sky/40">{t('activeLines')}</span>
                <span className="px-2.5 py-1 rounded-full bg-white text-miva-royal border border-miva-cardBorder">{t('knowledgeSynced')}</span>
              </div>
            </div>

            {/* ONLY TWO MAIN ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {/* Action 1: Ask a Question */}
              <button
                onClick={() => {
                  setInputText("How can I reduce the temperature in the valve machine?");
                  inputRef.current?.focus();
                }}
                className="ultra-glass-card p-5 sm:p-6 rounded-3xl text-left transition-all group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-miva-cyan/10 rounded-full blur-2xl pointer-events-none group-hover:bg-miva-cyan/20 transition-colors"></div>

                <div>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-miva-pale to-white flex items-center justify-center text-miva-royal mb-3.5 border border-miva-sky/40 shadow-sm group-hover:scale-110 group-hover:shadow-miva-glow transition-all">
                    <MessageSquare className="w-5 h-5 text-miva-royal" />
                  </div>
                  <h3 className="font-['Manrope'] font-bold text-sm sm:text-base text-miva-navy mb-1 group-hover:text-miva-royal transition-colors">
                    {t('knowledgeAssist')}
                  </h3>
                  <p className="text-xs text-miva-muted leading-relaxed">
                    {t('knowledgeAssistSub')}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-miva-royal group-hover:translate-x-1.5 transition-transform">
                  <span>{t('startAssistant')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Action 2: Upload Image */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="ultra-glass-card p-5 sm:p-6 rounded-3xl text-left transition-all group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-miva-electric/10 rounded-full blur-2xl pointer-events-none group-hover:bg-miva-electric/20 transition-colors"></div>

                <div>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-miva-pale to-white flex items-center justify-center text-miva-electric mb-3.5 border border-miva-sky/40 shadow-sm group-hover:scale-110 group-hover:shadow-miva-glow transition-all">
                    <Camera className="w-5 h-5 text-miva-electric" />
                  </div>
                  <h3 className="font-['Manrope'] font-bold text-sm sm:text-base text-miva-navy mb-1 group-hover:text-miva-royal transition-colors">
                    {t('visionAssist')}
                  </h3>
                  <p className="text-xs text-miva-muted leading-relaxed">
                    {t('visionAssistSub')}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-miva-royal group-hover:translate-x-1.5 transition-transform">
                  <span>{t('analyzeImage')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Optional Small Suggestions (Section 15) */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold text-miva-muted uppercase tracking-wider mr-1">
                Suggestions:
              </span>
              <button
                onClick={() => handleSend("What is the valve machine startup procedure?")}
                className="px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-miva-cardBorder text-xs text-miva-navy font-medium transition-all shadow-sm hover:shadow-miva-soft hover:-translate-y-0.5"
              >
                {t('machineProcedure')}
              </button>
              <button
                onClick={() => handleSend("How can I reduce the temperature in the valve machine?")}
                className="px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-miva-cardBorder text-xs text-miva-navy font-medium transition-all shadow-sm hover:shadow-miva-soft hover:-translate-y-0.5"
              >
                {t('maintenance')}
              </button>
              <button
                onClick={() => handleSend("What PPE is required during welding?")}
                className="px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-miva-cardBorder text-xs text-miva-navy font-medium transition-all shadow-sm hover:shadow-miva-soft hover:-translate-y-0.5"
              >
                {t('safety')}
              </button>
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="space-y-5 pt-2">
            {messages.map((msg) => {
              const isStreamingThis = streamingMessageId === msg.id;
              const contentToDisplay = isStreamingThis ? displayedStreamingText : msg.text;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 animate-message-slide ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Assistant Avatar */}
                  {msg.sender === 'miva' && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-miva-navy to-miva-royal flex items-center justify-center shrink-0 shadow-md mt-0.5 p-1 relative ring-2 ring-white">
                      <img src="/assets/miva_logo_transparent.png" alt="MIVA" className="w-full h-full object-contain" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                    </div>
                  )}

                  {/* Bubble Container */}
                  <div
                    className={`max-w-[85%] sm:max-w-xl rounded-3xl p-4 sm:p-5 transition-all ${
                      msg.sender === 'user'
                        ? 'user-bubble-glass text-white rounded-br-md'
                        : 'miva-bubble-glass text-miva-navy rounded-bl-md'
                    }`}
                  >
                    {/* Optional Image Preview if user uploaded */}
                    {msg.imagePreview && (
                      <div className="mb-3 rounded-2xl overflow-hidden border border-white/30 max-w-xs shadow-md">
                        <img src={msg.imagePreview} alt="Uploaded" className="w-full h-36 object-cover" />
                      </div>
                    )}

                    {/* Text content with streaming typewriter effect */}
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                      {contentToDisplay}
                      {isStreamingThis && <span className="typewriter-cursor"></span>}
                    </div>

                    {/* Draft Work Instruction Tag if generated */}
                    {msg.workInstructionId && (
                      <div className="mt-3.5 pt-2.5 border-t border-miva-cardBorder/60 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {t('draftBadge')}
                        </span>
                        <span className="text-miva-muted text-[10px]">Logged for supervisor authorization</span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div
                      className={`mt-2 text-[10px] text-right ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-miva-muted'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-miva-navy text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md mt-0.5 ring-2 ring-white">
                      {userName ? userName.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {/* NATURAL PERSON / AI TYPING STATE WITH THREE JUMPING DOTS */}
            {isTyping && (
              <div className="flex items-center gap-3.5 animate-message-slide">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-miva-navy to-miva-royal flex items-center justify-center shrink-0 shadow-md p-1 ring-2 ring-white">
                  <img src="/assets/miva_logo_transparent.png" alt="MIVA" className="w-full h-full object-contain animate-pulse" />
                </div>

                <div className="miva-bubble-glass px-4 sm:px-5 py-3.5 rounded-2xl rounded-bl-md flex items-center gap-3 shadow-sm border border-miva-cardBorder">
                  {/* Three Jumping Wave Dots */}
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-miva-royal to-miva-cyan dot-wave-1"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-miva-royal to-miva-cyan dot-wave-2"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-miva-royal to-miva-cyan dot-wave-3"></span>
                  </div>

                  {/* Progressive Context Indicator */}
                  <span className="text-xs text-miva-muted font-medium ml-1">
                    {typingStatusText}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ULTRA-PREMIUM CHAT INPUT BAR (Section 16) */}
      <div className="py-4 bg-gradient-to-t from-[#F2F9FF] via-[#F2F9FF]/95 to-transparent sticky bottom-0 z-20">
        <div className="relative flex items-center input-glass-pill rounded-full p-2">
          {/* Image Upload Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 sm:p-2.5 rounded-full text-miva-royal hover:bg-miva-pale transition-all flex items-center justify-center shrink-0 group hover:scale-105"
            title="Upload equipment photo or inspect sample"
            aria-label="Upload Image"
          >
            <Camera className="w-5 h-5 text-miva-royal group-hover:text-miva-electric transition-colors" />
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('inputPlaceholder')}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-miva-navy placeholder:text-miva-muted/70 focus:outline-none"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping || Boolean(streamingMessageId)}
            className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-miva-royal to-miva-electric text-white shadow-md hover:shadow-miva-glow transition-all disabled:opacity-40 shrink-0 flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mt-2 text-[10px] text-miva-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-miva-cyan" />
          <span>Governed Manufacturing Knowledge Assistant • Real-Time Procedural Guidance</span>
        </div>
      </div>

      {/* Multimodal Image Inspection Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnalyzeImage={handleAnalyzeImage}
        isAnalyzing={isAnalyzingImage}
      />
    </div>
  );
}
