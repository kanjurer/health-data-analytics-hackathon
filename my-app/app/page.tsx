'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useRouter } from 'next/navigation';
const proVaxTweets = [
  'Vaccines saved millions.',
  'Boosters helped my family stay safe.',
  'Trust the science — it works.',
  "Vaccines aren't perfect, but they're progress.",
];

const antiVaxTweets = [
  'This vaccine feels rushed.',
  'Too many side effects being ignored.',
  'Why are they forcing it?',
  'Natural immunity matters too.',
];

const NUM_DOTS = 120;

function generateHashtags(text: string) {
  const words = text
    .replace(/[^À-ſa-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter((w) => w.length > 3);
  const tags = words.slice(0, 2).map((word) => `#${word.toLowerCase()}`);
  return tags.join(' ');
}

export default function LandingPage() {
  const router = useRouter();
  const [tweet, setTweet] = useState<any>(null);
  const [isProNext, setIsProNext] = useState(true);
  const [dotColors, setDotColors] = useState<string[]>(
    Array(NUM_DOTS).fill('bg-blue-400')
  );

  const [dotPositions] = useState<{ top: string; left: string }[]>(
    Array.from({ length: NUM_DOTS }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const isPro = isProNext;
      const text = isPro
        ? proVaxTweets[Math.floor(Math.random() * proVaxTweets.length)]
        : antiVaxTweets[Math.floor(Math.random() * antiVaxTweets.length)];

      setTweet({
        text,
        isPro,
        timestamp: '1m ago',
        name: isPro ? 'Health Agency' : 'Anon Citizen',
        handle: isPro ? '@scienceforall' : '@freedomfirst',
        avatar: isPro
          ? 'https://i.pravatar.cc/40?img=8'
          : 'https://i.pravatar.cc/40?img=12',
      });

      const newColors = [...dotColors];
      const changeCount = Math.floor(NUM_DOTS * (0.1 + Math.random() * 0.1));
      const indices = Array.from({ length: NUM_DOTS }, (_, i) => i).sort(
        () => 0.5 - Math.random()
      );

      for (let i = 0; i < changeCount; i++) {
        newColors[indices[i]] = isPro ? 'bg-green-400' : 'bg-red-400';
      }

      setDotColors(newColors);
      setIsProNext((prev) => !prev);

      setTimeout(() => setTweet(null), 3000);
    }, 4000);

    return () => clearInterval(interval);
  }, [isProNext, dotColors]);

  return (
    <div className="relative flex flex-col justify-center items-center bg-white px-6 min-h-screen overflow-hidden font-sans text-black">
      {/* Glowing background overlays */}
      <motion.div
        className="top-0 left-0 z-0 absolute w-1/2 h-full"
        animate={{
          backgroundColor: tweet?.isPro ? 'rgba(34,197,94,0.2)' : 'transparent',
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="top-0 right-0 z-0 absolute w-1/2 h-full"
        animate={{
          backgroundColor:
            tweet && !tweet.isPro ? 'rgba(239,68,68,0.2)' : 'transparent',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating dots */}
      {dotPositions.map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${dotColors[i]} opacity-80`}
          style={{
            top: pos.top,
            left: pos.left,
          }}
          animate={{
            x: [0, Math.random() * 8 - 4, 0],
            y: [0, Math.random() * 8 - 4, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Syringe Image */}
      <motion.img
        src="https://wallpapers.com/images/hd/medical-syringe-icon-gurit84pxhwuelw5.png"
        alt="Syringe"
        className="z-30 mt-6 w-32 h-32 select-none"
        animate={{
          rotate: [0, -5, 5, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Title with stylized X */}
      <h1 className="z-30 drop-shadow mt-10 font-black text-8xl tracking-tight select-none">
        va
        <span className="text-[#1d9bf0] text-9xl align-middle">X</span>
        im
      </h1>

      {/* Tweet */}
      <AnimatePresence>
        {tweet && (
          <motion.div
            key="tweet"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`absolute top-1/2 -translate-y-1/2 w-96 bg-white border border-gray-300 rounded-2xl shadow-xl px-5 py-4 z-20 ${
              tweet.isPro ? 'left-6' : 'right-6'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={tweet.avatar}
                alt="avatar"
                className="rounded-full w-10 h-10"
              />
              <div>
                <p className="font-semibold text-base">{tweet.name}</p>
                <p className="text-gray-500 text-sm">
                  {tweet.handle} · {tweet.timestamp}
                </p>
              </div>
            </div>
            <div
              className={`text-[16px] leading-relaxed mb-3 font-medium ${
                tweet.isPro ? 'text-green-700' : 'text-red-700'
              }`}
            >
              <TypeAnimation
                sequence={[tweet.text]}
                speed={30}
                wrapper="span"
                repeat={0}
              />
            </div>
            <div className="flex flex-wrap gap-2 font-semibold text-blue-500 text-sm">
              {generateHashtags(tweet.text)
                .split(' ')
                .map((tag, idx) => (
                  <span key={idx}>{tag}</span>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="bottom-12 z-30 absolute flex flex-row justify-center gap-6 px-8 w-full">
        <button
          onClick={() => router.push('/start')}
          className="bg-gradient-to-r from-green-400 to-green-600 shadow-md hover:shadow-xl hover:brightness-110 px-8 py-4 rounded-full font-bold text-white text-xl transition-all duration-300"
        >
          Start
        </button>
        <button
          onClick={() => router.push('/runs')}
          className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-md hover:shadow-xl hover:brightness-110 px-8 py-4 rounded-full font-bold text-white text-xl transition-all duration-300"
        >
          Runs
        </button>
      </div>
    </div>
  );
}
