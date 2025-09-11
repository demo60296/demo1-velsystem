import { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Tag } from '../types/tag';

export interface TagWithTransactions {
  tag: Tag;
  transactions: number;
}

interface TagMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceTag: TagWithTransactions;
  availableTags: TagWithTransactions[];
  onMerge: (targetTagId: string) => void;
  isPending?: boolean;
}

export default function TagMergeModal({ 
  isOpen, 
  onClose, 
  sourceTag,
  availableTags,
  onMerge,
  isPending = false
}: TagMergeModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagWithTransactions | null>(null);

  const filteredTags = availableTags
    .filter(tag => tag.tag.id !== sourceTag.tag.id)
    .filter(tag =>
      searchTerm.trim() === ''
        ? true
        : tag.tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleMerge = () => {
    if (selectedTag) {
      onMerge(selectedTag.tag.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Merge Tag</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Merge Operation</h3>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                  {sourceTag.tag.name}
                </span>
                <span className="text-xs text-gray-500">({sourceTag.transactions} transactions)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                {selectedTag ? (
                  <>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                      {selectedTag.tag.name}
                    </span>
                    <span className="text-xs text-gray-500">({selectedTag.transactions} transactions)</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Select target tag</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All transactions from "{sourceTag.tag.name}" will be moved to the selected tag, and "{sourceTag.tag.name}" will be deleted.
            </p>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {filteredTags.map((tag) => (
                <button
                  key={tag.tag.id}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTag?.tag.id === tag.tag.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{tag.tag.name}</span>
                    <span className="text-sm text-gray-500">({tag.transactions} transactions)</span>
                  </div>
                  {selectedTag?.tag.id === tag.tag.id && (
                    <span className="text-sm text-indigo-600 font-medium">Selected</span>
                  )}
                </button>
              ))}
            </div>

            {filteredTags.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tags found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={!selectedTag || isPending}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Merging...' : 'Merge Tags'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
