import { useState, useEffect, useMemo } from 'react';

export default function useProductImages(imageIds) {
  const PLACEHOLDER_IMG = '/placeholder-image.jpg';

  const memImageIds = useMemo(() => {
    if (!imageIds) return [];
    return imageIds;
  }, [imageIds]);

  const [imageUrls, setImageUrls] = useState([]);
  const [isImagesLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchImageUrls = async () => {
      setIsLoading(true);

      if (!memImageIds || memImageIds.length === 0) {
        setImageUrls([PLACEHOLDER_IMG]);
        setIsLoading(false);
        return;
      }

      try {
        const urls = await Promise.all(
          memImageIds.map(async (id) => {
            try {
              const res = await fetch(
                  `http://localhost:5000/api/images/${id}`,
                  {signal: controller.signal}
              );
              if (!res.ok) return PLACEHOLDER_IMG;
              const data = await res.json();
              return data.url || PLACEHOLDER_IMG;
            } catch {
              return PLACEHOLDER_IMG;
            }
          })
        );

        const valid = urls.filter(u => u !== PLACEHOLDER_IMG);
        setImageUrls(valid.length > 0 ? valid : [PLACEHOLDER_IMG]);
      } catch {
        setImageUrls(['/placeholder-image.jpg']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUrls();

    return () => {
        controller.abort();
    };

  }, [memImageIds]);

  return { imageUrls, isImagesLoading };
}

