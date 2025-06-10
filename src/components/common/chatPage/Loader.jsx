import React from 'react';

const Loader = ({ type = 'chats' }) => {
  const loaderText = type === 'chats' ? 'Loading conversations' : 'Loading users';
  
  return (
    <div className="w-full p-5 flex flex-col items-center text-gray-600">

      <div className="flex gap-2 mb-5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div 
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500 opacity-70"
            style={{
              animation: 'pulse 1.5s infinite ease-in-out',
              animationDelay: `${delay}s`
            }}
          />
        ))}
      </div>
      

      <div className="text-base mb-6 flex items-center gap-1">
        {loaderText}
        <span className="animate-blink">|</span>
      </div>
      
      <div className="w-full max-w-md">
        {[...Array(type === 'chats' ? 3 : 5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 mb-3 rounded-xl bg-gray-50 overflow-hidden relative">


            <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-shimmer" />
            </div>
            

            <div className="flex-1 space-y-2">
              <div 
                className="h-3 rounded bg-gray-200 relative overflow-hidden"
                style={{ width: i % 2 ? '70%' : '90%' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-shimmer" />
              </div>
              <div 
                className="h-3 rounded bg-gray-200 relative overflow-hidden"
                style={{ width: i % 2 ? '50%' : '80%' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Loader;