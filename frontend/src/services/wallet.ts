
import { showConnect } from '@stacks/connect';

export function connectWallet() {
    showConnect({
        appDetails: {
            name: 'Pools Platform',
            icon: window.location.origin + '/favicon.ico',
        },
        manifestPath: '/manifest.json',
        redirectTo: '/',
        scopes: ['store_write', 'publish_data'],
        onFinish: () => {
            window.location.reload();
        },
        onCancel: () => {
            // Optionally show a message or handle cancel
        },
    });
}
