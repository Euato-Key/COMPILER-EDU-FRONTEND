<template>
  <div class="video-intro-container">
    <!-- PPT动画框 -->
    <div class="ppt-frame" :class="{ 'fullscreen': isFullscreen }">
      <!-- 背景颗粒动画 -->
      <div class="background-animation">
        <div class="particles">
          <div
            v-for="i in 80"
            :key="i"
            class="particle"
            :class="`particle-${getParticleShape(i)}`"
            :style="getParticleStyle(i)"
            :data-animation="getParticleAnimationType(i)"
          ></div>
        </div>
      </div>

      <!-- 广州大学Logo - 右上角固定 -->
      <div class="university-logo">
        <img src="/image.png" alt="广州大学Logo" class="logo-svg" />
        <img src="/广州大学文字.png" alt="广州大学" class="logo-text" />
      </div>

      <!-- 幻灯片内容 -->
              <div class="slides-wrapper" :style="{ transform: `translateX(-${currentSlide * (100/14)}%)` }">

        <!-- 第1页：标题页 -->
        <div class="slide slide-1" :class="{ 'active': currentSlide === 0 }">
          <div class="slide-content">
            <div class="title-section">
              <div class="logo-animation">
                <div class="logo-circle">
                  <Icon icon="lucide:code" class="logo-icon" />
                </div>
              </div>
              <h1 class="main-title">
                <span class="title-line">《编译原理》智能管控综合题</span>
                <span class="title-line">可视化线上学习系统</span>
              </h1>
              <p class="subtitle">让抽象的编译原理变得直观易懂</p>
            </div>
          </div>
        </div>

        <!-- 第2页：核心基石 -->
        <div class="slide slide-2" :class="{ 'active': currentSlide === 1 }">
          <div class="slide-content">
            <div class="concept-section">
              <h2 class="slide-title">编译原理作为计算机科学的核心基石</h2>
              <div class="concept-text">
                <p class="main-text">
                  编译原理作为计算机科学的核心基石，是连接高级编程语言与机器语言的桥梁，更是理解计算机系统底层逻辑的关键。
                </p>
                <div class="concept-grid">
                  <div class="concept-item">
                    <div class="concept-icon">
                      <Icon icon="lucide:arrow-left-right" class="icon" />
                    </div>
                    <h3>连接桥梁</h3>
                    <p>高级编程语言 ↔ 机器语言</p>
                  </div>
                  <div class="concept-item">
                    <div class="concept-icon">
                      <Icon icon="lucide:brain" class="icon" />
                    </div>
                    <h3>底层逻辑</h3>
                    <p>理解计算机系统核心</p>
                  </div>
                  <div class="concept-item">
                    <div class="concept-icon">
                      <Icon icon="lucide:layers" class="icon" />
                    </div>
                    <h3>系统架构</h3>
                    <p>软件与硬件的桥梁</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第3页：抽象概念挑战 -->
        <div class="slide slide-3" :class="{ 'active': currentSlide === 2 }">
          <div class="slide-content">
            <div class="problem-section">
              <h2 class="slide-title">抽象概念的挑战</h2>
              <div class="concept-text">
                <p class="main-text">
                  然而，这门课程中充斥着大量抽象概念 —— 从有限自动机的状态跳转，到语法树的层级构建，再到分析表的规则推导，这些内容往往让初学者望而生畏，难以通过静态文字或图片建立直观认知。
                </p>
                <div class="concepts-flow">
                  <div class="concept-flow-item">
                    <div class="flow-icon">
                      <Icon icon="lucide:git-branch" class="icon" />
                    </div>
                    <div class="flow-content">
                      <h3>有限自动机</h3>
                      <p>状态跳转算法步骤</p>
                    </div>
                  </div>
                  <div class="flow-arrow">
                    <Icon icon="lucide:arrow-right" class="arrow-icon" />
                  </div>
                  <div class="concept-flow-item">
                    <div class="flow-icon">
                      <Icon icon="lucide:tree-pine" class="icon" />
                    </div>
                    <div class="flow-content">
                      <h3>语法树</h3>
                      <p>语法分析算法步骤</p>
                    </div>
                  </div>
                  <div class="flow-arrow">
                    <Icon icon="lucide:arrow-right" class="arrow-icon" />
                  </div>
                  <div class="concept-flow-item">
                    <div class="flow-icon">
                      <Icon icon="lucide:table" class="icon" />
                    </div>
                    <div class="flow-content">
                      <h3>分析表</h3>
                      <p>LR分析算法步骤</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第4页：现有工具的局限性 -->
        <div class="slide slide-4" :class="{ 'active': currentSlide === 3 }">
          <div class="slide-content">
            <div class="limitation-section">
              <h2 class="slide-title">现有工具的局限性</h2>
              <div class="limitation-content">
                <div class="limitation-text">
                  <p class="main-text">
                    目前市面上许多学习工具局限于客观题的简单判断与选择，学生只需勾选答案却难以深入理解原理；
                  </p>
                  <p class="highlight-text">
                    而我们团队打造的《编译原理》智能管控综合题可视化线上学习系统，从根本上打破了这些局限：
                  </p>
                </div>
                <div class="limitation-cards">
                  <div class="limitation-card">
                    <div class="limitation-icon">
                      <Icon icon="lucide:file-text" class="icon" />
                    </div>
                    <h3>静态资料</h3>
                    <p>缺乏动态演示</p>
                  </div>
                  <div class="limitation-card">
                    <div class="limitation-icon">
                      <Icon icon="lucide:check-square" class="icon" />
                    </div>
                    <h3>结论式工具</h3>
                    <p>只给答案不解释</p>
                  </div>
                  <div class="limitation-card">
                    <div class="limitation-icon">
                      <Icon icon="lucide:help-circle" class="icon" />
                    </div>
                    <h3>难以理解</h3>
                    <p>无法深入原理</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第5页：聚焦综合大题与主观操作-->
        <div class="slide slide-5" :class="{ 'active': currentSlide === 4 }">
          <div class="slide-content">
            <div class="concept-section">
              <h2 class="slide-title">聚焦综合大题与主观操作</h2>

              <div class="concept-content">
                <div class="concept-text">
                  <h3 class="concept-title">我们不满足于让学生通过课本或者静态教材来学习编译原理这门课程</h3>
                  <p class="concept-description">而是直击编译原理学习的核心需求，我们的网站提供了交互式做题平台，用户通过输入实例，以体验完整流程解决综合性问题。</p>
                </div>
              </div>

              <div class="learning-flow">
                <h3 class="flow-title">完整学习流程体验</h3>
                <div class="flow-steps">
                  <div class="flow-step">
                    <div class="step-icon">
                      <Icon icon="lucide:keyboard" class="icon" />
                    </div>
                    <div class="step-content">
                      <h4>输入实例</h4>
                      <p>从正则式构建 NFA</p>
                    </div>
                  </div>
                  <div class="flow-arrow">
                    <Icon icon="lucide:arrow-right" class="arrow-icon" />
                  </div>
                  <div class="flow-step">
                    <div class="step-icon">
                      <Icon icon="lucide:git-branch" class="icon" />
                    </div>
                    <div class="step-content">
                      <h4>推导过程</h4>
                      <p>再到最小化 DFA</p>
                    </div>
                  </div>
                  <div class="flow-arrow">
                    <Icon icon="lucide:arrow-right" class="arrow-icon" />
                  </div>
                  <div class="flow-step">
                    <div class="step-icon">
                      <Icon icon="lucide:layers" class="icon" />
                    </div>
                    <div class="step-content">
                      <h4>文法推导</h4>
                      <p>到 LL1 分析表生成</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第7页：主观大题 -->
        <div class="slide slide-7" :class="{ 'active': currentSlide === 5 }">
          <div class="slide-content">
            <div class="subjective-section">
              <h2 class="slide-title">聚焦综合大题与主观操作</h2>

              <div class="subjective-intro">
                <h3>每个模块都是一道"主观大题"</h3>
                <p>无论是从正则式构建 NFA 再到最小化 DFA，还是从文法推导到 LL1 分析表的逐步生成，每个模块都是一道环环相扣的"主观大题"</p>
              </div>

              <div class="subjective-grid">
                <div class="subjective-item">
                  <div class="subjective-icon">
                    <Icon icon="lucide:hand" class="icon" />
                  </div>
                  <h4>亲手完成</h4>
                  <p>从输入到推导</p>
                </div>
                <div class="subjective-item">
                  <div class="subjective-icon">
                    <Icon icon="lucide:pen-tool" class="icon" />
                  </div>
                  <h4>绘图操作</h4>
                  <p>从绘图到验证</p>
                </div>
                <div class="subjective-item">
                  <div class="subjective-icon">
                    <Icon icon="lucide:graduation-cap" class="icon" />
                  </div>
                  <h4>做中学</h4>
                  <p>全流程操作</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第8页：个性化学习体验 -->
        <div class="slide slide-8" :class="{ 'active': currentSlide === 6 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">个性化学习体验</h1>
              <p class="subtitle">个性化学习体验围绕用户输入与操作轨迹展开，同时融入直观的可视化动画演示</p>
                </div>

            <div class="features-section">
              <div class="feature-card">
                <div class="feature-icon">
                  <Icon icon="lucide:user-check" class="icon" />
                </div>
                <h3>个性化学习</h3>
                <p>基于用户输入的正则式、文法等信息，提供完全个性化的练习内容</p>
                <div class="feature-examples">
                  <div class="example-item">
                    <span class="example-label">不同正则式</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">不同的NFA结构</span>
              </div>
                  <div class="example-item">
                    <span class="example-label">不同文法</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">不同的First集</span>
                  </div>
                </div>
              </div>

              <div class="feature-card">
                <div class="feature-icon">
                  <Icon icon="lucide:activity" class="icon" />
                </div>
                <h3>操作轨迹记录</h3>
                <p>平台会记录用户操作过程，实现学习轨迹的完整追踪</p>
                <div class="feature-examples">
                  <div class="example-item">
                    <span class="example-label">绘制NFA</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">节点添加顺序</span>
                  </div>
                  <div class="example-item">
                    <span class="example-label">计算分析表</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">填写修改记录</span>
                  </div>
                </div>
              </div>

              <div class="feature-card">
                <div class="feature-icon">
                  <Icon icon="lucide:eye" class="icon" />
                </div>
                <h3>动态可视化</h3>
                <p>LL1、LR0、SLR1等模块中，字符串分析等过程都有动态可视化动画演示</p>
                <div class="feature-examples">
                  <div class="example-item">
                    <span class="example-label">每一步操作</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">清晰观察</span>
                  </div>
                  <div class="example-item">
                    <span class="example-label">算法流程</span>
                    <span class="example-arrow">→</span>
                    <span class="example-result">直观理解</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第9页：AI助手和设计理念 -->
        <div class="slide slide-9" :class="{ 'active': currentSlide === 7 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">AI助手与设计理念</h1>
              <p class="subtitle">系统的个性化学习体验围绕用户输入与操作轨迹展开，同时融入直观的可视化动画演示</p>
            </div>

            <div class="ai-assistant-section">
              <div class="ai-header">
                <div class="ai-icon">
                  <Icon icon="lucide:bot" class="icon" />
                </div>
                <h2>AI教学助手</h2>
              </div>
              <div class="ai-content">
                <div class="ai-feature">
                  <h3>可视化引擎</h3>
                  <p>融进了含有可视化引擎的AI教学助手，基于用户的答题轨迹与平台的知识库精准答疑</p>
                </div>
                <div class="ai-feature">
                  <h3>定制化反馈</h3>
                  <p>提供定制化反馈，让练习和指导与学习轨迹绑定，实现"千人千面"的定制化学习</p>
                </div>
              </div>
            </div>

            <div class="design-philosophy">
              <h2>设计理念</h2>
              <div class="philosophy-content">
                <div class="philosophy-item">
                  <div class="philosophy-icon">
                    <Icon icon="lucide:target" class="icon" />
                  </div>
                  <div class="philosophy-text">
                    <h3>用户输入为起点</h3>
                    <p>每个用户的练习内容都基于其独特的输入信息</p>
                  </div>
                </div>
                <div class="philosophy-item">
                  <div class="philosophy-icon">
                    <Icon icon="lucide:map" class="icon" />
                  </div>
                  <div class="philosophy-text">
                    <h3>操作轨迹为依据</h3>
                    <p>学习轨迹的完整记录为个性化指导提供依据</p>
                  </div>
                </div>
                <div class="philosophy-item">
                  <div class="philosophy-icon">
                    <Icon icon="lucide:users" class="icon" />
                  </div>
                  <div class="philosophy-text">
                    <h3>千人千面</h3>
                    <p>确保每个用户的练习内容和辅导方案多样化</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第10页：步骤拆解体现知识结构 -->
        <div class="slide slide-10" :class="{ 'active': currentSlide === 8 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">步骤拆解体现知识结构</h1>
              <p class="subtitle">每个模块都被拆解为符合逻辑递进关系的详细步骤，这种拆解方式并非简单的流程切割，而是基于《编译原理》学科知识的内在结构进行的启发式设计</p>
            </div>

            <div class="knowledge-structure-section">
              <div class="structure-intro">
                <h2>启发式知识分解</h2>
                <p>基于《编译原理》学科知识的内在结构进行的启发式设计，每一步都对应着核心知识点的递进关系</p>
              </div>

              <div class="structure-features">
                <div class="structure-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:layers" class="icon" />
                  </div>
                  <h3>逻辑递进</h3>
                  <p>符合知识结构的逻辑递进关系，从基础到高级逐步深入</p>
                </div>
                <div class="structure-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:target" class="icon" />
                  </div>
                  <h3>核心知识点</h3>
                  <p>每一步都对应着模块的核心知识点，确保学习重点明确</p>
                </div>
                <div class="structure-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:check-circle" class="icon" />
                  </div>
                  <h3>验证机制</h3>
                  <p>每一步都有明确的操作指引和验证机制，确保学习效果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第11页：有限自动机步骤拆解示例 -->
        <div class="slide slide-11" :class="{ 'active': currentSlide === 9 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">有限自动机步骤拆解示例</h1>
              <p class="subtitle">以有限自动机（FA）为例，展示从正则式输入到DFA构建与最小化的完整流程</p>
            </div>

            <div class="fa-steps-section">
              <div class="fa-flow-container">
                <div class="fa-step-card">
                  <div class="step-header">
                    <div class="step-icon">
                      <Icon icon="lucide:file-text" class="icon" />
                    </div>
                    <h4>正则式输入</h4>
                  </div>
                  <div class="step-content">
                    <p>用户输入正则表达式，系统进行语法验证</p>
                  </div>
                  <div class="step-decoration">
                    <div class="decoration-dot"></div>
                    <div class="decoration-line"></div>
                  </div>
                </div>

                <div class="flow-arrow">
                  <Icon icon="lucide:arrow-right" class="arrow-icon" />
                </div>

                <div class="fa-step-card">
                  <div class="step-header">
                    <div class="step-icon">
                      <Icon icon="lucide:git-branch" class="icon" />
                    </div>
                    <h4>NFA 绘制</h4>
                  </div>
                  <div class="step-content">
                    <p>动态构建NFA状态图，可视化展示转换过程</p>
                  </div>
                  <div class="step-decoration">
                    <div class="decoration-dot"></div>
                    <div class="decoration-line"></div>
                  </div>
                </div>

                <div class="flow-arrow">
                  <Icon icon="lucide:arrow-right" class="arrow-icon" />
                </div>

                <div class="fa-step-card">
                  <div class="step-header">
                    <div class="step-icon">
                      <Icon icon="lucide:network" class="icon" />
                    </div>
                    <h4>子集法转换</h4>
                  </div>
                  <div class="step-content">
                    <p>逐步展示子集构造算法，生成DFA状态</p>
                  </div>
                  <div class="step-decoration">
                    <div class="decoration-dot"></div>
                    <div class="decoration-line"></div>
                  </div>
                </div>

                <div class="flow-arrow">
                  <Icon icon="lucide:arrow-right" class="arrow-icon" />
                </div>

                <div class="fa-step-card">
                  <div class="step-header">
                    <div class="step-icon">
                      <Icon icon="lucide:target" class="icon" />
                    </div>
                    <h4>DFA 构建与最小化</h4>
                  </div>
                  <div class="step-content">
                    <p>完成DFA构建并进行状态最小化优化</p>
                  </div>
                  <div class="step-decoration">
                    <div class="decoration-dot"></div>
                    <div class="decoration-line"></div>
                  </div>
                </div>
              </div>

              <div class="fa-description">
                <h3>词法分析模块的核心知识点递进</h3>
                <p>每一步都对应着词法分析模块的核心知识点递进，且每一步都有明确的操作指引和验证机制；步骤清晰且紧密衔接，能帮助学生逐步攻克复杂问题。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 第12页：线上智能管控解题过程 -->
        <div class="slide slide-12" :class="{ 'active': currentSlide === 10 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">线上智能管控解题过程</h1>
              <p class="subtitle">系统并非单纯的工具载体，而是对整个解题流程实现了智能化管控</p>
            </div>

            <div class="control-process-section">
              <div class="control-intro">
                <h2>智能化管控机制</h2>
                <p>从用户输入的有效性验证，到每一步操作的实时校验，再到错误节点的及时提醒，都通过线上管控机制确保学习过程的规范性和有效性</p>
              </div>

              <div class="control-features">
                <div class="control-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:check-circle" class="icon" />
                  </div>
                  <h3>输入验证</h3>
                  <p>实时验证用户输入的正则式、文法等内容的语法正确性</p>
                </div>
                <div class="control-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:eye" class="icon" />
                  </div>
                  <h3>实时校验</h3>
                  <p>对每一步操作进行实时校验，确保操作的正确性和规范性</p>
                </div>
                <div class="control-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:alert-triangle" class="icon" />
                  </div>
                  <h3>错误提醒</h3>
                  <p>及时发现并提醒错误节点，避免学生在错误路径上盲目探索</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第13页：管控效果与学习效率 -->
        <div class="slide slide-13" :class="{ 'active': currentSlide === 11 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">管控效果与学习效率</h1>
              <p class="subtitle">通过线上管控机制确保学习过程的规范性和有效性，提升学习效率</p>
            </div>

            <div class="efficiency-section">
              <div class="efficiency-intro">
                <h2>学习效率提升</h2>
                <p>避免学生在错误路径上盲目探索，通过智能管控机制提升学习效率</p>
              </div>

              <div class="efficiency-benefits">
                <div class="benefit-item">
                  <div class="benefit-icon">
                    <Icon icon="lucide:zap" class="icon" />
                  </div>
                  <div class="benefit-content">
                    <h3>快速纠错</h3>
                    <p>及时发现错误并给出纠正建议，避免错误累积</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon">
                    <Icon icon="lucide:target" class="icon" />
                  </div>
                  <div class="benefit-content">
                    <h3>精准指导</h3>
                    <p>基于错误类型提供精准的学习指导和改进建议</p>
                  </div>
                </div>
                <div class="benefit-item">
                  <div class="benefit-icon">
                    <Icon icon="lucide:trending-up" class="icon" />
                  </div>
                  <div class="benefit-content">
                    <h3>效率提升</h3>
                    <p>通过规范化流程和智能提醒，显著提升学习效率</p>
                  </div>
                </div>
              </div>

              <div class="control-summary">
                <h3>智能管控的核心价值</h3>
                <p>系统不仅是一个工具，更是一个智能化的学习伙伴，通过全方位的管控机制，确保每个学习环节都高效、规范、有效，让学习过程更加顺畅和高效。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 第14页：进入学习页 -->
        <div class="slide slide-14" :class="{ 'active': currentSlide === 12 }">
          <div class="slide-content">
            <div class="header-section">
              <h1 class="main-title">进入学习</h1>
              <p class="subtitle">接下来，让我们逐一探索这些模块如何通过细致步骤、个性化交互以及智能化管控，让编译原理的学习变得可触、可感、可操作。</p>
            </div>

            <div class="learning-intro-section">
              <div class="learning-intro">
                <h2>学习体验的核心要素</h2>
                <p>通过细致步骤、个性化交互以及智能化管控，让编译原理的学习变得可触、可感、可操作</p>
              </div>

              <div class="learning-features">
                <div class="learning-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:layers" class="icon" />
                  </div>
                  <div class="feature-content">
                    <h3>细致步骤</h3>
                    <p>每个模块都被拆解为符合逻辑递进关系的详细步骤，基于学科知识的内在结构进行启发式设计</p>
                  </div>
                </div>
                <div class="learning-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:user-check" class="icon" />
                  </div>
                  <div class="feature-content">
                    <h3>个性化交互</h3>
                    <p>基于用户输入与操作轨迹，提供完全个性化的练习内容和定制化反馈</p>
                  </div>
                </div>
                <div class="learning-feature">
                  <div class="feature-icon">
                    <Icon icon="lucide:shield-check" class="icon" />
                  </div>
                  <div class="feature-content">
                    <h3>智能化管控</h3>
                    <p>从输入验证到实时校验，再到错误提醒，确保学习过程的规范性和有效性</p>
                  </div>
                </div>
              </div>

              <div class="learning-summary">
                <h3>可触、可感、可操作</h3>
                <p>让抽象的编译原理概念变得具体化，通过可视化动画和交互式操作，让学习过程更加直观和高效。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 第15页：感谢页面 -->
        <div class="slide slide-15" :class="{ 'active': currentSlide === 13 }">
          <div class="slide-content">
            <!-- 感谢标题 -->
            <div class="thank-you-title">
              <h1 class="main-title">感谢各位评委的聆听</h1>
              <p class="subtitle">Thank You for Your Attention</p>
            </div>

            <!-- 团队和指导老师信息 -->
            <div class="team-advisor-section">
              <!-- 指导老师 -->
              <div class="advisor-section">
                <h2 class="section-title">指导老师</h2>
                <div class="advisor-info">
                  <div class="advisor-avatar">
                    <Icon icon="lucide:graduation-cap" class="advisor-icon" />
                  </div>
                  <div class="advisor-content">
                    <span class="advisor-name">吴昱</span>
                    <p class="advisor-thanks">感谢老师的悉心指导与支持，让我们在编译原理的学习道路上不断进步，收获满满的知识与成长</p>
                  </div>
                </div>
              </div>

              <!-- 开发团队信息 -->
              <div class="team-section">
                <h2 class="section-title">开发小组</h2>
                <div class="team-members">
                  <div class="member-item">
                    <div class="member-avatar">
                      <Icon icon="lucide:file-text" class="avatar-icon" />
                    </div>
                    <span class="member-name">罗浩加</span>
                  </div>
                  <div class="member-item">
                    <div class="member-avatar">
                      <Icon icon="lucide:layers" class="avatar-icon" />
                    </div>
                    <span class="member-name">杨竣淇</span>
                  </div>
                  <div class="member-item">
                    <div class="member-avatar">
                      <Icon icon="lucide:video" class="avatar-icon" />
                    </div>
                    <span class="member-name">陈梓涛</span>
                  </div>
                  <div class="member-item">
                    <div class="member-avatar">
                      <Icon icon="lucide:search" class="avatar-icon" />
                    </div>
                    <span class="member-name">吴俊安</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- 全屏时隐藏的控制按钮 -->
      <div v-if="!isFullscreen" class="top-slide-controls">
        <div class="slide-indicators">
          <button
            v-for="i in 14"
            :key="i"
            @click="goToSlide(i - 1)"
            class="indicator"
            :class="{ active: currentSlide === i - 1 }"
            :disabled="isTransitioning"
          ></button>
        </div>
        <div class="control-buttons">
          <button @click="previousSlide" class="control-btn" :disabled="isTransitioning">
            <Icon icon="lucide:chevron-left" class="control-icon" />
          </button>
          <button @click="nextSlide" class="control-btn" :disabled="isTransitioning">
            <Icon icon="lucide:chevron-right" class="control-icon" />
          </button>
        </div>
      </div>

      <!-- 全屏时隐藏的控制面板 -->
      <div v-if="!isFullscreen" class="top-control-panel">
        <button @click="toggleAutoPlay" class="control-btn" :class="{ active: autoPlayEnabled }">
          <Icon :icon="autoPlayEnabled ? 'lucide:pause' : 'lucide:play'" class="control-icon" />
        </button>
        <button @click="toggleFullscreen" class="control-btn">
          <Icon :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" class="control-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'VideoIntroNewPage'
})

