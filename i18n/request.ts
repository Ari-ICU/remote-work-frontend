import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/lib/locale';

export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    let messages;
    switch (locale) {
        case 'km':
            messages = (await import('../messages/km.json')).default;
            break;
        case 'en':
        default:
            messages = (await import('../messages/en.json')).default;
            break;
    }

    return {
        locale,
        messages
    };
});
