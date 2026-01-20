import React from 'react';


const LoadingOverlay = ({ message = 'Processing...', progress = null, isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto px-4">
        <div className="relative">
          <div className="loading-spinner"></div>
          {progress !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold data-text">{progress}%</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{message}</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we process your request
          </p>
        </div>

        {progress !== null && (
          <div className="w-full max-w-xs">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-350"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;