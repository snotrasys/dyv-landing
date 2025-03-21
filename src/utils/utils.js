import toast from 'react-hot-toast';
export const MB_IN_B = 1048576;

const BOOK_MAX_SIZE = 20;
const AUDIO_MAX_SIZE = 100;
const IMAGE_MAX_SIZE = 5;

export const isFileTooLarge = (size, type) => {
  const typeToSize = {
    image: IMAGE_MAX_SIZE,
    audio: AUDIO_MAX_SIZE,
    book: BOOK_MAX_SIZE,
  };
  if (size / MB_IN_B >= typeToSize[type]) {
    toast.error(
      'Your file is too large. Please compress it and upload it again',
    );
    return true;
  }
  return false;
};

{/*

export function formatRange(num) {
  if (num >= 250) {
    return 'Range: Beats Matrix';
  }
  if (num >= 200) {
    return 'Range: Beats Skywalker';
  }
  if (num >= 150) {
    return 'Range: Beats Sultan';
  }
  if (num >= 100) {
    return 'Range: Beats Dominator';
  }
  if (num >= 50) {
    return 'Range: Investor One';
  }
  
}



*/}



export function formatRange(num) {
  if (num >= 100000) {
    return 'Range: Beats Matrix';
  }
  if (num >= 20000 ) {
    return 'Range: Beats Skywalker';
  }
  if (num >= 10000 ) {
    return 'Range: Beats Sultan';
  }
  if (num >= 2500 ) {
    return 'Range: Beats Dominator';
  }
  if (num >= 1000 ) {
    return 'Range: Investor One';
  }

}