import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tag } from '../types/tag';

interface TagWithTransactions {
  tag: Tag;
  transactions: number;
}

interface TagUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: TagWithTransactions;
  onUpdate: (name: string) => void;
  isPending?: boolean;
}

export default function TagUpdateModal({ 
  isOpen, 
  onClose, 
  tag,
  onUpdate,
  isPending = false
}: TagUpdateModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(tag.tag.name);
    }
  }, [isOpen, tag.tag.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed && trimmed !== tag.tag.name) {
      onUpdate(trimmed);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Tag</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-2">
              Tag Name
            </label>
            <input
              type="text"
              id="tagName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                This tag is used in <span className="font-medium">{tag.transactions}</span> transaction(s).
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name.trim() === tag.tag.name || isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Updating...' : 'Update Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}