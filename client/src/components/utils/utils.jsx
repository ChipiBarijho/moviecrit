import { useState } from "react";

export const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };

    const show = () =>{
        if (text.length >= 600) {
            if (isReadMore) {
                return ' ...read more'
            } else {
                return ' show less'
            }
        }
    }

    return (
      <p className="text">
        {isReadMore ? text.slice(0, 600) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
            {show()}
        </span>
      </p>
    );
};