const currentSlide = ref(0)
const isFullscreen = ref(false)
const isTransitioning = ref(false)
const autoPlayEnabled = ref(false)
let autoPlayTimer: number | null = null

// 粒子样式生成
const getParticleStyle = (index: number) => {
  // 使用索引确保每个粒子的样式一致
  const seed = index * 137.5 // 黄金角度
  const delay = (seed % 8) // 减少延迟，让动画更快开始
  const duration = 8 + (seed % 12) // 减少持续时间，让动画更快
  const x = (seed * 1.618) % 100
  const y = (seed * 0.618) % 100
  const size = 6 + (seed % 16) // 增加粒子大小
  const rotationSpeed = 0.3 + (seed % 1.5) // 加快旋转速度
  const pulseSpeed = 0.8 + (seed % 1.2) // 加快脉冲速度
  const movementRange = 50 + (seed % 80) // 增加运动范围

  const colors = [
    'linear-gradient(45deg, #ff6b6b, #ee5a24)', // 鲜艳的红色
    'linear-gradient(45deg, #4834d4, #686de0)', // 深蓝色
    'linear-gradient(45deg, #00d2d3, #54a0ff)', // 青色到蓝色
    'linear-gradient(45deg, #ff9ff3, #f368e0)', // 粉色
    'linear-gradient(45deg, #feca57, #ff9ff3)', // 黄色到粉色
    'linear-gradient(45deg, #48dbfb, #0abde3)', // 亮蓝色
    'linear-gradient(45deg, #1dd1a1, #10ac84)', // 绿色
    'linear-gradient(45deg, #ff9f43, #ee5a24)', // 橙色
    'linear-gradient(45deg, #a55eea, #8854d0)', // 紫色
    'linear-gradient(45deg, #fd79a8, #e84393)', // 玫瑰色
    'linear-gradient(45deg, #00b894, #00cec9)', // 青绿色
    'linear-gradient(45deg, #fdcb6e, #e17055)', // 金黄色
    'linear-gradient(45deg, #6c5ce7, #a29bfe)', // 靛蓝色
    'linear-gradient(45deg, #fd79a8, #fdcb6e)', // 粉色到黄色
    'linear-gradient(45deg, #00cec9, #74b9ff)'  // 青色到蓝色
  ]
  const colorIndex = Math.floor(seed % colors.length)
  const randomColor = colors[colorIndex]

  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--x': `${x}%`,
    '--y': `${y}%`,
    '--color': randomColor,
    '--size': `${size}px`,
    '--rotation-speed': `${rotationSpeed}s`,
    '--pulse-speed': `${pulseSpeed}s`,
    '--movement-range': `${movementRange}px`
  }
}

