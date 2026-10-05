(() => {
  const story = document.querySelector('.score-story');
  if (!story) return;

  const motionStage = story.querySelector('.motion-stage');
  const fallback = story.querySelector('.static-fallback');
  const scoreTrack = story.querySelector('.score-track');
  const playhead = story.querySelector('.playhead');
  const playheadDot = story.querySelector('.playhead-dot');
  const bird = story.querySelector('.score-bird');
  const aura = story.querySelector('.note-aura');
  const auraOuter = aura.querySelector('.aura-outer');
  const auraInner = aura.querySelector('.aura-inner');
  const paper = story.querySelector('.paper-surface');
  const chapterMark = story.querySelector('.chapter-mark');
  const chapterNumber = chapterMark.querySelector('strong');
  const beatCount = story.querySelector('.beat-count');
  const beatDots = [...story.querySelectorAll('.beat-dots i')];
  const opening = story.querySelector('.opening-copy');
  const measureCopy = story.querySelector('.measure-copy');
  const measureNumber = measureCopy.querySelector('.measure-number');
  const measureTitle = measureCopy.querySelector('h2');
  const measureDetail = measureCopy.querySelector('p');
  const featureChips = measureCopy.querySelector('.feature-chips');
  const phone = story.querySelector('.phone-area');
  const phoneScreens = [...phone.querySelectorAll('.phone-screen')];
  const progressFill = story.querySelector('.progress-line i');
  const progressMeasure = story.querySelector('.progress-measure');
  const scrollCue = story.querySelector('.scroll-cue');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const svgNS = 'http://www.w3.org/2000/svg';

  const scoreNotes = window.bachScoreTimeline;
  const measureText = [
    { number: '01 / 今天', title: '打开今天，<br>知道下一步。', detail: '这周要练的曲子出现在眼前。想开始时，一下就进入练琴台。', chips: ['本周待办', '一键开练'], alt: '蓝脚日记 iPhone 模拟器截图：今天页' },
    { number: '02 / 计划', title: '把一首曲子，<br>放进这周。', detail: '给曲子选乐器，写下这周要练的内容和目标。下次打开，就知道从哪里接着练。', chips: ['曲目与乐器', '本周目标'], alt: '蓝脚日记 iPhone 模拟器截图：计划页' },
    { number: '03 / 练琴', title: '专心练，<br>工具都在这里。', detail: '计时、暂停、节拍器、录音、录像和心得都在同一屏；停下来时，节拍也一起停。', chips: ['节拍器', '录音与录像', '练习心得'], alt: '蓝脚日记 iPhone 模拟器截图：练琴台' },
    { number: '04 / 足迹', title: '练过的每天，<br>都看得见。', detail: '保存后留下日历印章和练习记录。想回听、回看，声音和画面都留在自己的手机里。', chips: ['日历印章', '本机回放'], alt: '蓝脚日记 iPhone 模拟器截图：练习足迹' }
  ];

  let frame = 0;
  let currentMeasure = -1;

  function render() {
    frame = 0;
    if (!document.body.classList.contains('motion-on')) return;

    const rect = story.getBoundingClientRect();
    const travel = Math.max(1, rect.height - window.innerHeight);
    const progress = clamp(-rect.top / travel, 0, 1);
    const beat = Math.min(progress * 64, 63);
    const beatIndex = Math.min(scoreNotes.length - 2, Math.floor(beat));
    const x = mix(scoreNotes[beatIndex].x, scoreNotes[beatIndex + 1].x, beat - beatIndex);
    const measureIndex = Math.min(3, Math.floor(progress * 4));
    const boundaryDistance = Math.min(...[.25, .5, .75].map(point => Math.abs(progress - point)));
    const betweenMeasures = clamp(boundaryDistance / .035, 0, 1);
    const phoneOpacity = clamp(progress / .1, 0, 1) * betweenMeasures;
    const copyOpacity = clamp((progress - .13) / .07, 0, 1) * betweenMeasures;

    if (measureIndex !== currentMeasure) {
      const content = measureText[measureIndex];
      measureNumber.textContent = content.number;
      measureTitle.innerHTML = content.title;
      measureDetail.textContent = content.detail;
      featureChips.replaceChildren(...content.chips.map(label => {
        const chip = document.createElement('span');
        chip.textContent = label;
        return chip;
      }));
      progressMeasure.textContent = content.number;
      phone.setAttribute('aria-label', content.alt);
      chapterNumber.innerHTML = `0${measureIndex + 1}<span> / 04</span>`;
      currentMeasure = measureIndex;
    }

    playhead.setAttribute('x1', String(x));
    playhead.setAttribute('x2', String(x));
    playheadDot.setAttribute('cx', String(x));
    bird.setAttribute('x', String(x - 41));
    const toneY = mix(scoreNotes[beatIndex].y, scoreNotes[beatIndex + 1].y, beat - beatIndex);
    for (const circle of [auraOuter, auraInner]) {
      circle.setAttribute('cx', String(x));
      circle.setAttribute('cy', String(toneY));
    }
    const beatPhase = beat - Math.floor(beat);
    auraOuter.setAttribute('r', String(36 + beatPhase * 25));
    auraInner.setAttribute('r', String(20 + beatPhase * 9));
    aura.style.opacity = String(clamp((progress - .08) / .12, 0, 1) * (1 - beatPhase * .56));
    paper.style.setProperty('--warmth', String(clamp((progress - .2) / .65, 0, 1)));
    chapterMark.style.opacity = String(clamp((progress - .11) / .12, 0, .9));
    chapterMark.style.transform = `translate3d(0,${-12 * progress}px,0)`;
    const currentBeat = (Math.min(15, Math.floor(progress * 16)) % 4) + 1;
    beatCount.textContent = String(currentBeat).padStart(2, '0');
    beatDots.forEach((dot, index) => dot.classList.toggle('is-active', index === currentBeat - 1));


    scoreTrack.style.transform = `translate3d(${-Math.max(0, (mobile.matches ? x * .75 - 168 : x - 450))}px,0,0)`;
    opening.style.opacity = String(clamp((.12 - progress) / .06, 0, 1));
    opening.style.transform = `translate3d(0,${-24 * progress}px,0)`;
    bird.style.opacity = String(clamp((progress - .13) / .1, 0, 1));
    measureCopy.style.opacity = String(copyOpacity);
    measureCopy.style.transform = `translate3d(0,${18 * (1 - copyOpacity)}px,0)`;
    phone.style.opacity = String(phoneOpacity);
    phone.style.transform = `translate3d(0,${42 * (1 - phoneOpacity)}px,0) scale(${.9 + .1 * phoneOpacity})`;
    phoneScreens.forEach((screen, index) => { screen.style.visibility = index === measureIndex ? 'visible' : 'hidden'; });
    progressFill.style.width = `${progress * 100}%`;
    scrollCue.style.opacity = String(clamp((.32 - progress) / .2, 0, 1));
  }

  function queueRender() {
    if (!frame) frame = window.requestAnimationFrame(render);
  }

  function configure() {
    const enabled = !reducedMotion.matches;
    document.body.classList.toggle('motion-on', enabled);
    motionStage.setAttribute('aria-hidden', String(!enabled));
    fallback.setAttribute('aria-hidden', String(enabled));
    currentMeasure = -1;
    queueRender();
  }

  window.addEventListener('scroll', queueRender, { passive: true });
  window.addEventListener('resize', queueRender, { passive: true });
  reducedMotion.addEventListener('change', configure);
  configure();
})();
