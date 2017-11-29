'use strict'

const FILE_NAME = "gitlog"
var LINK_REGEXP = /[A-Z]*-[0-9]*/i;

// Model & Utilities  ---------------------------------------
/**
 * Commit Objcect
 * @param {*} lines commit fragment
 */
function Commit(lines) {
  this.comment = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('commit')) {
      this.id = lines[i].split(' ')[1];
    } else if (lines[i].startsWith('Author:')) {
      this.author = lines[i].split(':')[1].trim();
    } else if (lines[i].startsWith('Date:')) {
      this.date = lines[i].replace('Date:','').trim();
    } else {
      let item = lines[i].match(LINK_REGEXP);
      if (item) {
        this.item = item[0];
      }
      this.comment.push(lines[i].trim());
    }
  }
}


function CommitsBuilder () {
  this.commits = [];
  this.lines = [];
}

CommitsBuilder.prototype.newCommit = function (line) {
  this.close();
  this.lines.push(line);
}

CommitsBuilder.prototype.append = function (line) {
  this.lines.push(line);
}

CommitsBuilder.prototype.close = function () {
  if (this.lines.length > 0) {
    this.commits.push(new Commit(this.lines));
  }
  this.lines = [];
}

CommitsBuilder.prototype.showCommits = function () {
  for (let i = 0; i < this.commits.length; i++) {
    console.log(this.commits[i]);
  }
}


// Main -----------------------------------------------------
const builder = new CommitsBuilder();


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(FILE_NAME)
});
  
lineReader.on('line', function (line) {
  if (line.startsWith('commit')) {
    builder.newCommit(line);
  } else {
    builder.append(line);
  }
});

lineReader.on('close', function (){
  builder.close();
  builder.showCommits();
});