// 获取粒子动画类型
const getParticleAnimationType = (index: number) => {
  const animationTypes = ['float', 'spiral', 'wave', 'bounce', 'orbit']
  const seed = index * 137.5
  const typeIndex = Math.floor(seed % animationTypes.length)
  return animationTypes[typeIndex]
}

// 获取粒子形状
const getParticleShape = (index: number) => {
  const shapes = ['circle', 'square', 'triangle', 'star']
  const seed = index * 137.5
  const shapeIndex = Math.floor(seed % shapes.length)
  return shapes[shapeIndex]
}

// 幻灯片控制
const nextSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true
    if (currentSlide.value < 13) {
      currentSlide.value++
    } else {
      currentSlide.value = 0
    }
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

const previousSlide = () => {
  if (!isTransitioning.value) {
    isTransitioning.value = true
    if (currentSlide.value > 0) {
      currentSlide.value--
    } else {
      currentSlide.value = 13
    }
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index <= 13 && index !== currentSlide.value && !isTransitioning.value) {
    isTransitioning.value = true
    currentSlide.value = index
    setTimeout(() => {
      isTransitioning.value = false
    }, 800)
  }
}

// 自动播放
const startAutoPlay = () => {
  autoPlayTimer = window.setInterval(() => {
    if (currentSlide.value < 13) {
      currentSlide.value++
    } else {
      currentSlide.value = 0
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const toggleAutoPlay = () => {
  autoPlayEnabled.value = !autoPlayEnabled.value
  if (autoPlayEnabled.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

// 全屏控制
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 键盘控制
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowRight':
    case ' ':
      event.preventDefault()
      nextSlide()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousSlide()
      break
    case 'Escape':
      if (document.fullscreenElement) {
        document.exitFullscreen()
        isFullscreen.value = false
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopAutoPlay()
})
</script>

<style scoped>
.video-intro-container {
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* PPT动画框 */
.ppt-frame {
  width: 90vw;
  height: 90vh;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%);
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  transition: all 0.3s ease;
}

.ppt-frame.fullscreen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  box-shadow: none;
}

/* 背景颗粒动画 */
.background-animation {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.6;
  overflow: hidden;
}

.particles {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  left: var(--x);
  top: var(--y);
  opacity: 0.9;
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.6),
    0 0 40px rgba(255, 255, 255, 0.4),
    0 0 60px rgba(255, 255, 255, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
  animation:
    particleFloat var(--duration) ease-in-out infinite,
    particlePulse var(--pulse-speed) ease-in-out infinite,
    particleRotate var(--rotation-speed) linear infinite;
  animation-delay: var(--delay);
  filter: blur(0.2px);
  backdrop-filter: blur(0.5px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 1;
}

.particle:hover {
  transform: scale(2);
  box-shadow:
    0 0 40px rgba(255, 255, 255, 0.9),
    0 0 80px rgba(255, 255, 255, 0.7),
    0 0 120px rgba(255, 255, 255, 0.5),
    inset 0 0 25px rgba(255, 255, 255, 0.6);
  z-index: 10;
  opacity: 1;
}

/* 不同形状的粒子 */
.particle-square {
  border-radius: 4px;
  transform: rotate(45deg);
}

.particle-triangle {
  border-radius: 0;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.particle-star {
  border-radius: 0;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

/* 基础浮动动画 */
@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
  }
  25% {
    transform: translateY(calc(-1 * var(--movement-range))) translateX(calc(var(--movement-range) * 0.3)) scale(1.1);
  }
  50% {
    transform: translateY(calc(-1 * var(--movement-range) * 1.5)) translateX(calc(-1 * var(--movement-range) * 0.2)) scale(0.9);
  }
  75% {
    transform: translateY(calc(-1 * var(--movement-range) * 0.8)) translateX(calc(var(--movement-range) * 0.4)) scale(1.05);
  }
}

/* 脉冲动画 */
@keyframes particlePulse {
  0%, 100% {
    opacity: 0.9;
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.6),
      0 0 40px rgba(255, 255, 255, 0.4),
      0 0 60px rgba(255, 255, 255, 0.2),
      inset 0 0 15px rgba(255, 255, 255, 0.3);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.8),
      0 0 60px rgba(255, 255, 255, 0.6),
      0 0 90px rgba(255, 255, 255, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
}

/* 旋转动画 */
@keyframes particleRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 螺旋动画 */
.particle[data-animation="spiral"] {
  animation: particleSpiral var(--duration) ease-in-out infinite !important;
}

@keyframes particleSpiral {
  0% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-50px) translateX(30px) scale(1.3) rotate(90deg);
  }
  50% {
    transform: translateY(-80px) translateX(-20px) scale(0.7) rotate(180deg);
  }
  75% {
    transform: translateY(-40px) translateX(40px) scale(1.2) rotate(270deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(360deg);
  }
}

/* 波浪动画 */
.particle[data-animation="wave"] {
  animation: particleWave var(--duration) ease-in-out infinite !important;
}

@keyframes particleWave {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
  }
  33% {
    transform: translateY(-60px) translateX(35px) scale(1.4);
  }
  66% {
    transform: translateY(-30px) translateX(-25px) scale(0.6);
  }
}

/* 弹跳动画 */
.particle[data-animation="bounce"] {
  animation: particleBounce var(--duration) cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite !important;
}

@keyframes particleBounce {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  25% {
    transform: translateY(-70px) scale(1.3);
  }
  50% {
    transform: translateY(-100px) scale(0.7);
  }
  75% {
    transform: translateY(-40px) scale(1.2);
  }
}

/* 轨道动画 */
.particle[data-animation="orbit"] {
  animation: particleOrbit var(--duration) linear infinite !important;
}

@keyframes particleOrbit {
  0% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-35px) translateX(35px) scale(1.2) rotate(90deg);
  }
  50% {
    transform: translateY(-70px) translateX(0px) scale(0.8) rotate(180deg);
  }
  75% {
    transform: translateY(-35px) translateX(-35px) scale(1.1) rotate(270deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(360deg);
  }
}

/* 广州大学Logo */
.university-logo {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  padding: 0;
  border: none;
  box-shadow: none;
}

.logo-svg {
  width: 48px;
  height: 48px;
}

.logo-text {
  height: 36px;
  width: auto;
}

/* 幻灯片容器 */
.slides-wrapper {
  position: relative;
  width: 1400%;
  height: 100%;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.slide {
  width: calc(100% / 14);
  min-width: calc(100% / 14);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active {
  opacity: 1;
  transform: scale(1);
}

.slide-content {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  color: #1e293b;
}

/* 第1页：标题页 */
.slide-1 {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
}

.slide-1.active .logo-animation {
  animation: logoAppear 2s ease-out forwards;
}

.slide-1.active .main-title {
  animation: titleSlideIn 1.5s ease-out 0.5s forwards;
}

.slide-1.active .subtitle {
  animation: subtitleFadeIn 2s ease-out 1s forwards;
}

.logo-animation {
  margin-bottom: 3rem;
  opacity: 0;
  transform: scale(0.5) rotate(-180deg);
}

.logo-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: logoPulse 3s ease-in-out infinite;
  box-shadow: 0 0 50px rgba(59, 130, 246, 0.3);
}

.logo-icon {
  width: 60px;
  height: 60px;
  color: white;
}

@keyframes logoAppear {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 50px rgba(59, 130, 246, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px rgba(59, 130, 246, 0.5);
  }
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(50px);
  color: #1e293b;
}

.title-line {
  display: block;
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
  50% {
    text-shadow: 0 0 40px rgba(59, 130, 246, 0.4);
  }
}

.subtitle {
  font-size: 1.5rem;
  color: #64748b;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes subtitleFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 通用幻灯片样式 */
.slide-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  line-height: 1.3;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* 第2页：核心基石 */
.slide-2.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-2.active .concept-item:nth-child(1) {
  animation: cardSlideInLeft 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-2.active .concept-item:nth-child(2) {
  animation: cardSlideInUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s forwards;
}

.slide-2.active .concept-item:nth-child(3) {
  animation: cardSlideInRight 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.1s forwards;
}

.concept-text {
  margin-top: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.main-text {
  font-size: 1.3rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 3rem;
  width: 100%;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.concept-item {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.concept-item:hover {
  transform: translateY(-15px) scale(1.03);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.concept-item:hover .concept-icon {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.concept-icon {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.concept-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.concept-item h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.concept-item p {
  color: #64748b;
  font-size: 1rem;
}

/* 第3页：抽象概念挑战 */
.slide-3.active .slide-title {
  animation: titleSlideIn 1.2s ease-out 0.5s forwards;
}

.slide-3.active .main-text {
  animation: textSlideIn 1.2s ease-out 0.8s forwards;
}

.slide-3.active .concept-flow-item:nth-child(1) { animation: flowItemSlide 1.2s ease-out 1s forwards; }
.slide-3.active .flow-arrow:nth-child(2) { animation: arrowFadeIn 0.8s ease-out 1.2s forwards; }
.slide-3.active .concept-flow-item:nth-child(3) { animation: flowItemSlide 1.2s ease-out 1.5s forwards; }
.slide-3.active .flow-arrow:nth-child(4) { animation: arrowFadeIn 0.8s ease-out 1.7s forwards; }
.slide-3.active .concept-flow-item:nth-child(5) { animation: flowItemSlide 1.2s ease-out 2s forwards; }

.concepts-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.concept-flow-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  opacity: 0;
  transform: translateX(-50px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.flow-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.flow-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.flow-content h3 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.flow-content p {
  color: #64748b;
  font-size: 0.9rem;
}

.flow-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8) translateX(-20px);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.arrow-icon {
  width: 35px;
  height: 35px;
  color: #3b82f6;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2));
}

.flow-arrow:hover .arrow-icon {
  transform: scale(1.2) translateX(5px);
  color: #8b5cf6;
  filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3));
}

@keyframes flowItemSlide {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes arrowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* 第4页：现有工具的局限性 */
.slide-4.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.3s forwards;
}

.slide-4.active .main-text {
  animation: textSlideIn 1s ease-out 0.5s forwards;
}

.slide-4.active .highlight-text {
  animation: textSlideIn 1s ease-out 1.5s forwards;
}

.slide-4.active .limitation-card:nth-child(1) { animation: cardSlideIn 1s ease-out 2s forwards; }
.slide-4.active .limitation-card:nth-child(2) { animation: cardSlideIn 1s ease-out 2.5s forwards; }
.slide-4.active .limitation-card:nth-child(3) { animation: cardSlideIn 1s ease-out 3s forwards; }

.limitation-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.limitation-text {
  text-align: center;
  max-width: 800px;
}

.highlight-text {
  font-size: 1.5rem;
  color: #3b82f6;
  font-weight: bold;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
}

.limitation-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.limitation-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  transform: translateY(50px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.limitation-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.limitation-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.limitation-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.limitation-card p {
  color: #64748b;
  font-size: 1rem;
}

/* 第5页：核心需求与学习流程 */
.slide-5.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.2s forwards;
}

.slide-5.active .concept-content {
  animation: contentReveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
}

.slide-5.active .concept-title {
  animation: textSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
}

.slide-5.active .concept-description {
  animation: textSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.9s forwards;
}

.slide-5.active .flow-title {
  animation: titleSlideIn 1s ease-out 1.3s forwards;
}

.slide-5.active .flow-step:nth-child(1) {
  animation: stepSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.6s forwards;
}

.slide-5.active .flow-step:nth-child(3) {
  animation: stepSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.9s forwards;
}

.slide-5.active .flow-step:nth-child(5) {
  animation: stepSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.2s forwards;
}

.slide-5.active .flow-arrow:nth-child(2) {
  animation: arrowSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s forwards;
}

.slide-5.active .flow-arrow:nth-child(4) {
  animation: arrowSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.1s forwards;
}

/* 卡片动画类 */
.flow-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  padding: 1.8rem;
  min-width: 220px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.flow-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.flow-step:hover::before {
  left: 100%;
}

.flow-step:hover {
  transform: translateY(-12px) scale(1.03);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.flow-step:hover .step-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.step-icon {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.step-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.flow-step:hover .step-icon::after {
  transform: translateX(100%);
}

.concept-content {
  margin-top: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
}

.concept-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  opacity: 0;
  transform: translateY(30px);
}

.concept-description {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
}

.learning-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.flow-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #1e293b;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(30px);
}

.flow-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.step-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.step-content h4 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
  transition: color 0.3s ease;
}

.step-content p {
  font-size: 0.95rem;
  color: #64748b;
  transition: color 0.3s ease;
}

.flow-step:hover .step-content h4 {
  color: #3b82f6;
}

.flow-step:hover .step-content p {
  color: #475569;
}

/* 第7页：主观大题 */
.slide-7.active .slide-title {
  animation: titleSlideIn 1s ease-out 0.2s forwards;
}

.slide-7.active .subjective-intro {
  animation: introSlideEnhanced 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
}

.slide-7.active .subjective-intro h3 {
  animation: textSlideIn 1s ease-out 0.8s forwards;
}

.slide-7.active .subjective-intro p {
  animation: textSlideIn 1s ease-out 1.1s forwards;
}

.slide-7.active .subjective-grid {
  animation: gridAppearEnhanced 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.4s forwards;
}

.slide-7.active .subjective-item:nth-child(1) {
  animation: itemSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.7s forwards;
}

.slide-7.active .subjective-item:nth-child(2) {
  animation: itemSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2s forwards;
}

.slide-7.active .subjective-item:nth-child(3) {
  animation: itemSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.3s forwards;
}

.subjective-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

.subjective-intro {
  text-align: center;
  max-width: 800px;
  opacity: 0;
  transform: translateY(30px);
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.subjective-intro:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
}

.subjective-intro h3 {
  color: #3b82f6;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
}

.subjective-intro p {
  color: #475569;
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
}

.subjective-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  opacity: 0;
  transform: translateY(30px);
}

.subjective-item {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(40px) scale(0.9);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.subjective-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s ease;
}

.subjective-item:hover::before {
  left: 100%;
}

.subjective-item:hover {
  transform: translateY(-15px) scale(1.05);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 30px 60px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.subjective-item:hover .subjective-icon {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
}

.subjective-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.subjective-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.subjective-item:hover .subjective-icon::after {
  transform: translateX(100%);
}

.subjective-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
  transition: all 0.3s ease;
}

.subjective-item h4 {
  color: #1e293b;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.subjective-item p {
  color: #64748b;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.subjective-item:hover h4 {
  color: #3b82f6;
}

.subjective-item:hover p {
  color: #475569;
}



/* 控制按钮 */
.top-slide-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.slide-indicators {
  display: flex;
  gap: 0.25rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.indicator:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-icon {
  width: 16px;
  height: 16px;
}

.top-control-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-left: 12rem;
}

.top-control-panel .control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.top-control-panel .control-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: scale(1.1);
}

.top-control-panel .control-btn.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

/* 动画关键帧 */
@keyframes cardSlideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotateY(-15deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) rotateY(-5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg) scale(1);
  }
}

@keyframes cardSlideInUp {
  0% {
    opacity: 0;
    transform: translateY(100px) rotateX(15deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateY(20px) rotateX(5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg) scale(1);
  }
}

@keyframes cardSlideInRight {
  0% {
    opacity: 0;
    transform: translateX(100px) rotateY(15deg) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(20px) rotateY(5deg) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg) scale(1);
  }
}

@keyframes textSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes buttonAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes contentReveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes flowContainer {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes introSlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gridAppear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}



@keyframes stepSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes arrowFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes itemSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes stepSlideInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes arrowSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.6) translateX(-30px);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1) translateX(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

@keyframes introSlideEnhanced {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gridAppearEnhanced {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes itemSlideInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-8px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .slide-title {
    font-size: 2rem;
  }

  .concept-grid,
  .limitation-cards {
    grid-template-columns: 1fr;
  }

  .concepts-flow {
    flex-direction: column;
    gap: 1rem;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .solution-features {
    grid-template-columns: 1fr;
  }

  .subjective-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .features-section {
    grid-template-columns: 1fr;
  }

  .ai-content {
    grid-template-columns: 1fr;
  }

  .philosophy-content {
    grid-template-columns: 1fr;
  }

  .structure-features {
    grid-template-columns: 1fr;
  }

  .fa-flow-container {
    flex-direction: column;
    gap: 1rem;
  }

  .fa-step-card {
    min-width: 280px;
    width: 100%;
  }

  .fa-step-card .step-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .fa-flow-container .flow-arrow {
    transform: rotate(90deg);
  }

  .control-features {
    grid-template-columns: 1fr;
  }

  .efficiency-benefits {
    grid-template-columns: 1fr;
  }

  .benefit-item {
    flex-direction: column;
    text-align: center;
  }

  .learning-features {
    grid-template-columns: 1fr;
  }

  .learning-feature {
    flex-direction: column;
    text-align: center;
  }

  .flow-steps {
    flex-direction: column;
    gap: 1rem;
  }

  /* 第15页响应式设计 */
  .slide-15 .main-title {
    font-size: 2.5rem;
  }

  .slide-15 .subtitle {
    font-size: 1.2rem;
  }

  .slide-15 .slide-content {
    gap: 2rem;
    padding: 1rem;
  }

  .team-advisor-section {
    flex-direction: column;
    gap: 2rem;
    max-width: 100%;
  }

  .team-section {
    max-width: 100%;
  }

  .advisor-section {
    max-width: 100%;
  }

  .team-members {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .member-item {
    padding: 1rem;
    min-height: 100px;
  }

  .member-avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-icon {
    width: 30px;
    height: 30px;
  }

  .member-name {
    font-size: 1rem;
  }

  .advisor-info {
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    min-height: 200px;
  }

  .advisor-avatar {
    width: 90px;
    height: 90px;
  }

  .advisor-icon {
    width: 45px;
    height: 45px;
  }

  .advisor-content {
    gap: 1rem;
  }

  .advisor-name {
    font-size: 1.8rem;
  }

  .advisor-thanks {
    font-size: 1rem;
    max-width: 220px;
  }

.university-logo {
    top: 10px;
    right: 10px;
    padding: 0;
}

.logo-svg {
    width: 36px;
    height: 36px;
}

.logo-text {
    height: 28px;
  }
}

.concept-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

/* 第8页：个性化学习体验 */
.slide-8.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-8.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-8.active .feature-card:nth-child(1) {
  animation: featureCardSlideEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards, featureCardFloat 3s ease-in-out 6s infinite;
}

.slide-8.active .feature-card:nth-child(2) {
  animation: featureCardSlideEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 5s forwards, featureCardFloat 3s ease-in-out 9s infinite;
}

.slide-8.active .feature-card:nth-child(3) {
  animation: featureCardSlideEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 8s forwards, featureCardFloat 3s ease-in-out 12s infinite;
}

.slide-8.active .feature-icon:nth-child(1) {
  animation: featureIconSpin 1.5s ease-out 4.5s forwards, featureIconGlow 2s ease-in-out 6s infinite;
}

.slide-8.active .feature-icon:nth-child(2) {
  animation: featureIconSpin 1.5s ease-out 7.5s forwards, featureIconGlow 2s ease-in-out 9s infinite;
}

.slide-8.active .feature-icon:nth-child(3) {
  animation: featureIconSpin 1.5s ease-out 10.5s forwards, featureIconGlow 2s ease-in-out 12s infinite;
}

.slide-8.active .feature-card:nth-child(1) h3 {
  animation: textSlideIn 1s ease-out 4s forwards, textGlow 2s ease-in-out 6s infinite;
}

.slide-8.active .feature-card:nth-child(2) h3 {
  animation: textSlideIn 1s ease-out 7s forwards, textGlow 2s ease-in-out 9s infinite;
}

.slide-8.active .feature-card:nth-child(3) h3 {
  animation: textSlideIn 1s ease-out 10s forwards, textGlow 2s ease-in-out 12s infinite;
}

.slide-8.active .feature-card:nth-child(1) p {
  animation: textFadeIn 1.5s ease-out 4.2s forwards;
}

.slide-8.active .feature-card:nth-child(2) p {
  animation: textFadeIn 1.5s ease-out 7.2s forwards;
}

.slide-8.active .feature-card:nth-child(3) p {
  animation: textFadeIn 1.5s ease-out 10.2s forwards;
}

.slide-8.active .example-item:nth-child(1) {
  animation: exampleItemSlide 1s ease-out 5s forwards, exampleItemPulse 2s ease-in-out 7s infinite;
}

.slide-8.active .example-item:nth-child(2) {
  animation: exampleItemSlide 1s ease-out 5.3s forwards, exampleItemPulse 2s ease-in-out 7.3s infinite;
}

.slide-8.active .example-item:nth-child(3) {
  animation: exampleItemSlide 1s ease-out 8s forwards, exampleItemPulse 2s ease-in-out 10s infinite;
}

.slide-8.active .example-item:nth-child(4) {
  animation: exampleItemSlide 1s ease-out 8.3s forwards, exampleItemPulse 2s ease-in-out 10.3s infinite;
}

.slide-8.active .example-item:nth-child(5) {
  animation: exampleItemSlide 1s ease-out 11s forwards, exampleItemPulse 2s ease-in-out 13s infinite;
}

.slide-8.active .example-item:nth-child(6) {
  animation: exampleItemSlide 1s ease-out 11.3s forwards, exampleItemPulse 2s ease-in-out 13.3s infinite;
}

/* 第9页：AI助手和设计理念 */
.slide-9.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-9.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-9.active .ai-assistant-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-9.active .ai-header {
  animation: aiHeaderGlow 3s ease-in-out 3s infinite;
}

.slide-9.active .ai-icon {
  animation: aiIconRotate 2s ease-out 2.2s forwards, aiIconPulse 2s ease-in-out 4.5s infinite;
}

.slide-9.active .design-philosophy {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3.5s forwards;
}

.slide-9.active .philosophy-item:nth-child(1) {
  animation: philosophyItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards, philosophyItemFloat 3s ease-in-out 6s infinite;
}

.slide-9.active .philosophy-item:nth-child(2) {
  animation: philosophyItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.3s forwards, philosophyItemFloat 3s ease-in-out 6.3s infinite;
}

.slide-9.active .philosophy-item:nth-child(3) {
  animation: philosophyItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.6s forwards, philosophyItemFloat 3s ease-in-out 6.6s infinite;
}

.slide-9.active .philosophy-icon:nth-child(1) {
  animation: iconSpin 1.5s ease-out 4.5s forwards, iconGlow 2s ease-in-out 6.5s infinite;
}

.slide-9.active .philosophy-icon:nth-child(2) {
  animation: iconSpin 1.5s ease-out 4.8s forwards, iconGlow 2s ease-in-out 6.8s infinite;
}

.slide-9.active .philosophy-icon:nth-child(3) {
  animation: iconSpin 1.5s ease-out 5.1s forwards, iconGlow 2s ease-in-out 7.1s infinite;
}

/* 第8页和第9页的样式 */
/* 第8页到第13页的标题样式，与前面页面保持一致 */
.slide-8 .main-title,
.slide-9 .main-title,
.slide-10 .main-title,
.slide-11 .main-title,
.slide-12 .main-title,
.slide-13 .main-title,
.slide-14 .main-title,
.slide-15 .main-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  line-height: 1.3;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.feature-card:hover {
  transform: translateY(-15px) scale(1.03);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.feature-icon .icon {
  width: 40px;
  height: 40px;
  color: white;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1e293b;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
}

.feature-examples {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.example-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  opacity: 0;
  transform: translateX(-30px);
}

.example-label {
  color: #667eea;
  font-weight: 600;
}

.example-arrow {
  color: #764ba2;
  font-weight: bold;
}

.example-result {
  color: #f093fb;
  font-weight: 600;
}

/* AI助手部分 */
.ai-assistant-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(50px);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.ai-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.ai-header h2 {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.ai-feature h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 1rem;
}

.ai-feature p {
  color: #64748b;
  line-height: 1.6;
}

/* 设计理念部分 */
.design-philosophy {
  opacity: 0;
  transform: translateY(50px);
}

.design-philosophy h2 {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 3rem;
}

.philosophy-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.philosophy-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-50px);
}

.philosophy-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(10px) translateY(-5px);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.15);
}

.philosophy-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.philosophy-icon .icon {
  width: 30px;
  height: 30px;
  color: white;
}

.philosophy-text h3 {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.philosophy-text p {
  color: #64748b;
  line-height: 1.5;
}

/* 第10页和第11页的样式 */
/* 第10页：知识结构部分 */
.knowledge-structure-section {
  margin-top: 2rem;
}

.structure-intro {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.structure-intro h2 {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.structure-intro p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
}

.structure-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.structure-feature {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.structure-feature:hover {
  transform: translateY(-15px) scale(1.03);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.structure-feature:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.structure-feature .feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.structure-feature .feature-icon .icon {
  width: 35px;
  height: 35px;
  color: white;
}

.structure-feature h3 {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1e293b;
}

.structure-feature p {
  color: #64748b;
  line-height: 1.6;
}

/* 第11页：有限自动机步骤部分 */
.fa-steps-section {
  margin-top: 2rem;
}

/* 第12页：线上智能管控解题过程 */
.control-process-section {
  margin-top: 2rem;
}

.control-intro {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.control-intro h2 {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.control-intro p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
}

.control-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.control-feature {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.control-feature:hover {
  transform: translateY(-15px) scale(1.03);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.control-feature:hover .feature-icon {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.control-feature .feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.control-feature .feature-icon .icon {
  width: 35px;
  height: 35px;
  color: white;
}

.control-feature h3 {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1e293b;
}

.control-feature p {
  color: #64748b;
  line-height: 1.6;
}

/* 第13页：管控效果与学习效率 */
.efficiency-section {
  margin-top: 0.5rem;
}

.efficiency-intro {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.efficiency-intro h2 {
  font-size: 1.6rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.6rem;
}

.efficiency-intro p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.4;
}

.efficiency-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-50px);
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(10px) translateY(-5px);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.15);
}

.benefit-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon .icon {
  width: 25px;
  height: 25px;
  color: white;
}

.benefit-content h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 0.3rem;
}

.benefit-content p {
  color: #64748b;
  line-height: 1.3;
  font-size: 0.9rem;
}

.control-summary {
  text-align: center;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px);
}

.control-summary h3 {
  font-size: 1.6rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.8rem;
}

.control-summary p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
}

/* 第14页：进入学习页 */
.learning-intro-section {
  margin-top: 0.5rem;
}

.learning-intro {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.learning-intro h2 {
  font-size: 1.6rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.6rem;
}

.learning-intro p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.4;
}

.learning-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.learning-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-50px);
}

.learning-feature:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(10px) translateY(-5px);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.15);
}

.learning-feature .feature-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.learning-feature .feature-icon .icon {
  width: 25px;
  height: 25px;
  color: white;
}

.learning-feature .feature-content h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 0.3rem;
}

