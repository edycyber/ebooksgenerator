import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FileTable = ({ 
  files = [], 
  onDownload, 
  onPreview, 
  onDelete, 
  onRename,
  onBulkDownload,
  selectedFiles = [],
  onFileSelect,
  onSelectAll
}) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Files' },
    { value: 'ready', label: 'Ready' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'fileSize', label: 'File Size' },
    { value: 'downloadCount', label: 'Downloads' }
  ];

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files?.filter(file => {
      const matchesSearch = file?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = filterStatus === 'all' || file?.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [files, searchTerm, filterStatus, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i))?.toFixed(1)} ${sizes?.[i]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ready: { color: 'text-success', bg: 'bg-success/10', label: 'Ready' },
      processing: { color: 'text-warning', bg: 'bg-warning/10', label: 'Processing' },
      failed: { color: 'text-error', bg: 'bg-error/10', label: 'Failed' }
    };

    const config = statusConfig?.[status] || statusConfig?.ready;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const allSelected = selectedFiles?.length === filteredAndSortedFiles?.length && filteredAndSortedFiles?.length > 0;
  const someSelected = selectedFiles?.length > 0 && selectedFiles?.length < filteredAndSortedFiles?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-moderate">
      {/* Header Controls */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Input
              type="search"
              placeholder="Search ebooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
              className="w-full sm:w-40"
            />
          </div>

          <div className="flex items-center space-x-3">
            {selectedFiles?.length > 0 && (
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => onBulkDownload(selectedFiles)}
              >
                Download ({selectedFiles?.length})
              </Button>
            )}
            <Select
              options={sortOptions}
              value={sortField}
              onChange={setSortField}
              placeholder="Sort by"
              className="w-32"
            />
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="w-12 px-6 py-4 text-left">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-gentle"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-2">
                  <span>Title</span>
                  {sortField === 'title' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-gentle"
                onClick={() => handleSort('fileSize')}
              >
                <div className="flex items-center space-x-2">
                  <span>Size</span>
                  {sortField === 'fileSize' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-gentle"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-2">
                  <span>Created</span>
                  {sortField === 'createdAt' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-gentle"
                onClick={() => handleSort('downloadCount')}
              >
                <div className="flex items-center space-x-2">
                  <span>Downloads</span>
                  {sortField === 'downloadCount' && (
                    <Icon 
                      name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={16} 
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedFiles?.map((file) => (
              <tr key={file?.id} className="hover:bg-muted/20 transition-gentle">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedFiles?.includes(file?.id)}
                    onChange={(e) => onFileSelect(file?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={16} color="var(--color-primary)" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file?.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {file?.genre} • {file?.pages} pages
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatFileSize(file?.fileSize)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(file?.status)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(file?.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {file?.downloadCount}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    {file?.status === 'ready' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={() => onPreview(file)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Download"
                          onClick={() => onDownload(file)}
                        />
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      onClick={() => {/* More actions menu */}}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {filteredAndSortedFiles?.map((file) => (
          <div key={file?.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedFiles?.includes(file?.id)}
                onChange={(e) => onFileSelect(file?.id, e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={18} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {file?.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(file?.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file?.fileSize)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {file?.genre} • {file?.pages} pages • {file?.downloadCount} downloads
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {formatDate(file?.createdAt)}
                    </p>
                  </div>
                </div>
                {file?.status === 'ready' && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      iconPosition="left"
                      onClick={() => onPreview(file)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                      onClick={() => onDownload(file)}
                    >
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredAndSortedFiles?.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No files found' : 'No ebooks yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria.' :'Create your first ebook to get started.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => window.location.href = '/ebook-creation'}
            >
              Create New Ebook
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileTable;