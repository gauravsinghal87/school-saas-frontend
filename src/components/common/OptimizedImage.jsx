import { useState } from "react";

const OptimizedImage = ({ src, alt, ...props }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative">
            {!loaded && <div className="blur-sm bg-gray-200 h-full w-full absolute" />}

            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;