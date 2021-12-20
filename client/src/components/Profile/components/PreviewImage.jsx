import './PreviewImage.scss'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeContext } from '../../../contexts/ThemeContext';


function PreviewImage({clickOnPhoto}) {
    const [previewImage, setPreviewImage] = useState(false)
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ aspect: 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [userContext, setUserContext] = useContext(UserContext)
    const [isSending, setIsSending] = useState(false)
    const inputPhotoRef = useRef(null);
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    useEffect(() => {
      if (clickOnPhoto) {
        inputPhotoRef.current.click();
        // console.log(inputPhotoRef.current.focus());
      }
        
    }, [clickOnPhoto]);
    
    const generateUpload = async (canvas, crop) => {
        setIsSending(true)
        if (!crop || !canvas) {
          return;
        }
        const base64Canvas = canvas.toDataURL("image/jpeg");
        // REACT_APP_CLOUDINARY_PRESET
        // REACT_APP_CLOUDINARY_CLOUD_NAME
        const data = {
            upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
            cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
            file: base64Canvas
        }
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, data)
        if (res.status === 200) {
            // res.data.url --> image uploaded url
            const addToDbRes = await axios.post(`/user/${userContext.currentUserId}/addProfilePhoto`, {imgUrl: res.data.url}, {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userContext.token}`}}) 
            if (addToDbRes.status === 200) {
                setIsSending(false)
                window.location.reload(false);
            }
        }
        
    }

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener('load', () => setUpImg(reader.result));
          reader.readAsDataURL(e.target.files[0]);
          setPreviewImage(true)
        }
        
    };
    
    const onLoad = useCallback((img) => {
    imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
    }, [completedCrop]);
    

    return (
        <div className='PreviewImage'>
            {userContext.token && 
                <div className='PreviewImage-edit-photo'>
                    {/* {showSpan && <span className='PreviewImage-edit-photo-span'>Change Photo</span>}
                    <label htmlFor="profilePic" onMouseEnter={()=>{setShowSpan(true)}}  onMouseLeave={()=>{setShowSpan(false)}} ></label> */}
                    
                    <input ref={inputPhotoRef} id="profilePic" type="file" onChange={onSelectFile} value=''/>
                </div>
                
            }
            {previewImage && <div className="PreviewImage-crop-window" style={isDarkMode ? {backgroundColor: '#141414'}: {backgroundColor: 'white'}}>
                <CloseIcon onClick={() => { setPreviewImage(false) }} className='NewMovie-container-closebtn' />
                <h2>Select area for profile photo</h2>
                <div className="PreviewImage-upload-button">
                    {isSending && <div><CircularProgress size={22} sx={{color: '#784BA0'}} /></div>}
                    
                    <button
                        type="button"
                        disabled={!completedCrop?.width || !completedCrop?.height || isSending}
                        onClick={() =>
                            generateUpload(previewCanvasRef.current, completedCrop)
                        }
                        style={isSending ? {opacity: '0.5'} : {opacity: '1'}}
                    >
                        Upload
                    </button>
                </div>
                <div className='PreviewImage-react-crop'>
                    <ReactCrop src={upImg} crop={crop} onChange={(c) => setCrop(c)}  onComplete={(c) => setCompletedCrop(c)} circularCrop={true} onImageLoaded={onLoad} 
                    maxWidth={200} 
                    maxHeight={200}
                    // minWidth={150}
                    // minHeight={150}
                    keepSelection={true} 
                    style={{maxWidth: '90%', margin: '20px 0'}}
                    />
                </div>
                <canvas
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                    }}
                />
               
            </div>}
        </div>
    )
}

export default PreviewImage
