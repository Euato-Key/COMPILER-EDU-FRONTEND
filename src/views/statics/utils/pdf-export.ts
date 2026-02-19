interface ChartImages {
  barChart: string
  pieChart: string
  lineChart: string
}

/**
 * 导出统计页面 PDF
 * 使用图表图片替换 Canvas，确保打印时图表可见
 * @param containerId 统计页面容器 ID
 * @param chartImages 图表图片数据
 * @returns Promise<void>
 */
export async function exportStatsPDF(
  containerId: string,
  chartImages: ChartImages
): Promise<void> {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
  const suggestedFilename = `学习统计报告-${dateStr}_${timeStr}.pdf`

  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`容器 ${containerId} 不存在`)
  }

  // 克隆容器内容
  const clonedContainer = container.cloneNode(true) as HTMLElement

  // 替换图表区域为图片
  const chartCards = clonedContainer.querySelectorAll('.chart-card')
  chartCards.forEach((card, index) => {
    const chartDiv = card.querySelector('[class*="min-h-[300px]"]')
    if (chartDiv) {
      let imageSrc = ''
      if (index === 0) imageSrc = chartImages.barChart
      else if (index === 1) imageSrc = chartImages.pieChart
      else if (index === 2) imageSrc = chartImages.lineChart

      if (imageSrc) {
        chartDiv.innerHTML = `<img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: contain;" />`
      }
    }
  })

  // 隐藏不需要打印的元素
  const elementsToHide = clonedContainer.querySelectorAll(
    'button, .no-print, header, nav, .theme-selector, .time-range-selector, select'
  )
  elementsToHide.forEach(el => {
    (el as HTMLElement).style.display = 'none'
  })

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
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }

    .report-header h1 {
      font-size: 28px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 10px 0;
    }

    .report-header p {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
    }

    .report-content {
      margin-top: 20px;
    }

    /* 隐藏打印按钮和不需要打印的元素 */
    .no-print,
    button,
    [role="button"],
    .btn,
    .action-buttons,
    header,
    nav,
    .theme-selector,
    .time-range-selector,
    select,
    .charts-section h2,
    .modules-stats h2 {
      display: none !important;
    }

    /* 强制网格布局 - 统计卡片 4列 */
    .stats-overview .grid {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 12px !important;
    }

    /* 统计卡片打印优化 */
    .stat-card {
      break-inside: avoid;
      page-break-inside: avoid;
      padding: 12px !important;
      min-height: auto !important;
    }

    .stat-card .text-3xl {
      font-size: 20px !important;
    }

    /* 模块统计卡片 - 强制2列 */
    .modules-stats .grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
    }

    .module-stat-card {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 12px;
      padding: 12px !important;
    }

    .module-stat-card h3 {
      font-size: 14px !important;
    }

    /* 图表区域 - 强制2列 */
    .charts-section .grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
    }

    /* 图表打印优化 */
    .chart-card {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 12px;
      padding: 12px !important;
      min-height: 200px !important;
    }

    .chart-card img {
      max-width: 100%;
      height: auto;
      max-height: 180px;
    }

    /* 趋势图占满宽度 */
    .chart-card.lg\\:col-span-2,
    .charts-section .grid > div:last-child {
      grid-column: span 2 !important;
    }

    /* 紧凑间距 */
    .mb-8 {
      margin-bottom: 16px !important;
    }

    .mb-4 {
      margin-bottom: 8px !important;
    }

    .p-6 {
      padding: 12px !important;
    }

    .gap-6 {
      gap: 12px !important;
    }

    /* 表格打印优化 */
    table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
      font-size: 11px;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    th, td {
      border: 1px solid #d1d5db;
      padding: 4px 6px;
      text-align: left;
    }

    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }

    /* 卡片打印优化 */
    .card,
    .rounded-xl,
    .shadow-sm,
    .shadow-lg {
      box-shadow: none !important;
      border: 1px solid #e5e7eb;
      border-radius: 8px !important;
    }

    /* 确保背景色打印 */
    .bg-gradient-to-br,
    .bg-blue-500, .bg-green-500, .bg-purple-500, .bg-orange-500,
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

    /* 字体大小优化 */
    body {
      font-size: 12px;
    }

    h1 {
      font-size: 22px !important;
    }

    h2 {
      font-size: 16px !important;
    }

    h3 {
      font-size: 13px !important;
    }

    p, span, div {
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>学习统计报告</h1>
      <p>编译原理可视化工具 - 错误统计分析</p>
      <p style="margin-top: 10px; font-size: 12px;">生成时间: ${now.toLocaleString('zh-CN')}</p>
    </div>

    <div class="report-content">
      ${clonedContainer.innerHTML}
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

  // 使用新标签页打开打印页面
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

      // 设置窗口标题
      printWindow.document.title = suggestedFilename

      // 延迟执行打印
      setTimeout(() => {
        try {
          printWindow.focus()
          printWindow.print()

          // 打印完成后自动关闭窗口
          printWindow.onafterprint = () => {
            printWindow.close()
            resolve()
          }

          // 检测打印对话框关闭
          let printDialogClosed = false
          const checkFocus = setInterval(() => {
            if (printDialogClosed && document.hasFocus()) {
              clearInterval(checkFocus)
              printWindow.close()
              resolve()
            }
          }, 500)

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
