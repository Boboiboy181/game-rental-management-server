export const priceByDays = (
  price: number,
  numberOfRentalDays: number,
): number => {
  let videoGamePrice: number = price;
  switch (numberOfRentalDays) {
    case 1:
      videoGamePrice = price;
      break;
    case 3:
      videoGamePrice = price * 0.89;
      break;
    case 7:
      videoGamePrice = price * 0.87;
      break;
    case 14:
      videoGamePrice = price * 0.85;
      break;
    case 30:
      videoGamePrice = price * 0.83;
      break;
    case 60:
      videoGamePrice = price * 0.8;
      break;
    default:
      break;
  }
  return videoGamePrice;
};
