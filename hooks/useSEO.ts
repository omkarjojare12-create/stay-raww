
import { useEffect } from 'react';

const useSEO = (title: string, description: string, keywords: string) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && keywords) {
            metaKeywords.setAttribute('content', keywords);
        }
    }, [title, description, keywords]);
};

export default useSEO;
