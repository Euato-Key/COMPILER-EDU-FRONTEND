interface StudentInfo {
  name: string
  studentId: string
  className: string
}

interface PDFExportOptions {
  containerId: string
  studentInfo: StudentInfo
  reportTitle: string
  modelName: string
  recordId: string
  filename?: string
}

/**
 * 导出 PDF 报告
 * 使用浏览器打印功能生成 PDF
 * @param options 导出选项
 * @returns Promise<void>
 */
export async function exportPDF(options: PDFExportOptions): Promise<void> {
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
  const suggestedFilename = `${studentInfo.studentId}-${studentInfo.className}-${studentInfo.name}-${modelName}-${recordId}-${dateStr}_${timeStr}.pdf`

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

  // 创建打印窗口
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('无法打开打印窗口，请检查浏览器是否阻止了弹窗')
  }

  // 构建打印页面内容
  const printContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${suggestedFilename}</title>
  <style>
    ${styles}
    
    /* 打印优化样式 */
    @page {
      size: A4;
      margin: 10mm;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    .report-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    
    .report-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .report-header h1 {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 10px 0;
    }
    
    .student-info {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    
    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    
    .student-info-item {
      display: flex;
      align-items: center;
    }
    
    .student-info-label {
      font-weight: 500;
      color: #6b7280;
      margin-right: 8px;
    }
    
    .student-info-value {
      color: #111827;
      font-weight: 600;
    }
    
    .report-content {
      margin-top: 20px;
    }
    
    /* 隐藏打印按钮和不需要打印的元素 */
    .no-print,
    button,
    [role="button"],
    .btn,
    .action-buttons {
      display: none !important;
    }
    
    /* 表格打印优化 */
    table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
    }
    
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    
    /* 卡片打印优化 */
    .card,
    .rounded-xl,
    .shadow-sm {
      box-shadow: none !important;
      border: 1px solid #e5e7eb;
    }
    
    /* 确保背景色打印 */
    .bg-green-50, .bg-red-50, .bg-blue-50, .bg-yellow-50,
    .bg-gray-50, .bg-indigo-50, .bg-pink-50, .bg-purple-50 {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* 分页控制 */
    .page-break {
      page-break-before: always;
    }
    
    .avoid-break {
      page-break-inside: avoid;
    }
    
    /* 响应式调整 */
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
      <h1>${reportTitle}</h1>
      <p style="color: #6b7280; margin: 0;">答题报告</p>
    </div>
    
    <div class="student-info">
      <div class="student-info-grid">
        <div class="student-info-item">
          <span class="student-info-label">姓名：</span>
          <span class="student-info-value">${studentInfo.name}</span>
        </div>
        <div class="student-info-item">
          <span class="student-info-label">学号：</span>
          <span class="student-info-value">${studentInfo.studentId}</span>
        </div>
        <div class="student-info-item">
          <span class="student-info-label">班别：</span>
          <span class="student-info-value">${studentInfo.className}</span>
        </div>
      </div>
    </div>
    
    <div class="report-content">
      ${container.innerHTML}
    </div>
  </div>
  
  <script>
    // 页面加载完成后自动触发打印
    window.onload = function() {
      setTimeout(function() {
        window.print()
      }, 500)
    }
  </script>
</body>
</html>
  `

  // 写入内容到新窗口
  printWindow.document.open()
  printWindow.document.write(printContent)
  printWindow.document.close()

  // 监听打印完成事件
  return new Promise((resolve, reject) => {
    // 浏览器打印对话框关闭后触发
    printWindow.onafterprint = () => {
      printWindow.close()
      resolve()
    }

    // 如果用户取消打印，一段时间后自动关闭窗口
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.close()
        resolve()
      }
    }, 60000) // 60秒后自动关闭
  })
}

/**
 * 直接打印报告（不保存为文件）
 * @param options 导出选项
 */
export async function printReport(options: PDFExportOptions): Promise<void> {
  await exportPDF(options)
}
