import { saveAs } from 'file-saver'

interface StudentInfo {
  name: string
  studentId: string
  className: string
}

interface HTMLExportOptions {
  containerId: string
  studentInfo: StudentInfo
  reportTitle: string
  modelName: string
  recordId: string
  filename?: string
}

/**
 * 导出 HTML 报告
 * @param options 导出选项
 * @returns Promise<void>
 */
export async function exportHTML(options: HTMLExportOptions): Promise<void> {
  const {
    containerId,
    studentInfo,
    reportTitle,
    modelName,
    recordId,
    filename = `${studentInfo.studentId}-${studentInfo.className}-${studentInfo.name}-${modelName}-${recordId}.html`
  } = options

  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`容器 ${containerId} 不存在`)
  }

  // 获取页面的完整样式
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  // 创建完整的 HTML 文档
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle}</title>
  <style>
    ${styles}
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .report-container {
      max-width: 7xl;
      margin: 0 auto;
      padding: 2rem;
      background-color: #ffffff;
      min-height: 100vh;
    }
    .report-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .student-info {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background-color: #f9fafb;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
    }
    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .student-info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">${reportTitle}</h1>
    </div>
    
    <div class="student-info">
      <div class="student-info-grid">
        <div>
          <span class="font-medium text-gray-700">姓名：</span>
          <span class="text-gray-900">${studentInfo.name}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">学号：</span>
          <span class="text-gray-900">${studentInfo.studentId}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">班别：</span>
          <span class="text-gray-900">${studentInfo.className}</span>
        </div>
      </div>
    </div>
    
    <div class="report-content">
      ${container.innerHTML}
    </div>
  </div>
</body>
</html>
  `

  // 创建 Blob 对象并下载
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  saveAs(blob, filename)
}