.learning-feature .feature-content p {
  color: #64748b;
  line-height: 1.3;
  font-size: 0.9rem;
}

.learning-summary {
  text-align: center;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px);
}

.learning-summary h3 {
  font-size: 1.6rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.8rem;
}

.learning-summary p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
}

/* 第15页：感谢页面 */
.slide-15 {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
}

.slide-15 .slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
}

/* 感谢标题 */
.thank-you-title {
  opacity: 0;
  transform: translateX(-100vw) scale(0.3);
  animation: thankYouTitleSlideIn 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
  margin-bottom: 2rem;
  text-align: center;
}

.slide-15.active .thank-you-title {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.slide-15 .main-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: thankYouTitleGlow 3s ease-in-out infinite, thankYouTitleBreath 4s ease-in-out infinite;
  line-height: 1.2;
  opacity: 1;
}

.slide-15 .subtitle {
  font-size: 1.5rem;
  color: #64748b;
  opacity: 0.8;
  font-weight: 500;
}

.slide-15.active .main-title {
  opacity: 1;
}

.slide-15.active .subtitle {
  opacity: 0.8;
}

/* 团队和指导老师容器 */
.team-advisor-section {
  display: flex;
  gap: 4rem;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: scale(0.1) rotate(180deg);
  animation: teamAdvisorZoomIn 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
  max-width: 1200px;
  width: 100%;
}

