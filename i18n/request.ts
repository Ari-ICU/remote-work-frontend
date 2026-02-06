import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/lib/locale';

export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    let messages;
    switch (locale) {
        case 'fr':
            messages = (await import('../messages/fr.json')).default;
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
