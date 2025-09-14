// 存储所有歌曲
let songs = [];
// 当前播放索引
let currentSongIndex = -1;

/**
 * 上传音频文件
 */
function uploadAudio() {
  const fileInput = document.getElementById('audio-upload');

  // 检查是否选择了文件
  if (!fileInput.files.length) {
    console.log("❌ 没有选择文件");
    return;
  }

  const file = fileInput.files[0];

  // 检查是否为音频文件
  if (!file.type.startsWith('audio/')) {
    alert('请上传有效的音频文件（如 .mp3, .wav）');
    return;
  }

  // 创建歌曲对象
  const song = {
    name: file.name.split('.')[0], // 去掉扩展名作为标题
    url: URL.createObjectURL(file)  // 创建本地临时 URL
  };

  // 添加到数组
  songs.push(song);
  console.log("✅ 已添加歌曲:", song);

  // 更新播放列表
  renderPlaylist();

  // 可选：自动播放第一首
  if (songs.length === 1) {
    playSong(0);
  }

  // 清空 input，允许重复上传同一文件
  fileInput.value = '';
}

/**
 * 渲染播放列表
 */
function renderPlaylist() {
  const list = document.getElementById('song-list');
  list.innerHTML = ''; // 清空旧内容

  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.name;
    li.onclick = () => playSong(index); // 点击播放
    list.appendChild(li);
  });
}

/**
 * 播放指定歌曲
 */
function playSong(index) {
  if (index < 0 || index >= songs.length) {
    console.error("❌ 无效的歌曲索引:", index);
    return;
  }

  const player = document.getElementById('audio-player');
  const song = songs[index];

  // 设置音频源并加载
  player.src = song.url;
  player.load();

  // 尝试播放（浏览器可能阻止自动播放）
  player.play().catch(e => {
    console.warn("⚠️ 播放被阻止（可能是无用户交互）:", e);
    alert("请先点击页面任意位置再尝试播放，或检查浏览器设置。");
  });

  currentSongIndex = index;
  console.log("▶️ 正在播放:", song.name);
}

/**
 * 播放/暂停切换
 */
function playPause() {
  const player = document.getElementById('audio-player');

  if (currentSongIndex === -1 && songs.length > 0) {
    // 如果还没播过，就播放第一首
    playSong(0);
    return;
  }

  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

/**
 * 下一首
 */
function nextSong() {
  if (songs.length === 0) return;

  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
}

/**
 * 添加评论
 */
function addComment() {
  const input = document.getElementById('comment-input');
  const commentText = input.value.trim();

  if (!commentText) {
    alert('请输入评论内容');
    return;
  }

  const commentList = document.getElementById('comment-list');
  const li = document.createElement('li');
  li.textContent = commentText;
  commentList.appendChild(li);

  input.value = ''; // 清空输入框
}