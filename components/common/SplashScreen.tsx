
import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes glare {
                    0% { transform: translateX(-150%) skewX(-30deg); }
                    100% { transform: translateX(250%) skewX(-30deg); }
                }
                
                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
                .animate-fadeUp { animation: fadeUp 0.8s ease-out forwards; opacity: 0; }
                
                .glare-effect::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
                    animation: glare 2.5s infinite;
                    animation-delay: 1.2s;
                }
            `}</style>
            <div className="fixed inset-0 bg-zinc-900 flex flex-col items-center justify-center z-[100] text-white animate-fadeIn">
                <div className="text-center">
                    <h1 
                        className="relative overflow-hidden text-5xl md:text-6xl font-extrabold tracking-wider text-white animate-fadeUp glare-effect"
                        style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}
                    >
                        STAY RAW
                    </h1>
                    <p 
                        className="text-lg text-slate-300 mt-2 animate-fadeUp"
                        style={{ animationFillMode: 'forwards', animationDelay: '0.6s' }}
                    >
                        Unleash Your Potential
                    </p>
                </div>
            </div>
        </>
    );
};

export default SplashScreen;
