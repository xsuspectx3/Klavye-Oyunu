
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center flex flex-col items-center">
      <h2 className="text-4xl font-bold text-indigo-700 mb-4">Oyuna Hoş Geldin!</h2>
      <p className="text-slate-600 mb-6 max-w-md">
        Yukarıdan düşen harfleri klavyende doğru tuşa basarak yok et. Harfler yere çarparsa, kırmızı tehlike bölgesi yükselir. Bölge tepeye ulaşmadan en yüksek skoru yap!
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-green-500 text-white font-bold text-2xl rounded-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-200"
      >
        Oyuna Başla
      </button>
    </div>
  );
};

export default StartScreen;
