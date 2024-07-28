import { useCallback, useEffect, useState } from 'react';

function useDrag(uploadContainerRef: React.RefObject<HTMLDivElement>, accept?: string) {
  const [dragFile, setDragFile] = useState<File | null>(null);
  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (files) {
      setDragFile(files[0]);
    }
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept || '';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setDragFile(files[0]);
      }
    };
    input.click();
  }, []);

  useEffect(() => {
    const uploadContainer = uploadContainerRef.current;

    uploadContainer?.addEventListener('dragenter', handleDrag);
    uploadContainer?.addEventListener('dragover', handleDrag);
    uploadContainer?.addEventListener('drop', handleDrop);
    uploadContainer?.addEventListener('dragleave', handleDrag);
    uploadContainer?.addEventListener('click', handleClick);

    return () => {
      uploadContainer?.removeEventListener('dragenter', handleDrag);
      uploadContainer?.removeEventListener('dragover', handleDrag);
      uploadContainer?.removeEventListener('drop', handleDrop);
      uploadContainer?.removeEventListener('dragleave', handleDrag);
      uploadContainer?.removeEventListener('click', handleClick);
    };
  }, []);

  return {
    dragFile
  };
}

export { useDrag };
