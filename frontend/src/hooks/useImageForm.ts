// useImageForm.ts - Shared form state for image CRUD
import { useState } from 'react';
import type { InteriorImage } from '../shared/types';
import {
  createEmptyImageForm,
  normalizeWallPositions,
  type ImageFormState,
} from '../utils/imageForm';

type PreviewHandler = (previewUrl: string) => void;

export const useImageForm = () => {
  const toStoneTypeList = (value: InteriorImage['stoneType']) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const toSurfaceList = (value: InteriorImage['be_mat'] | InteriorImage['hang_muc']) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const [formData, setFormData] = useState<ImageFormState>(createEmptyImageForm());

  const resetForm = () => {
    setFormData(createEmptyImageForm());
  };

  const resolveSurfaceFromImage = (image: InteriorImage): string =>
    toSurfaceList(image.be_mat ?? image.hang_muc).join(', ');

  const setFromImage = (image: InteriorImage) => {
    setFormData({
      name: image.name,
      stoneType: toStoneTypeList(image.stoneType),
      be_mat: resolveSurfaceFromImage(image),
      wallPosition: normalizeWallPositions(image.wallPosition),
      description: image.description,
      image: null,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'wallPosition' && e.target instanceof HTMLSelectElement) {
      const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, wallPosition: selected }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onPreview?: PreviewHandler
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    if (!onPreview) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const setWallPositions = (positions: string[]) => {
    setFormData((prev) => ({ ...prev, wallPosition: positions }));
  };

  const toggleStoneType = (stoneType: string) => {
    setFormData((prev) => {
      const exists = prev.stoneType.includes(stoneType);
      return {
        ...prev,
        stoneType: exists
          ? prev.stoneType.filter((item) => item !== stoneType)
          : [...prev.stoneType, stoneType],
      };
    });
  };

  const toggleWallPosition = (position: string) => {
    setFormData((prev) => {
      const exists = prev.wallPosition.includes(position);
      return {
        ...prev,
        wallPosition: exists
          ? prev.wallPosition.filter((item) => item !== position)
          : [...prev.wallPosition, position],
      };
    });
  };

  return {
    formData,
    setFormData,
    resetForm,
    setFromImage,
    handleInputChange,
    handleFileChange,
    setWallPositions,
    toggleStoneType,
    toggleWallPosition,
  };
};
