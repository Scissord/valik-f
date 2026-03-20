const fs = require('fs');
const { execSync } = require('child_process');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) arrayOfFiles.push(dirPath + "/" + file)
    }
  })
  return arrayOfFiles
}

const files = getAllFiles('./src');
const corruptedFiles = files.filter(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    // If it contains the corrupted string or the new max-w size
    return content.includes('1536px') || content.includes('Р'); 
  } catch (e) {
    return false;
  }
});

console.log("Corrupted files found: ", corruptedFiles.length);

// Restore them via git
for (const file of corruptedFiles) {
  try {
    console.log('Restoring ' + file);
    execSync(`git restore "${file}"`, { stdio: 'ignore' });
  } catch (e) {
    console.log('Skipping restore for ' + file);
  }
}

// Now replace safely in UTF8
for (const file of corruptedFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/max-w-7xl/g, 'max-w-[1536px]');
  content = content.replace(/lg:px-8/g, 'lg:px-4');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed encoding and applied margin reduction ' + file);
}
