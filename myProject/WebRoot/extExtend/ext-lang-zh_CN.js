/*
 * Simplified Chinese translation
 * By DavidHu
 * 09 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">加载中...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
   Ext.grid.Grid.prototype.ddText = "{0} 选择行";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "关闭";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "输入值非法";
}

Date.monthNames = [
   "一月",
   "二月",
   "三月",
   "四月",
   "五月",
   "六月",
   "七月",
   "八月",
   "九月",
   "十月",
   "十一月",
   "十二月"
];

Date.dayNames = [
   "日",
   "一",
   "二",
   "三",
   "四",
   "五",
   "六"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "确定",
      cancel : "取消",
      yes    : "是",
      no     : "否"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "y年m月d日");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "今天",
      minText           : "日期在最小日期之前",
      maxText           : "日期在最大日期之后",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '下月 (Control+Right)',
      prevText          : '上月 (Control+Left)',
      monthYearText     : '选择一个月 (Control+Up/Down 来改变年)',
      todayTip          : "{0} (空格键选择)",
      format            : "y年m月d日",
      okText            : "确定",
      cancelText        : "取消"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "第",
      afterPageText  : "页  共 {0} 页",
      firstText      : "第一页",
      prevText       : "前一页",
      nextText       : "下一页",
      lastText       : "最后页",
      refreshText    : "刷新",
      displayMsg     : "显示 {0} - {1}，共 {2} 条",
      emptyMsg       : '没有数据需要显示'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "该输入项的最小长度是 {0}",
      maxLengthText : "该输入项的最大长度是 {0}",
      blankText     : "该输入项为必输项",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "该输入项的最小值是 {0}",
      maxText : "该输入项的最大值是 {0}",
      nanText : "{0} 不是有效数值"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "禁用",
      disabledDatesText : "禁用",
      minText           : "该输入项的日期必须在 {0} 之后",
      maxText           : "该输入项的日期必须在 {0} 之前",
      invalidText       : "{0} 是无效的日期 - 必须符合格式： {1}",
      format            : "y年m月d日"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "加载...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '该输入项必须是电子邮件地址，格式如： "user@domain.com"',
      urlText      : '该输入项必须是URL地址，格式如： "http:/'+'/www.domain.com"',
      alphaText    : '该输入项只能包含字符和_',
      alphanumText : '该输入项只能包含字符,数字和_'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "正序",
      sortDescText : "逆序",
      lockText     : "锁列",
      unlockText   : "解锁列",
      columnsText  : "列"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "名称",
      valueText  : "值",
      dateFormat : "y年m月d日"
   });
}

if(Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "拖动来改变尺寸.",
      collapsibleSplitTip : "拖动来改变尺寸. 双击隐藏."
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    fontFamilies : ['宋体', '黑体', 'Arial', 'Courier New', 'Tahoma', 'Times New Roman',
			'Verdana'],
    createLinkText : '请输入链接地址:',
    buttonTips : {
      bold : {
        title: '加粗 (Ctrl+B)',
        text: 'Make the selected text bold.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: '斜体 (Ctrl+I)',
        text: 'Make the selected text italic.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: '下划线 (Ctrl+U)',
        text: 'Underline the selected text.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: '放大字体',
        text: 'Increase the font size.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: '缩小字体',
        text: 'Decrease the font size.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: '文字背景',
        text: 'Change the background color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: '文字颜色',
        text: 'Change the color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: '左对齐',
        text: 'Align text to the left.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: '居中',
        text: 'Center text in the editor.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: '右对齐',
        text: 'Align text to the right.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: '编号',
        text: 'Start a bulleted list.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: '编号',
        text: 'Start a numbered list.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: '插入超链接',
        text: 'Make the selected text a hyperlink.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: '编辑HTML源码',
        text: 'Switch to source editing mode.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

