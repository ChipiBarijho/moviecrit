import React from 'react'
import './YoutubeTrailer.scss'
import OutsideClickHandler from 'react-outside-click-handler';
function YoutubeTrailer({youtubeId, setTrailer}) {
    return (
            <div className='YoutubeTrailer'>
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setTrailer(false)
                }}>
                <iframe
                    width="1461"
                    height="822"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                />
                </OutsideClickHandler>
            </div>
    )
}

export default YoutubeTrailer
