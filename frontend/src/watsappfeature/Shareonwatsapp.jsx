export const shareOnWhatsApp = (imageUrl) => {
    const message = `Here are the booking details: ${imageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  