/* 开发团队 */
.team-section {
  opacity: 1;
  transform: none;
  animation: none;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  flex: 1;
  max-width: 600px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1e293b;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.team-members {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  justify-content: center;
  flex: 1;
  align-items: stretch;
  margin-top: 1rem;
  height: 100%;
  min-height: 300px;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.2rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  min-height: 120px;
  height: 100%;
  justify-content: center;
}

.member-item:nth-child(1) { animation: member1WaveIn 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.2s forwards; }
.member-item:nth-child(2) { animation: member2SpiralIn 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.8s forwards; }
.member-item:nth-child(3) { animation: member3ZoomIn 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 5.4s forwards; }
.member-item:nth-child(4) { animation: member4ShakeIn 1.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) 6s forwards; }

.member-item:hover {
  transform: translateY(-10px) scale(1.05);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

/* 成员卡片持续动画 */
.member-item {
  animation: memberFloat 6s ease-in-out infinite;
}

.member-item:nth-child(1) { animation-delay: 0s; }
.member-item:nth-child(2) { animation-delay: 1.5s; }
.member-item:nth-child(3) { animation-delay: 3s; }
.member-item:nth-child(4) { animation-delay: 4.5s; }

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 不同成员的图标背景颜色 */
.member-item:nth-child(1) .member-avatar {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.member-item:nth-child(2) .member-avatar {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
}

.member-item:nth-child(3) .member-avatar {
  background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%);
  box-shadow: 0 0 20px rgba(168, 230, 207, 0.5);
}

.member-item:nth-child(4) .member-avatar {
  background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
  box-shadow: 0 0 20px rgba(255, 217, 61, 0.5);
}

.member-item:nth-child(1):hover .member-avatar {
  animation: avatarPulseRed 2s ease-in-out infinite;
}

.member-item:nth-child(2):hover .member-avatar {
  animation: avatarPulseTeal 2s ease-in-out infinite;
}

.member-item:nth-child(3):hover .member-avatar {
  animation: avatarPulseGreen 2s ease-in-out infinite;
}

.member-item:nth-child(4):hover .member-avatar {
  animation: avatarPulseYellow 2s ease-in-out infinite;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.member-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1e293b;
  text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
}

/* 指导老师 */
.advisor-section {
  opacity: 0;
  transform: scale(0.5) rotateY(-90deg);
  animation: advisorSlideIn 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3.5s forwards;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  flex: 1;
  max-width: 400px;
}

.advisor-info {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.5rem;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
  height: 100%;
  min-height: 300px;
}

.advisor-info:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

/* 指导老师持续动画 */
.advisor-info {
  animation: advisorPulse 5s ease-in-out infinite;
}

.advisor-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.advisor-info:hover .advisor-avatar {
  animation: advisorAvatarPulse 2s ease-in-out infinite;
}

.advisor-icon {
  width: 50px;
  height: 50px;
  color: white;
}

.advisor-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
}

