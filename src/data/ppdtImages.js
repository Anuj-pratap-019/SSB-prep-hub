// Local PPDT image library stored in public/ppdt-images.
export const PPDT_IMAGES = [
  'photo_2026-10-07_23-30-37.jpg',
  'photo_2026-10-07_23-31-02.jpg',
  'photo_2026-10-07_23-31-09.jpg',
  'photo_2026-10-07_23-31-14.jpg',
  'photo_2026-10-07_23-31-20.jpg',
  'photo_2026-10-07_23-31-25.jpg',
  'photo_2026-10-07_23-31-32.jpg',
  'photo_2026-10-07_23-31-39.jpg',
  'photo_2026-10-07_23-31-43.jpg',
  'photo_2026-10-07_23-31-48.jpg',
  'photo_2026-10-07_23-31-52.jpg',
  'photo_2026-10-07_23-32-04.jpg',
  'photo_2026-10-07_23-32-09.jpg',
  'photo_2026-10-07_23-32-13.jpg',
  'photo_2026-10-07_23-32-18.jpg',
  'photo_2026-10-07_23-32-23.jpg',
  'photo_2026-10-07_23-32-27.jpg',
  'photo_2026-10-07_23-32-32.jpg',
  'photo_2026-10-07_23-32-37.jpg',
  'photo_2026-10-07_23-32-45.jpg',
  'photo_2026-10-07_23-32-49.jpg'
].map((filename, index) => ({
  id: index + 1,
  title: `PPDT Picture ${String(index + 1).padStart(2, '0')}`,
  image: `/ppdt-images/${filename}`
}));
