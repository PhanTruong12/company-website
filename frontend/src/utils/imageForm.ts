// imageForm.ts - Helpers for showroom image CRUD forms
export type ImageFormState = {
  name: string;
  stoneType: string[];
  be_mat: string;
  wallPosition: string[];
  description: string;
  image: File | null;
};

export const createEmptyImageForm = (): ImageFormState => ({
  name: '',
  stoneType: [],
  be_mat: '',
  wallPosition: [],
  description: '',
  image: null,
});

export const normalizeSurfaceValue = (value: string): string =>
  value
    .trim()
    .replace(/\s+/g, ' ');

export const normalizeWallPositions = (
  value: string[] | string | undefined | null
): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const buildImageFormData = (form: ImageFormState): FormData => {
  const data = new FormData();
  data.append('name', form.name);
  form.stoneType.forEach((type) => data.append('stoneType', type));
  data.append('be_mat', normalizeSurfaceValue(form.be_mat));
  form.wallPosition.forEach((position) => data.append('wallPosition', position));
  data.append('description', form.description);
  if (form.image) {
    data.append('image', form.image);
  }
  return data;
};
