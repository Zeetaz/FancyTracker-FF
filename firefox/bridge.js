// Bridge Content Script - Handles communication between MAIN world and background (Firefox Compatible)
if (typeof window.FancyTrackerBridgeLoaded === 'undefined') {
    window.FancyTrackerBridgeLoaded = true;

    (function() {
        'use strict';
        
        // Firefox compatibility: Use browser API if available, fallback to chrome
        const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
        
        // Safe message sending
        function sendMessageSafely(message) {
            if (!browserAPI.runtime || !browserAPI.runtime.id) return;
            
            try {
                browserAPI.runtime.sendMessage(message, function(response) {
                    if (browserAPI.runtime.lastError) {
                        console.error('FancyTracker: Bridge runtime error:', browserAPI.runtime.lastError.message);
                    }
                });
            } catch (error) {
                console.error('FancyTracker: Bridge exception:', error);
            }
        }

        // Listen for messages from the MAIN world content script
        window.addEventListener('message', function(event) {
            if (event.source === window && 
                event.data && 
                event.data.type === 'POSTMESSAGE_TRACKER_DATA') {
                
                sendMessageSafely(event.data.detail);
            }
        });

        // Track page changes
        window.addEventListener('beforeunload', function() {
            sendMessageSafely({changePage: true});
        });
        
        console.log('FancyTracker: Bridge initialized (Firefox compatible)');
    })();
}