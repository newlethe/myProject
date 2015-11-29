var showMDType = window.dialogArguments;
function changeCss() {
	//显示返回按钮
	if(showMDType=="执行情况"){
	}else{
	  top.backToSubSystemBtn.show();
	}
	var bidcompletePro = '0'; // 已完成招标项目
	var bidsingedCon = '0';// 已签订金额
	var bidpercentage = '0%';
	var bdgPercent = '0%';// 概算执行情况
	var sigedConNum = '0'; // 已签订合同数
	var contractMoney = '0';
	var rsAcc = '0';
	var sbAcc = '0';
	var otherAcc = '0';
	var assNum = '0';// 质量管控验评项目
	var zlpercentage = '0%';// 占比
	var goodRage = '0%';// 优良率
	var projectNum = '0';// 开工项目数
	var propercentage = '0%';// 进度百分比
	DWREngine.setAsync(false);
	pcPrjService.getAllProjectSheduleByPid(CURRENTAPPID, totaltouzi, function(
					rtn) {
				if (rtn != '') {
					bidcompletePro = rtn.bidcompletePro;
					bidsingedCon = rtn.bidsingedCon;
					bidpercentage = rtn.bidpercentage;
					bdgPercent = rtn.bdgPercent;
					sigedConNum = rtn.sigedConNum;
					contractMoney = rtn.conMoney;
					rsAcc = rtn.rsAcc;
					sbAcc = rtn.sbAcc;
					otherAcc = rtn.otherAcc;
					assNum = rtn.assNum;
					zlpercentage = rtn.percentage;
					goodRage = rtn.goodRage;
					projectNum = rtn.projectNum;
					propercentage = rtn.propercentage;
				}
			})
	DWREngine.setAsync(true);
	// 已完成招标项目
	document.getElementById('bidcompletePro').innerHTML = bidcompletePro + '项';
	// 已经完成招标款
	document.getElementById('bidsingedCon').title = bidsingedCon;// 招标款原始数据
	var bidMoney = moneyUtil(bidsingedCon);
	document.getElementById('bidsingedCon').innerHTML = bidMoney;// 招标处理数据

	// 设置占投资百分比
	document.getElementById('bidpercentage').title = bidpercentage;
	document.getElementById('bidpercentage').innerHTML = (Math.round(parseFloat(bidpercentage)*10000)/100)+"%"
	// 设置概算的值

	document.getElementById('bdgPercent').title = bdgPercent;
	document.getElementById('bdgPercent').innerHTML = bdgPercent * 100 + "%";
	// 设置合同签订项

	document.getElementById('sigedConNum').title = sigedConNum;
	document.getElementById('sigedConNum').innerHTML = sigedConNum + "项";
	// 设置合同签订金额
	var contMoney = moneyUtil(contractMoney);
	document.getElementById('contractMoney').title = contractMoney;
	document.getElementById('contractMoney').innerHTML = contMoney;
	// 设置安全事故
	document.getElementById('rsAcc').innerHTML = typeof(rsAcc) == 'undefined'
			? '0'
			: rsAcc;
	document.getElementById('sbAcc').innerHTML = typeof(sbAcc) == 'undefined'
			? '0'
			: sbAcc;
	document.getElementById('otherAcc').innerHTML = typeof(otherAcc) == 'undefined'
			? '0'
			: otherAcc;
	// 设置质量管控
	document.getElementById('assNum').innerHTML = typeof(assNum) == 'undefined'
			? '0项'
			: assNum + "项";
	document.getElementById('zlpercentage').innerHTML = typeof(zlpercentage) == 'undefined'
			? '0%'
			: zlpercentage * 100 + "%";
	document.getElementById('goodRage').innerHTML = typeof(goodRage) == 'undefined'
			? '0%'
			: goodRage * 100 + "%";
	document.getElementById('propercentage').innerHTML = typeof(propercentage) == 'undefined'
			? '0%'
			: propercentage * 100 + "%";
	// 设置投资规模
	var totalTo = moneyUtil(totaltouzi);
	document.getElementById('totaltouzi').innerHTML = "<b>" + totalTo + "</b>";
	
	var o1 = document.getElementById('div1');//项目建议书
	var o2 = document.getElementById('div2');//初可研报告
	var o3 = document.getElementById('div3');//可研报告
	var o4 = document.getElementById('div4');//初设报告
	var o5 = document.getElementById('div5');//项目组织机构
	var o6 = document.getElementById('div6');//招投标
	var o7 = document.getElementById('div7');//里程碑计划
	var o8 = document.getElementById('div8');//概算执行
	var o9 = document.getElementById('div9');//合同执行
	var o10 = document.getElementById('div10');//投资完成
	var o11 = document.getElementById('div11');//质量管控
	var o12 = document.getElementById('div12');//安全管控
	var o13 = document.getElementById('div13');//工程进度
	var o14 = document.getElementById('div14');//竣工验收申请报告
	var o15 = document.getElementById('div15');//竣工验收报表
	var o16 = document.getElementById('div16');//竣工验收报告
	var o17 = document.getElementById('div17');//项目后评报告
	if (prjState == '') {//为设定项目阶段
		o1.className = 's1_c_03 p_01';
		o2.className = 's1_c_03 p_02';
		o3.className = 's1_c_03 p_03';
		o4.className = 's1_c_03 p_04';
		o5.className = 's1_c_03 p_05';
		o6.className = 's1_c_03 p_06';
		o7.className = 's2_c_03 p_07';
		o8.className = 's2_c_03 p_08';
		o9.className = 's2_c_03 p_09';
		o10.className = 's2_c_03 p_10';
		o11.className = 's2_c_03 p_11';
		o12.className = 's2_c_03 p_12';
		o13.className = 's2_c_03 p_13';
		o14.className = 's1_c_03 p_14';
		o15.className = 's1_c_03 p_15';
		o16.className = 's1_c_03 p_16';
		o17.className = 's1_c_03 p_17';
	} else if ('QQ' == prjState) {//前期策划
		o1.className = 's1_c_02 p_01';
		o2.className = 's1_c_02 p_02';
		o3.className = 's1_c_02 p_03';
		o4.className = 's1_c_02 p_04';
		o5.className = 's1_c_03 p_05';
		o6.className = 's1_c_03 p_06';
		o7.className = 's2_c_03 p_07';
		o8.className = 's2_c_03 p_08';
		o9.className = 's2_c_03 p_09';
		o10.className = 's2_c_03 p_10';
		o11.className = 's2_c_03 p_11';
		o12.className = 's2_c_03 p_12';
		o13.className = 's2_c_03 p_13';
		o14.className = 's1_c_03 p_14';
		o15.className = 's1_c_03 p_15';
		o16.className = 's1_c_03 p_16';
		o17.className = 's1_c_03 p_17';
	} else if('SJZB' == prjState) {//设计招标
		o1.className = 's1_c_01 p_01';
		o2.className = 's1_c_01 p_02';
		o3.className = 's1_c_01 p_03';
		o4.className = 's1_c_01 p_04';
		o5.className = 's1_c_02 p_05';
		o6.className = 's1_c_02 p_06';
		o7.className = 's2_c_02 p_07';
		o8.className = 's2_c_03 p_08';
		o9.className = 's2_c_03 p_09';
		o10.className = 's2_c_03 p_10';
		o11.className = 's2_c_03 p_11';
		o12.className = 's2_c_03 p_12';
		o13.className = 's2_c_03 p_13';
		o14.className = 's1_c_03 p_14';
		o15.className = 's1_c_03 p_15';
		o16.className = 's1_c_03 p_16';
		o17.className = 's1_c_03 p_17';
	} else if('SGZB' == prjState) {//施工准备
		o1.className = 's1_c_01 p_01';
		o2.className = 's1_c_01 p_02';
		o3.className = 's1_c_01 p_03';
		o4.className = 's1_c_01 p_04';
		o5.className = 's1_c_01 p_05';
		o6.className = 's1_c_01 p_06';
		o7.className = 's2_c_01 p_07';
		o8.className = 's2_c_02 p_08';
		o9.className = 's2_c_02 p_09';
		o10.className = 's2_c_02 p_10';
		o11.className = 's2_c_02 p_11';
		o12.className = 's2_c_02 p_12';
		o13.className = 's2_c_02 p_13';
		o14.className = 's1_c_03 p_14';
		o15.className = 's1_c_03 p_15';
		o16.className = 's1_c_03 p_16';
		o17.className = 's1_c_03 p_17';
	} else if('JG' == prjState) {//竣工
		o1.className = 's1_c_01 p_01';
		o2.className = 's1_c_01 p_02';
		o3.className = 's1_c_01 p_03';
		o4.className = 's1_c_01 p_04';
		o5.className = 's1_c_01 p_05';
		o6.className = 's1_c_01 p_06';
		o7.className = 's2_c_01 p_07';
		o8.className = 's2_c_01 p_08';
		o9.className = 's2_c_01 p_09';
		o10.className = 's2_c_01 p_10';
		o11.className = 's2_c_01 p_11';
		o12.className = 's2_c_01 p_12';
		o13.className = 's2_c_01 p_13';
		o14.className = 's1_c_02 p_14';
		o15.className = 's1_c_02 p_15';
		o16.className = 's1_c_02 p_16';
		o17.className = 's1_c_02 p_17';
	} else {
		o1.className = 's1_c_01 p_01';
		o2.className = 's1_c_01 p_02';
		o3.className = 's1_c_01 p_03';
		o4.className = 's1_c_01 p_04';
		o5.className = 's1_c_01 p_05';
		o6.className = 's1_c_01 p_06';
		o7.className = 's2_c_01 p_07';
		o8.className = 's2_c_01 p_08';
		o9.className = 's2_c_01 p_09';
		o10.className = 's2_c_01 p_10';
		o11.className = 's2_c_01 p_11';
		o12.className = 's2_c_01 p_12';
		o13.className = 's2_c_01 p_13';
		o14.className = 's1_c_01 p_14';
		o15.className = 's1_c_01 p_15';
		o16.className = 's1_c_01 p_16';
		o17.className = 's1_c_01 p_17';
	}
	// debugFn()

}
// 调试函数
function debugFn() {
	for (var i = 1; i <= 17; i++) {
		var o = document.getElementById("div" + i);
		if (o) {
			o.onclick = function() {
				var cls = this.className;
				if (cls.indexOf("s1_c_01") > -1) {
					cls = cls.replace(/s1_c_01/g, "s1_c_02");
				} else if (cls.indexOf("s1_c_02") > -1) {
					cls = cls.replace(/s1_c_02/g, "s1_c_03");
				} else if (cls.indexOf("s1_c_03") > -1) {
					cls = cls.replace(/s1_c_03/g, "s1_c_01");
				} else if (cls.indexOf("s2_c_01") > -1) {
					cls = cls.replace(/s2_c_01/g, "s2_c_02");
				} else if (cls.indexOf("s2_c_02") > -1) {
					cls = cls.replace(/s2_c_02/g, "s2_c_03");
				} else if (cls.indexOf("s2_c_03") > -1) {
					cls = cls.replace(/s2_c_03/g, "s2_c_01");
				}
				this.className = cls;
			}
		}
	}
}

function moneyUtil(money) {
	var conMoney = parseInt(money);
	var conlength = conMoney.toString().length;
	var conM = '';
	if (conlength >= 9) {
		var res = parseFloat(conMoney) / parseFloat(100000000);
		conM = res.toFixed(2) + "亿元";
	} else if (conlength >= 5 && conlength < 9) {
		var res = parseFloat(conMoney) / parseFloat(10000);
		conM = res.toFixed(1) + "万元";
	} else {
		conM = conMoney + "元";
	}
	return conM;
}
 function newWin(url){
 		var w = 800;
 		var h=600;
 		if(screen&&screen.availHeight&&screen.availWidth){
 			w = screen.availWidth;
 			h = screen.availHeight;
 		}
		window.showModalDialog(BASE_PATH+ url,null,"dialogWidth:"+w+"px;dialogHeight:"+h+"px;center:yes;resizable:yes;location=no;status=no;");
						
 }
