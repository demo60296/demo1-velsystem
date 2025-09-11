import { useState } from 'react';
import { Edit, Trash2, GitMerge, Tag as TagIcon, Search } from 'lucide-react';
import { useTags, useUpdateTag, useMergeTag, useDeleteTag } from '../hooks/useTags';
import TagMergeModal from '../components/TagMergeModal';
import TagUpdateModal from '../components/TagUpdateModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Tag } from '../types/tag';

interface TagWithTransactions {
  tag: Tag;
  transactions: number;
}

function Tags() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagWithTransactions | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: tagData = [], isLoading } = useTags();
  const updateTag = useUpdateTag();
  const mergeTag = useMergeTag();
  const deleteTag = useDeleteTag();

  const filteredTags = tagData.filter(({ tag }) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateTag = async (name: string) => {
    if (selectedTag) {
      try {
        await updateTag.mutateAsync({ id: selectedTag.tag.id, data: { name } });
        setIsUpdateModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error('Failed to update tag:', error);
      }
    }
  };

  const handleMergeTag = async (targetTagId: string) => {
    if (selectedTag) {
      try {
        await mergeTag.mutateAsync({ id: selectedTag.tag.id, data: { tagId: targetTagId } });
        setIsMergeModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error('Failed to merge tags:', error);
      }
    }
  };

  const handleDeleteTag = async () => {
    if (selectedTag) {
      try {
        await deleteTag.mutateAsync(selectedTag.tag.id);
        setIsDeleteModalOpen(false);
        setSelectedTag(null);
      } catch (error) {
        console.error('Failed to delete tag:', error);
      }
    }
  };

  const openMergeModal = (tag: TagWithTransactions) => {
    setSelectedTag(tag);
    setIsMergeModalOpen(true);
  };

  const openUpdateModal = (tag: TagWithTransactions) => {
    setSelectedTag(tag);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (tag: TagWithTransactions) => {
    setSelectedTag(tag);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tags</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Organize your transactions with custom tags</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Tags List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            All Tags ({filteredTags.length})
          </h2>
        </div>

        {filteredTags.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-400 mb-4">
              <TagIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No tags found' : 'No tags yet'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              {searchTerm 
                ? `No tags match "${searchTerm}"`
                : 'Create your first tag to start organizing your transactions'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTags.map((item) => (
              <div key={item.tag.id} className="p-3 sm:p-4 lg:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                  <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{item.tag.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item.transactions} transaction{item.transactions !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => openMergeModal(item)}
                    disabled={tagData.length <= 1}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-50"
                    title="Merge tag"
                  >
                    <GitMerge className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => openUpdateModal(item)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                    title="Update tag"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-gray-50"
                    title="Delete tag"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTag && (
        <>
          <TagMergeModal
            isOpen={isMergeModalOpen}
            onClose={() => {
              setIsMergeModalOpen(false);
              setSelectedTag(null);
            }}
            sourceTag={selectedTag}
            availableTags={tagData}
            onMerge={handleMergeTag}
            isPending={mergeTag.isPending}
          />

          <TagUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedTag(null);
            }}
            tag={selectedTag}
            onUpdate={handleUpdateTag}
            isPending={updateTag.isPending}
          />

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedTag(null);
            }}
            onConfirm={handleDeleteTag}
            title="Delete Tag"
            message={`Are you sure you want to delete "${selectedTag.tag.name}"? This tag is used in ${selectedTag.transactions} transaction(s). This action cannot be undone.`}
            confirmText="Delete Tag"
            confirmButtonClass="bg-red-600 hover:bg-red-700"
            isPending={deleteTag.isPending}
          />
        </>
      )}
    </div>
  );
}

export default Tags;
