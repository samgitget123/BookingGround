import html2canvas from 'html2canvas';
import { uploadImageToServer } from './Uploadimage';
export const CaptureandShare = () => {
  const modalElement = document.querySelector('.modal-content'); // Get the modal content element
  console.log(modalElement, 'modalElement')
  html2canvas(modalElement).then((canvas) => {
    const imageData = canvas.toDataURL('image/png'); // Convert the canvas to image data (base64 encoded)
    uploadImageToServer(imageData); // Upload the image to a server or cloud storage
  });
};
