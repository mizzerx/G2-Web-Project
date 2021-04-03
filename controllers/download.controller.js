const fs = require('fs');
const AdmZip = require('adm-zip');
const Article = require('../models/article.model');

const zipAndDownload = async (req, res, next) => {
  const articles = await Article.find({ status: 'ACCEPTED' })
    .populate('owner')
    .lean();

  fs.writeFile(
    './download/choosen_article.json',
    JSON.stringify(articles),
    (err) => {
      if (err) throw err;
    }
  );

  const reader = fs.readdirSync('./download');
  const zip = new AdmZip();

  for (let i = 0; i < reader.length; i++) {
    zip.addLocalFile(`./download/${reader[i]}`);
  }

  const downloadFileName = 'download.zip';
  const data = zip.toBuffer();
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename=${downloadFileName}`);
  res.set('Content-Length', data.length);
  res.send(data);

  return res.redirect('/manager');
};

module.exports = { zipAndDownload };
