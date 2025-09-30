
import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, cols = 4 }) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="bg-white border-b animate-pulse">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonTable;
