/**
 * Author: iiiRyan (https://github.com/85Ryan)
 *
 * Copyright 2020 Ryan Lee
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// 创建图像副本
var mergeLayersOnly = 1;
app.activeDocument.duplicate(name, mergeLayersOnly);

var doc = app.activeDocument;

/**
 * 定义导出图片尺寸选项
 *
 * @path: 保存路径后缀
 * @scale: 图片缩放比例
 * @type: 导出图片类型(normal or small)
 */
var sizeExportOptions = [
  {
    path: '/@2x/',
    scale: 1,
    type: 'normal',
  },
  {
    path: '',
    scale: 0.5,
    type: 'normal',
  },
  {
    path: '/@2x/',
    scale: 0.2,
    type: 'small',
  },
  {
    path: '',
    scale: 0.5,
    type: 'small',
  },
];

// 定义选项窗口
var dialog = new Window('dialog', '导出队徽图片');

// 球队 ID 输入框
var nameGroup = dialog.add('group');
nameGroup.orientation = 'row';
nameGroup.alignment = 'center';
var nameLabel = nameGroup.add('StaticText', undefined, '球队 ID：');
var nameInput = nameGroup.add('EditText', undefined);
nameInput.characters = 20;

// 选取 normal 图片保存路径
var pathPanel = dialog.add('panel', undefined, '选择图片导出路径');
pathPanel.orientation = 'column';
pathPanel.alignChildren = 'left';
var normalPathGroup = pathPanel.add('group');
normalPathGroup.orientation = 'row';
var normalPathButton = normalPathGroup.add('button', undefined, '选取路径');
var normalPathLabel = normalPathGroup.add(
  'EditText',
  undefined,
  '请选取 normal 图片导出目标文件夹',
  { readonly: true }
);
normalPathLabel.characters = 30;

// 选取 small 图片保存路径
var smallPathGroup = pathPanel.add('group');
smallPathGroup.orientation = 'row';
var smallPathButton = smallPathGroup.add('button', undefined, '选取路径');
var smallPathLabel = smallPathGroup.add(
  'EditText',
  undefined,
  '请选取 small 图片导出目标文件夹',
  { readonly: true }
);
smallPathLabel.characters = 30;

// 导出 & 取消button
var buttonGroup = dialog.add('group');
var okButton = buttonGroup.add('button', undefined, '导出');
var cancelButton = buttonGroup.add('button', undefined, '取消', {
  name: 'cancel',
});

// 路径选取 button 点击事件
normalPathButton.onClick = function () {
  var normalFolder = Folder.selectDialog('请选取 normal 图片导出目标文件夹');
  normalPathLabel.text = normalFolder.fsName;
};

// 路径选取 button 点击事件
smallPathButton.onClick = function () {
  var smallFolder = Folder.selectDialog('请选取 small 图片导出目标文件夹');
  smallPathLabel.text = smallFolder.fsName;
};

// 导出 button 点击事件
okButton.onClick = function () {
  if (
    nameInput.text !== '' &&
    normalPathLabel.text !== '请选取 normal 图片导出目标文件夹' &&
    smallPathLabel.text !== '请选取 small 图片导出目标文件夹'
  ) {
    for (var key in sizeExportOptions) {
      if (sizeExportOptions.hasOwnProperty(key)) {
        var item = sizeExportOptions[key];
        exportToPng(item.path, item.scale, item.type);
      }
    }
    this.parent.parent.close();
    doc.close(SaveOptions.DONOTSAVECHANGES);
  } else {
    alert('有选项未设置，请重新设置！', '', true);
  }
};

// 取消 button 点击事件
cancelButton.onClick = function () {
  this.parent.parent.close();
  doc.close(SaveOptions.DONOTSAVECHANGES);
};

dialog.show();

// 导出图片函数
function exportToPng(path, scale, type) {
  var width = doc.width * scale;
  var height = doc.height * scale;

  doc.resizeImage(width, height);

  var file, options, expFolder;

  if (type === 'normal') {
    expFolder = new Folder(normalPathLabel.text + path);
  } else if (type === 'small') {
    expFolder = new Folder(smallPathLabel.text + path);
  }

  if (!expFolder.exists) {
    expFolder.create();
  }

  file = new File(expFolder + '/' + nameInput.text + '.png');
  options = new PNGSaveOptions();
  options.compression = 0;
  options.interlaced = false;
  var asCopy = true;
  var extensionType = Extension.LOWERCASE;
  doc.saveAs(file, options, asCopy, extensionType);
}
