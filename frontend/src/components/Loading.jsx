import React from 'react'
import { Loader2 } from 'lucide-react';


function Loading({ size = 'md', text }) {
    const spinnerSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-auto">
      <Loader2 className={`${spinnerSizes[size]} text-yt-primary animate-spin`} />
      {text && <p className="mt-2 text-sm text-yt-muted">{text}</p>}
    </div>
  );
}

export default Loading