.advisor-name {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1e293b;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.advisor-thanks {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.5;
  max-width: 280px;
  margin: 0;
  text-align: center;
}

.fa-flow-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.fa-step-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(50px);
}

.fa-step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.fa-step-card:hover::before {
  opacity: 1;
}

.fa-step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
}

.fa-step-card .step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  justify-content: center;
}

.fa-step-card .step-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
}

.fa-step-card .step-icon .icon {
  width: 22px;
  height: 22px;
  color: white;
}

.fa-step-card .step-header h4 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.fa-step-card .step-content {
  text-align: center;
  flex: 1;
}

.fa-step-card .step-content p {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.fa-step-card .step-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fa-step-card .decoration-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border-radius: 50%;
  animation: decorationPulse 2s ease-in-out infinite;
}

.fa-step-card .decoration-line {
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
  animation: decorationFlow 3s ease-in-out infinite;
}

.fa-flow-container .flow-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.5);
}

.fa-flow-container .flow-arrow .arrow-icon {
  width: 24px;
  height: 24px;
  color: #10b981;
  filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
}

.fa-description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px);
}

.fa-description h3 {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.fa-description p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* 第8页和第9页的动画关键帧 */
@keyframes titleSlideInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.5) rotateX(90deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-20px) scale(1.1) rotateX(-10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes subtitleFadeInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  50% {
  opacity: 0.5;
    transform: translateY(-10px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes featureCardSlideEnhanced {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.5) rotateX(45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-30px) scale(1.1) rotateX(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes featureCardFloat {
  0%, 100% {
    transform: translateY(0) rotateX(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-10px) rotateX(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: translateY(-5px) rotateX(-2deg);
    box-shadow: 0 15px 30px rgba(118, 75, 162, 0.3);
  }
  75% {
    transform: translateY(-12px) rotateX(4deg);
    box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4);
  }
}

@keyframes featureIconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes featureIconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.15);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(102, 126, 234, 0.4);
    transform: scale(1.02);
  }
}

@keyframes exampleItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  50% {
    opacity: 0.8;
    transform: translateX(5px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes exampleItemPulse {
  0%, 100% {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
  background: rgba(102, 126, 234, 0.1);
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }
}

@keyframes sectionSlideInEnhanced {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.8) rotateY(45deg);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-30px) scale(1.05) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
  }
}

