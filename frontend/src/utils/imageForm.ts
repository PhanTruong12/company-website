// imageForm.ts - Helpers for showroom image CRUD forms
export type ImageFormState = {
  name: string;
  stoneType: string;
  wallPosition: string[];
  description: string;
  image: File | null;
};

export const createEmptyImageForm = (): ImageFormState => ({
  name: '',
  stoneType: '',
  wallPosition: [],
  description: '',
  image: null,
});

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
  data.append('stoneType', form.stoneType);
  form.wallPosition.forEach((position) => data.append('wallPosition', position));
  data.append('description', form.description);
  if (form.image) {
    data.append('image', form.image);
  }
  return data;
};
