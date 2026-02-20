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
 * 使用隐藏的 iframe 进行打印，避免弹窗
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
      position: relative;
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }

    .university-brand {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
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
      <div class="university-brand">
        <img src="https://tse1.mm.bing.net/th/id/OIP.IBQmsIvHRvakUvXVgRIXmQAAAA?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3" alt="广州大学" class="university-logo" />
        <span class="university-name">广州大学计算机科学与网络工程学院</span>
      </div>
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
</body>
</html>
  `

  // 将文件名复制到剪贴板，方便用户粘贴
  try {
    await navigator.clipboard.writeText(suggestedFilename)
    console.log('文件名已复制到剪贴板:', suggestedFilename)
  } catch (clipboardError) {
    console.warn('复制文件名到剪贴板失败:', clipboardError)
  }

  // 使用新标签页打开打印页面，允许用户控制文件名
  return new Promise((resolve, reject) => {
    try {
      // 创建新窗口
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('无法打开打印窗口，请检查是否被浏览器拦截')
      }

      // 写入内容到新窗口
      printWindow.document.open()
      printWindow.document.write(printContent)
      printWindow.document.close()

      // 设置窗口标题（会影响默认文件名）
      printWindow.document.title = suggestedFilename

      // 延迟执行打印，确保内容完全渲染
      setTimeout(() => {
        try {
          printWindow.focus()
          printWindow.print()

          // 如果浏览器支持 onafterprint，打印完成后自动关闭窗口
          printWindow.onafterprint = () => {
            printWindow.close()
            resolve()
          }

          // 对于不支持 onafterprint 的浏览器，检测打印对话框关闭
          // 通过检测窗口是否获得焦点来判断打印是否完成
          let printDialogClosed = false
          const checkFocus = setInterval(() => {
            if (printDialogClosed && document.hasFocus()) {
              // 打印对话框已关闭且主窗口获得焦点，说明打印完成
              clearInterval(checkFocus)
              printWindow.close()
              resolve()
            }
          }, 500)

          // 标记打印对话框已打开
          setTimeout(() => {
            printDialogClosed = true
          }, 1000)

          // 超时处理（30秒后自动关闭）
          setTimeout(() => {
            clearInterval(checkFocus)
            if (!printWindow.closed) {
              printWindow.close()
            }
            resolve()
          }, 30000)
        } catch (printError) {
          printWindow.close()
          reject(printError)
        }
      }, 500)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 直接打印报告（不保存为文件）
 * @param options 导出选项
 */
export async function printReport(options: PDFExportOptions): Promise<void> {
  await exportPDF(options)
}
