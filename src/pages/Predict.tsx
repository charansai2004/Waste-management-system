import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, AlertCircle, Loader2 } from 'lucide-react';

const Predict = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const simulateClassification = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate classification based on filename for demo
        const fileName = file.name.toLowerCase();
        if (fileName.includes('biodeg') || fileName.includes('organic') || fileName.includes('food')) {
          resolve('Biodegradable');
        } else if (fileName.includes('recycl') || fileName.includes('plastic') || fileName.includes('paper')) {
          resolve('Recyclable');
        } else {
          // Random classification for demo
          const categories = ['Biodegradable', 'Recyclable', 'Trash'];
          resolve(categories[Math.floor(Math.random() * categories.length)]);
        }
      }, 2000); // Simulate processing time
    });
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await simulateClassification(selectedFile);
      
      // Navigate to results page with the prediction
      navigate('/results', { 
        state: { 
          prediction: result,
          imageUrl: preview,
          fileName: selectedFile.name
        } 
      });
    } catch (err) {
      setError('Classification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Classification
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image of waste material to classify it as Biodegradable, Recyclable, or Trash
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              preview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-md max-h-64 mx-auto rounded-lg shadow-md object-cover"
                />
                <p className="text-sm text-gray-600">
                  Selected: {selectedFile?.name}
                </p>
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports: JPG, JPEG, PNG, GIF (Max 10MB)
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Choose File
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Predict Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handlePredict}
              disabled={!selectedFile || isLoading}
              className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                !selectedFile || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                'PREDICT'
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Tips for Better Results:</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Ensure the waste item is clearly visible and well-lit</li>
              <li>• Avoid blurry or low-resolution images</li>
              <li>• Center the item in the frame with minimal background clutter</li>
              <li>• Use good lighting conditions for optimal classification accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;