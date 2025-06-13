
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeItem {
  id: string;
  name: string;
  level?: number;
  children?: TreeItem[];
  parentId?: string;
}

interface TreeViewProps {
  data: TreeItem[];
  onSelect?: (item: TreeItem) => void;
  selectedId?: string;
}

const TreeView: React.FC<TreeViewProps> = ({ data, onSelect, selectedId }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const buildHierarchy = (items: TreeItem[]): TreeItem[] => {
    const itemMap = new Map<string, TreeItem & { children: TreeItem[] }>();
    const rootItems: (TreeItem & { children: TreeItem[] })[] = [];

    // Initialize all items with empty children arrays
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Build the hierarchy
    items.forEach(item => {
      const itemWithChildren = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        parent.children.push(itemWithChildren);
      } else {
        rootItems.push(itemWithChildren);
      }
    });

    return rootItems;
  };

  const getLevelLabel = (level: number) => {
    return `L${level}`;
  };

  const renderTreeNode = (item: TreeItem & { children: TreeItem[] }, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedId === item.id;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onSelect?.(item)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6 mr-2" />
          )}
          
          <span className="text-xs bg-gray-200 px-2 py-1 rounded mr-2 font-mono">
            {getLevelLabel(level)}
          </span>
          
          <span className="flex-1 text-sm">{item.name}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {item.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const hierarchicalData = buildHierarchy(data);

  return (
    <div className="border rounded-md bg-white">
      {hierarchicalData.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No items to display</div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {hierarchicalData.map(item => renderTreeNode(item, 0))}
        </div>
      )}
    </div>
  );
};

export default TreeView;
