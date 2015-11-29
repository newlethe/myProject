/**
 * @class oPopup
 * @description 自定义弹出框 - 为了遮住Applet -_-!
 * @author Xiaos
 * @example
 * _alert - 无按钮提示框:
 * 		oPopup._alert(window, '提示信息', '提示内容', {width: 800, height: 600});
 * 
 * _msgBox - 按钮提示框:
 * 		oPopup._msgBox(
 *   		window, 
 *   		'提示信息', 
 *   		'提示内容', 
 *   		{width: 800, height: 600},
 *   		funName
 *   	);
 *   	function funName(value){
 *   		...	//value = yes/no
 *   	}
 */
 
var oPopup = function(){
	var popup, bodyPopup, opt, btns;
	var oWidth, oHeight, oSize;
	
	var handlerClick = function(){
		opt.fn.call(null, this.id);
	}

	return {
		_getDialog: function(win){
			if (!popup) {
				popup = win.createPopup();
				bodyPopup = popup.document.body;
				bodyPopup.style.border = "1px dashed #3764A0";
				bodyPopup.style.backgroundColor = "#E0E9F5";
				oWidth = 150, oHeight = 70;
			}
			var htmls = "<div style='padding: 6px 6px; font-size: 12px; color: #15428b'>";
			htmls += "<div style='background-color: #C7D5E7; padding: 4px 4px; font-weight: bold;'>"+opt.title+"</div><br>"
			htmls += "<div style='color: red'>　　"+opt.msg+"</div>";
			if (opt.buttons) {
				oWidth = 200, oHeight = 100;
				htmls += "<br><div style='text-align: center;'>";
				btns = opt.buttons; 
				for (var i = 0; i < btns.length; i++) {
					htmls += "<button id='"+btns[i][0]+"' style='background-color: silver; width: 40px; height: 18px; border-color: #C7D5E7; font-size: 11px;'>"+btns[i][1]+"</button>";
					if (i != btns.length - 1) htmls += "&nbsp;&nbsp;";
				}
				htmls += "</div>";
			}
			htmls += "</div>";
			bodyPopup.innerHTML = htmls;
			return popup;
		},
		
		_addClickListener: function(ids){
			for (var i = 0; i < ids.length; i++) {
				popup.document.getElementById(ids[i][0]).onclick = handlerClick;
			}
		},
		
		_show: function(options){
			opt = options;
			this._getDialog(opt.win);
			oSize = opt.size || 
				{width: opt.win.document.body.clientWidth, height: opt.win.document.body.clientHeight};
			popup.show((oSize.width - oWidth) / 2, 
						(oSize.height) / 2 - oHeight, 
						oWidth, oHeight, opt.win.document.body);
			if (opt.buttons) this._addClickListener(opt.buttons);
		},
		
		_hide: function() {
			if (popup.isOpen) {
				popup.hide();
			}
		},
		
		_alert: function(win, title, msg, size){
			this._show({
				win: win,
				title: title,
				msg: msg,
				size: size
			});
			if (popup) {
				window.setTimeout("oPopup._hide()", 2000);
			};
			return this;
		},
		
		_msgBox: function(win, title, msg, size, fn){
			this._show({
				win: win,
				title: title,
				msg: msg,
				size: size,
				buttons: this.OK,
				fn: fn
			});
			return this;
		},
		
		YESNO: [['yes','是'], ['no','否']],
		
		OK: [['ok', '确定']]
	}
}();