@keyframes aiHeaderGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
    transform: scale(1.02);
  }
}

@keyframes aiIconRotate {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(-90deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes aiIconPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 50px rgba(118, 75, 162, 0.6);
  }
}

@keyframes philosophyItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.5) rotateY(-45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) scale(1.1) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

@keyframes philosophyItemFloat {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: translateY(-5px) rotateY(-1deg);
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
  }
  75% {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
}

@keyframes iconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes iconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.1);
  }
}

/* 第10页：步骤拆解体现知识结构 */
.slide-10.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-10.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-10.active .knowledge-structure-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-10.active .structure-intro {
  animation: structureIntroSlide 1.5s ease-out 3s forwards, structureIntroGlow 3s ease-in-out 4.5s infinite;
}

.slide-10.active .structure-feature:nth-child(1) {
  animation: structureFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards, structureFeatureFloat 3s ease-in-out 6s infinite;
}

.slide-10.active .structure-feature:nth-child(2) {
  animation: structureFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.3s forwards, structureFeatureFloat 3s ease-in-out 6.3s infinite;
}

.slide-10.active .structure-feature:nth-child(3) {
  animation: structureFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.6s forwards, structureFeatureFloat 3s ease-in-out 6.6s infinite;
}

.slide-10.active .structure-feature:nth-child(1) .feature-icon {
  animation: structureIconSpin 1.5s ease-out 4.5s forwards, structureIconGlow 2s ease-in-out 6.5s infinite;
}

.slide-10.active .structure-feature:nth-child(2) .feature-icon {
  animation: structureIconSpin 1.5s ease-out 4.8s forwards, structureIconGlow 2s ease-in-out 6.8s infinite;
}

.slide-10.active .structure-feature:nth-child(3) .feature-icon {
  animation: structureIconSpin 1.5s ease-out 5.1s forwards, structureIconGlow 2s ease-in-out 7.1s infinite;
}

/* 第11页：有限自动机步骤拆解示例 */
.slide-11.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-11.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-11.active .fa-steps-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-11.active .fa-step-card:nth-child(1) {
  animation: faStepCardSlide 1.5s ease-out 3s forwards, faStepCardFloat 3s ease-in-out 5s infinite;
}

.slide-11.active .fa-step-card:nth-child(3) {
  animation: faStepCardSlide 1.5s ease-out 3.5s forwards, faStepCardFloat 3s ease-in-out 5.5s infinite;
}

.slide-11.active .fa-step-card:nth-child(5) {
  animation: faStepCardSlide 1.5s ease-out 4s forwards, faStepCardFloat 3s ease-in-out 6s infinite;
}

.slide-11.active .fa-step-card:nth-child(7) {
  animation: faStepCardSlide 1.5s ease-out 4.5s forwards, faStepCardFloat 3s ease-in-out 6.5s infinite;
}

.slide-11.active .fa-step-card:nth-child(1) .step-icon {
  animation: faStepIconSpin 1s ease-out 3.5s forwards, faStepIconGlow 2s ease-in-out 5.5s infinite;
}

.slide-11.active .fa-step-card:nth-child(3) .step-icon {
  animation: faStepIconSpin 1s ease-out 4s forwards, faStepIconGlow 2s ease-in-out 6s infinite;
}

.slide-11.active .fa-step-card:nth-child(5) .step-icon {
  animation: faStepIconSpin 1s ease-out 4.5s forwards, faStepIconGlow 2s ease-in-out 6.5s infinite;
}

.slide-11.active .fa-step-card:nth-child(7) .step-icon {
  animation: faStepIconSpin 1s ease-out 5s forwards, faStepIconGlow 2s ease-in-out 7s infinite;
}

.slide-11.active .flow-arrow:nth-child(2) {
  animation: faFlowArrowAppear 1s ease-out 3.2s forwards, faFlowArrowPulse 2s ease-in-out 4.2s infinite;
}

.slide-11.active .flow-arrow:nth-child(4) {
  animation: faFlowArrowAppear 1s ease-out 3.7s forwards, faFlowArrowPulse 2s ease-in-out 4.7s infinite;
}

.slide-11.active .flow-arrow:nth-child(6) {
  animation: faFlowArrowAppear 1s ease-out 4.2s forwards, faFlowArrowPulse 2s ease-in-out 5.2s infinite;
}

.slide-11.active .fa-description {
  animation: faDescriptionSlide 1.5s ease-out 5.5s forwards;
}

/* 第12页：线上智能管控解题过程 */
.slide-12.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-12.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
}

.slide-12.active .control-process-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-12.active .control-intro {
  animation: controlIntroSlide 1.5s ease-out 3s forwards, controlIntroGlow 3s ease-in-out 4.5s infinite;
}

.slide-12.active .control-feature:nth-child(1) {
  animation: controlFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards, controlFeatureFloat 3s ease-in-out 6s infinite;
}

.slide-12.active .control-feature:nth-child(2) {
  animation: controlFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.3s forwards, controlFeatureFloat 3s ease-in-out 6.3s infinite;
}

.slide-12.active .control-feature:nth-child(3) {
  animation: controlFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.6s forwards, controlFeatureFloat 3s ease-in-out 6.6s infinite;
}

.slide-12.active .control-feature:nth-child(1) .feature-icon {
  animation: controlIconSpin 1.5s ease-out 4.5s forwards, controlIconGlow 2s ease-in-out 6.5s infinite;
}

.slide-12.active .control-feature:nth-child(2) .feature-icon {
  animation: controlIconSpin 1.5s ease-out 4.8s forwards, controlIconGlow 2s ease-in-out 6.8s infinite;
}

.slide-12.active .control-feature:nth-child(3) .feature-icon {
  animation: controlIconSpin 1.5s ease-out 5.1s forwards, controlIconGlow 2s ease-in-out 7.1s infinite;
}

/* 第13页：管控效果与学习效率 */
.slide-13.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-13.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
  margin-bottom: 1rem;
}

.slide-13.active .efficiency-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-13.active .efficiency-intro {
  animation: efficiencyIntroSlide 1.5s ease-out 3s forwards, efficiencyIntroGlow 3s ease-in-out 4.5s infinite;
}

.slide-13.active .benefit-item:nth-child(1) {
  animation: benefitItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards, benefitItemFloat 3s ease-in-out 6s infinite;
}

.slide-13.active .benefit-item:nth-child(2) {
  animation: benefitItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.3s forwards, benefitItemFloat 3s ease-in-out 6.3s infinite;
}

.slide-13.active .benefit-item:nth-child(3) {
  animation: benefitItemSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.6s forwards, benefitItemFloat 3s ease-in-out 6.6s infinite;
}

.slide-13.active .benefit-item:nth-child(1) .benefit-icon {
  animation: benefitIconSpin 1.5s ease-out 4.5s forwards, benefitIconGlow 2s ease-in-out 6.5s infinite;
}

.slide-13.active .benefit-item:nth-child(2) .benefit-icon {
  animation: benefitIconSpin 1.5s ease-out 4.8s forwards, benefitIconGlow 2s ease-in-out 6.8s infinite;
}

.slide-13.active .benefit-item:nth-child(3) .benefit-icon {
  animation: benefitIconSpin 1.5s ease-out 5.1s forwards, benefitIconGlow 2s ease-in-out 7.1s infinite;
}

.slide-13.active .control-summary {
  animation: controlSummarySlide 1.5s ease-out 5.5s forwards;
}

