import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react';

export const SuccesToastMessage = ( type = 'success',
  title = '',
  message = '',
  duration = 3000,
  onClose = () => {},
) => {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // Trigger enter animation
        const enterTimer = setTimeout(() => setVisible(true), 10);

        if (duration > 0) {
        const interval = setInterval(() => {
            setProgress((prev) => {
            const next = prev - 100 / (duration / 50);
            return next <= 0 ? 0 : next;
            });
        }, 50);

        const exitTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(enterTimer);
            clearInterval(interval);
            clearTimeout(exitTimer);
        };
        }

        return () => clearTimeout(enterTimer);
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    // Type config
    const config =
        type === 'error'
        ? {
            icon: XCircle,
            accent: 'bg-error',
            text: 'text-error',
            border: 'border-error/40',
            }
        : {
            icon: CheckCircle,
            accent: 'bg-success',
            text: 'text-success',
            border: 'border-success/40',
            };

    const Icon = config.icon;

    return (
    <div className={`
            fixed top-4 left-4 right-4 min-[500px]:left-auto min-[500px]:right-6 min-[500px]:w-90
            transition-all duration-300 z-50
            ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
        `}>
        <div className={`
            relative bg-yt-surface border ${config.border}
            rounded-xl shadow-xl overflow-hidden
            `}>
            <div className="p-4 flex gap-3 items-start">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${config.accent}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {title && (
                    <h4 className="text-sm font-semibold text-yt-text truncate">
                        {title}
                    </h4>
                    )}
                    {message && (
                    <p className="text-xs text-yt-muted mt-1 line-clamp-2">
                        {message}
                    </p>
                    )}
                </div>

                {/* Close */}
                <button
                    onClick={handleClose}
                    className="text-yt-muted hover:text-yt-text transition">
                    <X size={18} />
                </button>
            </div>

            {/* Progress */}
            {duration > 0 && (
            <div className="h-1 bg-yt-border/20">
                <div
                className={`h-full ${config.accent} transition-all duration-50`}
                style={{ width: `${progress}%` }}/>
            </div>
        )}
        </div>
    </div>
  );
};

export default SuccesToastMessage


