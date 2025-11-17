
import React, { useState, useEffect } from 'react';
import { VAPID_PUBLIC_KEY } from '../constants';

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


const NotificationManager: React.FC = () => {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
        }
        
        navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.getSubscription().then(subscription => {
                if(subscription) {
                    setIsSubscribed(true);
                }
            });
        });

    }, []);

    const subscribeUser = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setError("Push messaging is not supported.");
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission === 'granted') {
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();
                
                if (existingSubscription) {
                    setIsSubscribed(true);
                    console.log('User is already subscribed.');
                    return;
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                });
                
                console.log('User is subscribed:', subscription);
                // In a real app, you would send this subscription object to your backend server
                // await sendSubscriptionToServer(subscription);
                setIsSubscribed(true);
                setError(null);
            } else {
                setError("Notification permission denied.");
            }
        } catch (err) {
            console.error('Failed to subscribe the user: ', err);
            setError('Failed to subscribe for notifications.');
        }
    };

    const getButtonContent = () => {
        if (permissionStatus === 'denied') {
            return { text: 'বিজ্ঞপ্তি ব্লক করা আছে', disabled: true };
        }
        if (isSubscribed) {
            return { text: '🔔 আপডেট সক্রিয় আছে', disabled: true };
        }
        if (permissionStatus === 'granted' && !isSubscribed) {
             return { text: 'সাবস্ক্রাইব করতে ব্যর্থ', disabled: false };
        }
        return { text: '🔔 অগ্রগতি আপডেট পান', disabled: false };
    }

    const { text, disabled } = getButtonContent();

    return (
        <div className="text-center mt-4">
            <button
                onClick={subscribeUser}
                disabled={disabled}
                className="w-full py-3 bg-fuchsia-600 text-white font-bold text-lg rounded-lg btn-neon transition-all hover:bg-fuchsia-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
                {text}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default NotificationManager;