/* 第14页：进入学习页动画 */
.slide-14.active .main-title {
  animation: titleSlideInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards;
}

.slide-14.active .subtitle {
  animation: subtitleFadeInEnhanced 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1s forwards;
  margin-bottom: 1rem;
}

.slide-14.active .learning-intro-section {
  animation: sectionSlideInEnhanced 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2s forwards;
}

.slide-14.active .learning-intro {
  animation: learningIntroSlide 1.5s ease-out 3s forwards, learningIntroGlow 3s ease-in-out 4.5s infinite;
}

.slide-14.active .learning-feature:nth-child(1) {
  animation: learningFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4s forwards, learningFeatureFloat 3s ease-in-out 6s infinite;
}

.slide-14.active .learning-feature:nth-child(2) {
  animation: learningFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.3s forwards, learningFeatureFloat 3s ease-in-out 6.3s infinite;
}

.slide-14.active .learning-feature:nth-child(3) {
  animation: learningFeatureSlide 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.6s forwards, learningFeatureFloat 3s ease-in-out 6.6s infinite;
}

.slide-14.active .learning-feature:nth-child(1) .feature-icon {
  animation: learningIconSpin 1.5s ease-out 4.5s forwards, learningIconGlow 2s ease-in-out 6.5s infinite;
}

.slide-14.active .learning-feature:nth-child(2) .feature-icon {
  animation: learningIconSpin 1.5s ease-out 4.8s forwards, learningIconGlow 2s ease-in-out 6.8s infinite;
}

.slide-14.active .learning-feature:nth-child(3) .feature-icon {
  animation: learningIconSpin 1.5s ease-out 5.1s forwards, learningIconGlow 2s ease-in-out 7.1s infinite;
}

.slide-14.active .learning-summary {
  animation: learningSummarySlide 1.5s ease-out 5.5s forwards;
}

/* 第11页：有限自动机步骤部分 */
.fa-steps-section {
  margin-top: 2rem;
}

.fa-flow-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.fa-step-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(50px);
}

.fa-step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.fa-step-card:hover::before {
  opacity: 1;
}

.fa-step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
}

.fa-step-card .step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  justify-content: center;
}

.fa-step-card .step-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
}

.fa-step-card .step-icon .icon {
  width: 22px;
  height: 22px;
  color: white;
}

.fa-step-card .step-header h4 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.fa-step-card .step-content {
  text-align: center;
  flex: 1;
}

.fa-step-card .step-content p {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.fa-step-card .step-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fa-step-card .decoration-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border-radius: 50%;
  animation: decorationPulse 2s ease-in-out infinite;
}

.fa-step-card .decoration-line {
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
  animation: decorationFlow 3s ease-in-out infinite;
}

.fa-flow-container .flow-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.5);
}

.fa-flow-container .flow-arrow .arrow-icon {
  width: 24px;
  height: 24px;
  color: #10b981;
  filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
}

.fa-description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(30px);
}

.fa-description h3 {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.fa-description p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* 第10页和第11页的动画关键帧 */
@keyframes structureIntroSlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes structureIntroGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
    transform: scale(1.02);
  }
}

@keyframes structureFeatureSlide {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.5) rotateY(-45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) scale(1.1) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

@keyframes structureFeatureFloat {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: translateY(-5px) rotateY(-1deg);
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
  }
  75% {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
}

@keyframes structureIconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes structureIconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
  transform: scale(1.1);
  }
}

@keyframes faStepCardSlide {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.8) rotateX(45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-30px) scale(1.05) rotateX(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes faStepCardFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
  }
  50% {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
  75% {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.4);
  }
}

@keyframes faStepIconSpin {
  0% {
    transform: scale(0) rotate(180deg);
  }
  50% {
    transform: scale(1.2) rotate(90deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes faStepIconGlow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.4);
    transform: scale(1.1);
  }
}

@keyframes faFlowArrowAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(180deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2) rotate(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes faFlowArrowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
    filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.8));
  }
}

@keyframes faDescriptionSlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 第12页和第13页的动画关键帧 */
@keyframes controlIntroSlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes controlIntroGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
    transform: scale(1.02);
  }
}

@keyframes controlFeatureSlide {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.5) rotateY(-45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) scale(1.1) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

@keyframes controlFeatureFloat {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: translateY(-5px) rotateY(-1deg);
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
  }
  75% {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
}

@keyframes controlIconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes controlIconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.1);
  }
}

@keyframes efficiencyIntroSlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes efficiencyIntroGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
    transform: scale(1.02);
  }
}

@keyframes benefitItemSlide {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.5) rotateY(-45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) scale(1.1) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

@keyframes benefitItemFloat {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: translateY(-5px) rotateY(-1deg);
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
  }
  75% {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
}

@keyframes benefitIconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes benefitIconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.1);
  }
}

@keyframes controlSummarySlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 第14页动画关键帧 */
@keyframes learningIntroSlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes learningIntroGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4);
    transform: scale(1.02);
  }
}

@keyframes learningFeatureSlide {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.5) rotateY(-45deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-20px) scale(1.1) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

@keyframes learningFeatureFloat {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  25% {
    transform: translateY(-8px) rotateY(2deg);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);
  }
  50% {
    transform: translateY(-5px) rotateY(-1deg);
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
  }
  75% {
    transform: translateY(-10px) rotateY(3deg);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
}

@keyframes learningIconSpin {
  0% {
    transform: scale(0) rotate(-360deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes learningIconGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
    transform: scale(1.1);
  }
}

@keyframes learningSummarySlide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 第15页动画关键帧 */
@keyframes thankYouTitleSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-100vw) scale(0.3);
  }
  20% {
    opacity: 0.2;
    transform: translateX(-80vw) scale(0.4);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-40vw) scale(0.7);
  }
  80% {
    opacity: 0.9;
    transform: translateX(-10vw) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes thankYouTitleGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
  }
}

@keyframes thankYouTitleBreath {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes teamAdvisorZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.1) rotate(180deg);
  }
  30% {
    opacity: 0.3;
    transform: scale(0.3) rotate(120deg);
  }
  60% {
    opacity: 0.7;
    transform: scale(0.7) rotate(60deg);
  }
  85% {
    opacity: 0.9;
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes member1WaveIn {
  0% {
    opacity: 0;
    transform: translateX(-150px) scale(0.2) rotateZ(-45deg);
  }
  20% {
    opacity: 0.3;
    transform: translateX(-100px) scale(0.4) rotateZ(-30deg);
  }
  40% {
    opacity: 0.6;
    transform: translateX(-50px) scale(0.6) rotateZ(-15deg);
  }
  60% {
    opacity: 0.8;
    transform: translateX(20px) scale(1.1) rotateZ(5deg);
  }
  80% {
    opacity: 0.9;
    transform: translateX(-5px) scale(0.95) rotateZ(-2deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateZ(0deg);
  }
}

@keyframes member2SpiralIn {
  0% {
    opacity: 0;
    transform: scale(0.1) rotate(720deg) translateY(-100px);
  }
  25% {
    opacity: 0.2;
    transform: scale(0.3) rotate(540deg) translateY(-60px);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.6) rotate(360deg) translateY(-20px);
  }
  75% {
    opacity: 0.8;
    transform: scale(0.9) rotate(180deg) translateY(10px);
  }
  90% {
    opacity: 0.9;
    transform: scale(1.05) rotate(45deg) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg) translateY(0);
  }
}

@keyframes member3ZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.05) translateY(50px);
  }
  30% {
    opacity: 0.4;
    transform: scale(0.2) translateY(30px);
  }
  60% {
    opacity: 0.7;
    transform: scale(0.6) translateY(10px);
  }
  80% {
    opacity: 0.9;
    transform: scale(1.2) translateY(-5px);
  }
  90% {
    opacity: 1;
    transform: scale(0.95) translateY(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes member4ShakeIn {
  0% {
    opacity: 0;
    transform: translateX(100px) scale(0.3) rotateZ(15deg);
  }
  15% {
    opacity: 0.3;
    transform: translateX(80px) scale(0.4) rotateZ(-10deg);
  }
  30% {
    opacity: 0.5;
    transform: translateX(60px) scale(0.5) rotateZ(8deg);
  }
  45% {
    opacity: 0.7;
    transform: translateX(40px) scale(0.7) rotateZ(-5deg);
  }
  60% {
    opacity: 0.8;
    transform: translateX(20px) scale(0.9) rotateZ(3deg);
  }
  75% {
    opacity: 0.9;
    transform: translateX(-5px) scale(1.05) rotateZ(-2deg);
  }
  85% {
    opacity: 1;
    transform: translateX(3px) scale(0.98) rotateZ(1deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateZ(0deg);
  }
}

@keyframes memberFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes avatarPulseRed {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
    transform: scale(1.1);
  }
}

@keyframes avatarPulseTeal {
  0%, 100% {
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(78, 205, 196, 0.8);
    transform: scale(1.1);
  }
}

@keyframes avatarPulseGreen {
  0%, 100% {
    box-shadow: 0 0 20px rgba(168, 230, 207, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(168, 230, 207, 0.8);
    transform: scale(1.1);
  }
}

@keyframes avatarPulseYellow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 217, 61, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 217, 61, 0.8);
    transform: scale(1.1);
  }
}

@keyframes advisorSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.5) rotateY(-90deg);
  }
  30% {
    opacity: 0.4;
    transform: scale(0.7) rotateY(-60deg);
  }
  60% {
    opacity: 0.8;
    transform: scale(0.9) rotateY(-30deg);
  }
  80% {
    opacity: 0.9;
    transform: scale(1.05) rotateY(-10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

@keyframes advisorAvatarPulse {
  0%, 100% {
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.9);
    transform: scale(1.1);
  }
}

@keyframes advisorPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
  }
}
</style>
