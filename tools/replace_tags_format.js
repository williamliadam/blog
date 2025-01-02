const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../source/_posts/senior-frontend-interview');

// 正则表达式匹配不同的 tags 格式
const TAGS_REGEX = /tags:\s*(?:#([^\n]+)|\[([^\]]+)\]|([^\n]+))/;

// 将 tags 转换为 YAML 列表格式
function formatTags(tags) {
  if (!tags) return '';
  
  // 处理不同格式的 tags
  const tagList = tags
    .replace(/#/g, '')
    .split(/[\s,]+/)
    .filter(tag => tag.trim())
    .map(tag => `  - ${tag.trim()}`)
    .join('\n');

  return `\n${tagList}`;
}

// 更新单个文件的 tags 格式
function replaceTagsFormat(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const updatedContent = content.replace(TAGS_REGEX, (match) => {
    const tags = match.split(':')[1].trim();
    return `tags: ${formatTags(tags)}`;
  });

  fs.writeFileSync(filePath, updatedContent);
}

// 遍历目录并更新所有文件的 tags 格式
function replaceAllTagsFormat() {
  const files = fs.readdirSync(BLOG_DIR);
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(BLOG_DIR, file);
      replaceTagsFormat(filePath);
      console.log(`Replaced tags format in: ${file}`);
    }
  });

  console.log('All tags formats replaced successfully!');
}

replaceAllTagsFormat();
