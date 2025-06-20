import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Leaf, Recycle, Trash2, ArrowLeft, CheckCircle, Camera } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const { prediction, imageUrl, fileName } = location.state || {};

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'Biodegradable':
        return {
          icon: <Leaf className="h-16 w-16 text-green-600" />,
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          description: 'This item is biodegradable and can naturally decompose. Consider composting or organic waste disposal.',
          actions: [
            'Add to compost bin',
            'Dispose in organic waste collection',
            'Use for garden composting if applicable'
          ]
        };
      case 'Recyclable':
        return {
          icon: <Recycle className="h-16 w-16 text-blue-600" />,
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          description: 'This item can be recycled. Please clean it and place it in the appropriate recycling bin.',
          actions: [
            'Clean the item thoroughly',
            'Place in recycling bin',
            'Check local recycling guidelines'
          ]
        };
      case 'Trash':
        return {
          icon: <Trash2 className="h-16 w-16 text-red-600" />,
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          description: 'This item should be disposed of as regular trash. It cannot be recycled or composted.',
          actions: [
            'Place in general waste bin',
            'Dispose according to local regulations',
            'Consider alternatives for future purchases'
          ]
        };
      default:
        return {
          icon: <Camera className="h-16 w-16 text-gray-600" />,
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          description: 'Classification result not available.',
          actions: []
        };
    }
  };

  if (!prediction) {
    return (
      <div className="min-h-screen py-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h1>
          <p className="text-gray-600 mb-6">Please upload an image first to see classification results.</p>
          <Link
            to="/predict"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Predict
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(prediction);

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Classification Results
          </h1>
          <p className="text-xl text-gray-600">
            Here's what our AI model determined about your waste item
          </p>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {imageUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt="Uploaded item"
                    className="w-64 h-64 object-cover rounded-xl shadow-md"
                  />
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {fileName}
                  </p>
                </div>
              )}

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <span className="text-lg font-semibold text-gray-900">
                    Classification Complete
                  </span>
                </div>
                
                <div className={`inline-flex items-center px-6 py-3 rounded-full ${categoryInfo.bgColor} ${categoryInfo.borderColor} border-2 mb-4`}>
                  <span className="mr-3">{categoryInfo.icon}</span>
                  <span className={`text-2xl font-bold ${categoryInfo.textColor}`}>
                    {prediction}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {categoryInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Recommended Actions:
            </h3>
            <div className="space-y-3">
              {categoryInfo.actions.map((action, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/predict"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Camera className="h-5 w-5 mr-2" />
              Classify Another Item
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">About This Classification:</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            This classification was generated using our VGG16-based deep learning model trained on thousands of waste images. 
            The model analyzes visual features to determine the most appropriate disposal method. For best results in waste management, 
            always follow your local municipality's specific guidelines for waste disposal and recycling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;