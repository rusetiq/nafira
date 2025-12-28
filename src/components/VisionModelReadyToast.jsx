import { useEffect, useState } from 'react';

const getVisionHealthUrl = () => `http://${window.location.hostname}:5001/health`;
const STORAGE_KEY = 'vision_model_ready_toast_shown';

export default function VisionModelReadyToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '100') return;

    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;

      try {
        const res = await fetch(getVisionHealthUrl());
        if (!res.ok) {
          throw new Error('Health check failed');
        }
        const data = await res.json();

        if (data?.model_loaded) {
          if (!cancelled) {
            setVisible(true);
            localStorage.setItem(STORAGE_KEY, '1');
          }
          return;
        }
      } catch (e) {
        // Ignore and retry
      }

      if (!cancelled) {
        setTimeout(poll, 5000);
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl border border-white/10 bg-black/80 px-4 py-3 shadow-xl backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
        <div className="flex-1 text-sm text-white/90">
          <div className="font-semibold">RTQVLM is ready to process</div>
          <div className="mt-1 text-xs text-white/70">
            Device model has finished booting. Future meal analyses will be much faster.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-2 text-xs text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}


