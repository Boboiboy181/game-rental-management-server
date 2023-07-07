import { VideoGame } from 'src/video-game/schemas/video-game.schema';

export const priceByDays = (
  videoGame: VideoGame,
  numberOfRentalDays: number,
): number => {
  let videoGamePrice: number = videoGame.price;
  switch (numberOfRentalDays) {
    case 1:
      videoGamePrice = videoGame.price;
      break;
    case 3:
      videoGamePrice = videoGame.price * 0.89;
      break;
    case 7:
      videoGamePrice = videoGame.price * 0.87;
      break;
    case 14:
      videoGamePrice = videoGame.price * 0.85;
      break;
    case 30:
      videoGamePrice = videoGame.price * 0.83;
      break;
    case 60:
      videoGamePrice = videoGame.price * 0.8;
      break;
    default:
      break;
  }
  return videoGamePrice;
};
