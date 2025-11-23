import { ExportOptions } from '../types';

/**
 * 将数据导出为 CSV 文件
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): void => {
  if (data.length === 0) {
    alert('没有数据可以导出');
    return;
  }

  // 获取表头
  const headers = Object.keys(data[0]);

  // 构建 CSV 内容
  let csvContent = '';

  if (options.includeHeaders) {
    csvContent += headers.join(',') + '\n';
  }

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // 处理包含逗号或换行的值
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    });
    csvContent += values.join(',') + '\n';
  });

  // 创建 Blob 并下载
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', options.filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};
