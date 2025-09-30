// Dashboard Mock 数据测试脚本
// 在浏览器控制台中运行此脚本来测试Mock数据

console.log('🚀 开始测试Dashboard Mock数据...')

// 测试每日简报API
async function testDailyReport() {
  console.log('\n📊 测试每日简报API...')
  try {
    const response = await fetch('/api/dashboard/daily-report?view=management')
    const data = await response.json()
    console.log('✅ 每日简报API测试成功:', data)
  } catch (error) {
    console.error('❌ 每日简报API测试失败:', error)
  }
}

// 测试数据指标API
async function testDataCards() {
  console.log('\n📈 测试数据指标API...')
  try {
    const response = await fetch('/api/dashboard/data-cards?period=day')
    const data = await response.json()
    console.log('✅ 数据指标API测试成功:', data)
  } catch (error) {
    console.error('❌ 数据指标API测试失败:', error)
  }
}

// 测试要闻列表API
async function testNewsList() {
  console.log('\n📰 测试要闻列表API...')
  try {
    const response = await fetch('/api/dashboard/news?page=1&pageSize=5')
    const data = await response.json()
    console.log('✅ 要闻列表API测试成功:', data)
  } catch (error) {
    console.error('❌ 要闻列表API测试失败:', error)
  }
}

// 测试线索看板API
async function testLeadsBoard() {
  console.log('\n🎯 测试线索看板API...')
  try {
    const response = await fetch('/api/dashboard/leads/board?period=week')
    const data = await response.json()
    console.log('✅ 线索看板API测试成功:', data)
  } catch (error) {
    console.error('❌ 线索看板API测试失败:', error)
  }
}

// 测试用户偏好设置API
async function testPreferences() {
  console.log('\n⚙️ 测试用户偏好设置API...')
  try {
    const response = await fetch('/api/dashboard/preferences')
    const data = await response.json()
    console.log('✅ 用户偏好设置API测试成功:', data)
  } catch (error) {
    console.error('❌ 用户偏好设置API测试失败:', error)
  }
}

// 运行所有测试
async function runAllTests() {
  await testDailyReport()
  await testDataCards()
  await testNewsList()
  await testLeadsBoard()
  await testPreferences()
  
  console.log('\n🎉 所有测试完成！')
  console.log('💡 如果看到错误，请检查：')
  console.log('   1. Mock服务是否已启动')
  console.log('   2. 浏览器是否在开发模式下')
  console.log('   3. 控制台是否有其他错误信息')
}

// 自动运行测试
runAllTests()

// 导出测试函数供手动调用
window.testDashboard = {
  testDailyReport,
  testDataCards,
  testNewsList,
  testLeadsBoard,
  testPreferences,
  runAllTests
}

console.log('\n🔧 测试函数已挂载到 window.testDashboard')
console.log('   可以手动调用: window.testDashboard.runAllTests()')
