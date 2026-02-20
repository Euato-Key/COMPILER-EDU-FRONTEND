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
    recordId
  } = options

  // 规范化文件名：学号-班别-姓名-模型-记录ID-日期时间
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
  const filename = `${studentInfo.studentId}-${studentInfo.className}-${studentInfo.name}-${modelName}-${recordId}-${dateStr}_${timeStr}.html`

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
      position: relative;
      text-align: center;
      margin-bottom: 2rem;
    }

    .university-brand {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .university-logo {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    .university-name {
      font-size: 13px;
      font-weight: 600;
      color: #1a365d;
      margin: 0;
      font-family: "SimSun", "宋体", "Source Han Serif SC", "Noto Serif SC", serif;
      letter-spacing: 0.5px;
      text-align: center;
      line-height: 1.5;
      max-width: 120px;
      text-shadow: 0.5px 0.5px 0.5px rgba(0,0,0,0.1);
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
      <div class="university-brand">
        <img src="https://bkimg.cdn.bcebos.com/pic/b3b7d0a20cf431adcbef663a0261bbaf2edda3cc3223?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536" alt="广州大学" class="university-logo" />
        <span class="university-name">广州大学计算机科学与网络工程学院</span>
      </div>
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