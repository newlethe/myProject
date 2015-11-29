<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant;"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<head>
<title><%=Constant.DefaultModuleRootName%></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-green.css" />
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/examples.js"></script>
	<style type="text/css">
		body {
			background-image:url(jsp/res/images/login/login_body_bg.jpg);
			margin:0px;
		}
		td {font-size:14px; color:white;}
		#header {width:100%; height:134px;}
		#center {
			width: 100%;
			height:365px;
			background:url('jsp/res/images/login/login_form_bg2.jpg') repeat-x;
		}
		#footer {width:100%;}
		#formDiv { width:430px; height:180px;}
		td.text0 {
			letter-spacing:5px;
			height:30px;
			width: 60px;
		}
		td.text1 {
			letter-spacing:5px;
			height:30px;
			color: #007D74;
			text-align:right;
			font-size: 14px;
			vertical-align: bottom;
			padding-right:50px;
		}
		td.text2 {
			height:21px;
			color: #007D74;
			text-align:right;
			vertical-align: top;
			font-size: 14px;
			padding-right:50px;
		}
		td.text3 {
			height:30px;
			color: #007D74;
			text-align:right;
			vertical-align: top;
			font-size: 14px;
			padding-right:50px;
		}
		input.text1 {
			width: 150px;
			
		}
	</style>
	<script type="text/javascript" src="jsp/index/MD5.js"></script>
	<script>
		var SYS_SERVLET = "servlet/SysServlet";
		if (top.location.href != location.href){
			top.location.href = "../"
		}
		function init() {
			var w = window.screen.availWidth;
			if (w < 1280) {
				formBg.style.background = "url('jsp/res/images/login/login_form_bg.jpg') no-repeat"
			}
			Ext.Ajax.request({
				url : SYS_SERVLET,
				params : {
					ac : "getVerifyCode"
				},
				method : "POST",
				success : function(response, params) {
					var rtn = response.responseText;
					document.all.verifycode.value = rtn;
				},
				failure : function(response, params) {
				} 	
			})
		}
	</script>
</head>
<body onload="init()">
	<table id="header" cellpadding=0 cellspacing=0 border=0 width="100%" height="100%">
		<tr><td><img src="jsp/res/images/login/login_logo.jpg"></td>
		<td style="text-align:right"><img src="jsp/res/images/login/login_tip.jpg"></td>
	</table>
	<table id="center" cellpadding=0 cellspacing=0 border=0 width="100%" height="100%">
		<tr>
			<td id="formBg" style="background:url('jsp/res/images/login/login_form_bg_big.jpg') no-repeat;height:365px; vertical-align:bottom; text-align:right;">
				<div id="formDiv">
					<form>
						<table border=0 width=100% height=100%>
							<tr>
								<td class="text0">用户名</td>
								<td colspan=2><input TABINDEX="1" name="username" class="text1"></td>
							</tr>
							<tr>
								<td class="text0">密<font style="color:#007D74">　</font>码</td>
								<td colspan=2><input TABINDEX="2" name="password" class="text1" type="password"></td>
							</tr>
							<tr>
								<td class="text0">验证码</td>
								<td colspan=2><input TABINDEX="3" name="verifycode" style="width:60px;">&nbsp;&nbsp;<img name="verifyImg" src="servlet/SysServlet?ac=getVerifyImg&w=50&h=18&l=4&uc=false&now="+new Date().getTime() align=absmiddle width=55 height=20 style="border:1px gray solid"></td>
							</tr>
							<tr>
								<td colspan=2 align=center><input TABINDEX="4" name='recordLogin' type="checkbox">&nbsp;<span style='cursor:default' onclick='document.all.recordLogin.click()'>保存我的登录信息</span></td>
								<td></td>
							</tr>
							<tr>
								<td colspan=3><br><img TABINDEX="5"  src="jsp/res/images/login/login_submit.jpg" onclick="doLogin()">&nbsp;&nbsp;&nbsp;&nbsp;<img TABINDEX="6" src="jsp/res/images/login/login_reset.jpg" onclick="reset()"></td>
							</tr>
						</table>
					</form>
				</div>
				<br><br>
		</tr>
	</table>
	<table id="footer" border=0 width=100%>
		<tr><td>&nbsp;</td></tr>
		<tr><td class="text1">国家电网公司版权所有</td></tr>
		<tr><td class="text2">all content copyright © 2009 State Grid</td></tr>
	</table>
<script language="JScript.Encode">
#@~^ZEIAAA==&J9C7lkmDbwD~\DdkKx@#@&Jznm;V,K+MGSPxE^X~ TT8@#@&zJ4YDwl&JhhA D+.Wc^KR;0z9+/J@#@&&z@#@&&z}wOrsk/[P6WD,2nD6WM:Cx^n,hrY4~VmDLn,4VG^0/~4H~tk^4lVP_lHAWMY4~,1G-:4.Py!!8@#@&zJtDY2)&&ShAR	nY9+Csbxo ^K:@#@&J&@#@&&JK_q?,?}oKqb]2,qj~hIrj(fAfPr)jP&?rP)19@#@&z&bgePA(K]A??~6"P(HhJ&29,zIIz1:(2U~~qgZJiGq1VSP~jK,H6K,S&H(K39,K6~,PCA@#@&&JqHKJ&29Pq)"I)gK&2?,rw~HAI/Cz1P)~qS&P5,b1G~oq:1A?jPo6"P)Ph)I:q/idbI~K`IKrU3@#@&&Jb"2PGqU/Szq\2GR~~&1Pg6PA.2gP~?_bdS~Ku3,biK_6I,r]~;r1P]&AiK}]UP$APdqb~SA@#@&Jzor"P)HIPf&]2;K~,(Hf&IAZP~~(gZ(fAHKzSS~Un2/(zSSPApAHKdb"5~,r"~Z}1j25j3H:qbd@#@&Jzfz\)MA?,`(1/J`f(1VSP~jP~grK~J&H(KA9,K6BPhIr;j"3HA1PP}s~j`A?:(K`K2,!6rG?@#@&&z6],?3Ij(ZA?I~dr?j~}s~jU3BP9zKz~P}I,KI}s(KUi~6"PA`jqg2?U~(1:2"IinP(}1b@#@&&z_r	3j2I~/zjj2G~z19,rgPbg5,PCAr]5,ro~dqb~(S&K5B~	CAK_2]P(H,Z61:]b;KS~UKI(/:@#@&zJJ&b$&S&K5BP}]P:r]K,`(H;SjG(1VP1A!JqV2gZ3P6],rPCA]&?3b,bI(j&1!P&H,bHIPqb5@#@&J&r`K~rwPPuAPjU3P}sP:u(?,?}sP)]A~~2j31,qo~zf.(jAf~rw~:C3,n}??&A&Jq:5~rw@#@&&J?j;uPGbHz!3R@#@&@#@&&z[nk@#@&zJOtb/~Om3+d~DtnP0nH~~DtP:/kCo~~l	N~A4+Y4nD,YW,nUmMXaY~W.~9+^DH2Y@#@&W;	mYrG	P[+k~v3nH~,:+k/mL+BPnx1Dz2D~PsGN~Pb-bPP@#@&P~z&[mslMrxTPO4b/PsG1lsVH~kwnNkPY4k	L/,E2PmP8rD@#@&,~\mDPk2WE	mDkGxq~{PU+S~bMDCz,`!aqZFTcZTB!SZ68!!Z!BT68!q!W!*SZ6FZq!Z!cBTaFZcZcS!a*B!aFZT!Z~TaW!!STXFTFZ*Z!SZ68!FZcZ*~Z6*!Z~Ta8!!Z*!W~!XqTFZ!ZcS!aqZ!T!ZT~Z6*SZ6cT*B!aFZTZcTZ~Z6FZ!Z*!Z~T68!*TZ~!Xq!W!!BTaFZFZ!T!STXFTFZT!Z~Ta8!!T*ZcS!XqZ!TW~Z6FZ!ZT!W~T68!TTZ!cBT68!!Z*S!B!XcTcSTXFTcZ*~Z6qTZ!!TTB!aFZTZ!SZ68!FZcZ*~Z6*~Z6qT8!!ZT~Z6FZqTcZ!B!aFTTZ!T!BT68!TTZ!!STXcT!BTXFT8!Z!cB!Xq!Z!T~Z6qTW!!BT68!!ZTTcB!XcT!STXcS!Xq!Z!*TW~!aqZcTcBTXFT8!W!cB!Xq!Z!*~Z6qT8!!ZT~Z6FZTTcZcB!aFTTZ!TcBT6W!*SZ6FT*ZcS!XqZFTW!Z~!XcZ*~Z6q!Z!*TZ~!Xq!Z!cZTS!B!XFT!T*B!aFZ*!Z~TSZ6FTqZ!Tc*I@#@&~,\mDPkw6;x1YrW	 ~x,x+S~bMDlH~cOZ6F0n0{W!SOZaG60W0Z!!STX%T!ZSZ6qZ%Z !B!Xq!Z!T!B!a+Z~OZaG6+06Wn!BOZ6{0WWF0n!BR!XGWW600nTBOT6FW0{6+Z~OZ6FW+6%T!Z~RTX%!ZT!Z!!BRT6F0600!TTB!aFZT!Z!STX !SRZ6{0W60nZ~Z6FZ%ZT!B!aFZ!T+Z~OZaG600FWn!B!BOT60TZ!T!ZT~Z60TZ!~Ta8!0!yTBOTXG60!Z!ZT~Z6q!Z!+TBO!X{06006nT~Z~Z6q!0TZ!S!X0!y!SRZ6GWn6%T!ZS !aF06!!Z!ZS!X%T Z~TSZ6FZ0!y!~ TaG6+60W+TSZ6q!ZT!Z~RTXG0WWF0n!BRZ6{60Z!!Z!BR!XGW+6%TTZ~!X0!Z!~ TaG60Z!T!TS !aG6W0R!TTB!6+TBOT6FW0{6+Z~!XFZ0!y!S!X TSZ6%ZT!BO!X0T!Z!Z!T~TaR!+!BR!XGWn6%!TTB!aFZTZ!TBOZ6G606W0!S!XFTTZ !BR!XG06W{0!BOT6{W60W0T~Z6qTZ! TSZ6q!RTZ!SZ~ !6F06W%Z!T~Z60Ty!~ T6R!!ZTT!Z~ !aGWn60W+ZSOZ6{W0GWnZ~T68TR!TZ#p@#@&,P7CD,/20!x^ObWx2~',x+S~)DMlHPc!a+Z%S!X0!y!+TZ~!STX%T ZTZ%SZ6R!!Z ZT~Z~T6y!+TR~!X0!Z! ZTS!X Z!T%STX%T!ZT!R~TaR!!TTZ%S!X+Z!TZ~Z6%Z Z+!R~T6y!TTR~!X0!y!!ZTS!X Z%S!a0Z!T!ZT~Z60SZ6%T+Z T!BTX TZ~Z6 Z ZT~Z60!y!TTZ~!X0!y!!Z0S!X Z T%STX%T!Z+!R~Tay! TTB!a ZTZ!SZ6R!!Z Z0~Z60~Z60Ty! Z0~Z6 ZTS!X%Z!T!TTB!a%Z+!y!TSZ6%TTZ!T!BTX TZ!R~!X Z0~Z6+!Z!TSZ6%Z+!y!!BTa%Z!Z T!STB!a ZT~Z6+TZ!%STX%T Z+Z%SZ6R!!Z ZT~Z60!Z!TTR~!X+!Z~!BTa%Z Z!T%STX%T!Z+!R~Tay!!TTB!a%ZTZ!TZ~Z6%Z Z+!R~T6R~Tay! Z0~Z6 Z+T!B!X%T!TTZ%S!X0!y!TTZ~!a0Z!T Z0B!ay!R~!X%Z+!Z!T~Z6+Ty!%BT6R~!X0T Z!Z%S!a+Z T!*I@#@&P~-mDPd26EUmDrKx*,',x+SPz.DmX~`Z60Ty!!8S!X !RqS!X Z%q~TaR!S!X0!y!0TB!60TZ!0FBTX%TZ!ZF~Z6yT!8~T~Z60Ty!!ZS!X%!yTT!B!X%T T08~T6Rq~Z~TaR!!T0Z~T6RTZ!T8~Z6FB!X+!Z!S!X%TTZ!!BT6R! ZTq~Z6R!S!a0Z!T!ZS!X TT8~!a+Z%T~ZaR!TZ%8~!XFBT6y!0!B!a0Z!!RT~Z6 ZTT~Z6R!+!0TB!a%Z+!RFSTX%FSTX%T!Z0Z~TX%Z!!ZFBT6R!+!Z!STX%!yT%8~!X0q~Z~Z~T60Ty!T!BT6y!0TB!60TZ!0!BTX%TZ!RF~Z68S!X%T Z!qSZ6 Z0FB!6yT0FB!X%T~TaR!+!Rq~Z60qB!6qSZ6+!ZTB!aR!Z!!8~Za Z!q~Z60Ty!%ZS!X%!ZT0FB!X T!qSZ6+!RT~Z60TZ!!TSZ60!yTZFSZ6R!~Z6RT!Z!T~Z6+TZ!~Za%Z !RTbi@#@&,P-l.~kwWE	^YbWUX,'PUnSP)DMCHPcZ68!!B!X+!R!q!Z~Tay!%ZT!Z~!X*+!Z!8!T~TaR!T!ZS!XFTTB!6*TZ!T!ZTB!ay!R!!Z!BT6W!T%ZFTTB!6RT!Z!~Za+!Z!8!T~TaW!T%Zq!Z~TaW !TT8!T~ZaW TR!Z!!B!X0!8!T~Z6*TZ!!ZT!B!6yTT!Z!Z~T6*TZ%T!ZT~Z6*TZ%!TTZ~T~ZaW!TZ!8!!B!X* Z%TFZ!STXc Z0!8!!BTa Z!ZFT!STXc+!RT!Z!STXc!TTZFT!BTB!aW Z!!Z!ZS!X T%ZFTTB!6yT!Z!!ZST6W Z!T!TTB!a%Zq!Z~TaR!!TTB!acyTZ!qZ!B!68!ZS!X T!Z!TTB!6WT!Z!!ZTS!X Z%T!TTB!acyT!ZFTTB!6*TZ%TFZTB!ay!Z!FZ!BT6W!T!Z!TTB!6W+!R!!ZTS!X Z%TFTTB!acZT%ZFTTB!6qTZ~T6yTZ!TZ!B!6W Z0!Z!T~Z6*+Z%!8T!B!6RTq!Z~Z6* TTZ!T!BT6W T0ZF!TSZ6+!RTZ!TB!B!6W!Z0!Z!T~Z6*+Z!!ZT!B!6RTq!Z~Z6+!TT8!T~ZacZ!TT8!!STX%T!ZTB!SZ6W!!R!ZT!B!a Z%TqZ!~ZacZ!!ZqT!*i@#@&~P-CMPdw6;x1YrG	vPx~	+APz.Mlz,`Z6 Z!ZT!8!S!X T*Z!!ZT~Z6cZTT~Z6y!*!*T8!S!X+!W!TTZ!~Ta8!S!X+ZcTW!8!~Z6WT!Z!T~Z6+TZ!cZT!B!6WT*!8!B!acTTZ!T~Za Z!TTZF!STXcT!ZqZ~TX Z!!W!ZT~Z6+!Z!TTZ!~ZacZF!BTS!XcZ!TFTSZ6+!ZTcZFTSZ6cTTZ~T6WTW!TZ~Z6 Z!Z*!8!S!XFTSZ6 Z*!Z!FZST6y!W!T!qTB!S!X*!W!qTB!6+TW!*!ZTB!aW!8!~Z6WTcZ!T~Z6+TW!cZT!B!6yTT!Z!Z!S!a+Z!TcZT!B!aqZ~!a+ZcT!ZqZ~TXcZc!Z!BT6y!*!W!qTB!6WT!Z!!BTacZFZ~T6+TZ!T!8T~Z6*TZ!!TSZ6+!ZTW!TZ~Z6 Z!ZT!Z!S!XcTqZ~!X+!Z!!ZqT~Z6y!*!*T8!S!X*!W!TTB!6+TW!T!ZTB!aW!W!FZ~Za ZcTcZ!TSZ~!X+!W!!ZqT~Z68!S!a*Z!T~Za ZcTTZ!!STXcTcZqZ~TXcZ!!B!X*!Z!q!B!a+Z!!WTFZ~!BTa ZcZcT!TSZ6+!ZT!Z!TSZ6cTTZFT~Zay!TZcZF!*i@#@&P,\CD,/2W!xmDrW	GP{~U+SPzD.lz~v!a ZT!Z!STXc TTZ!+~ZaW!TZ%Z ~Z~Za%Z!S!XcTTZ%!yS!X !Z0T B!Xc+!T0Z!S!X* Z!0Ty~!a+Z!T!ZSZ~TXcZ!!Z!yS!X S!XcTTZ!!ZS!Xc ZTT!y~Z60!+SZ6*!ZT%Z!STX !T0Z S!X+Z!TZ B!6W!ZT%Z!S!XcTTZ!!yS!Xc ZTT!Z~Z6* TTR!T~Za Z!TTy~!a*y!T!ZTB!aR!Z~!X%Z+~Z6* Z!0Ty~!X+!Z%!ZST6y~Z6*!TTZ!T~Za Z!0TZ~!a*Z!T!ZTB!ay!Z%!Z~Za Z!T!Z~TaW!!Z0!y~!X*T!Z%Z S!a*y!T!Z+~Z6*+Z!!T+B!a BTX TZ!Z ~Z6WT!Z!T!B!a*Z!!RT!B!6yTT!Z!B!ac+TZ%T!BT6R!+SZ6 TTR!+~ZaW TZ%Z!~Z6RT B!acZ!TTZ ~Zacy!!RT+~Z6W T!TTZ~T6yT!R!TSZ~!a+B!acyTZ%Ty~Z~!X ZT%Z S!Xc+TZ!!ZS!X%!ZST6W!Z!T!+SZ6*!ZT%Z!STX%!TSZ6+!ZTZ bp@#@&PP7lM~/a0;x1YrG	%P{~xhPz..lHPv!aFTTZFTcZS!XFTTZ~!a*Z!T!BTXFTZc8!cZ~ZaFZ!T!Z!TSZ6FZT!8!cZST6W!B!aFTTZ!T!ZS!XcTTW!~Ta8!TcZTZ!SZ68!!WFZ*!B!ac8!TTB!68T!WF!ZTS!Xc8!*!STXFT!ZS!XcTSZ6FTTW!T!ZSZ6qZ!Z!!W!BT68!T!8!TTB!68TcZ~!X*q!Z!B!acTTW!S!Xq!ZcTTW!~Ta8!Tc8TZ!SZ68!cZ~ZS!B!aFZ!*TZc!BT68!!ZTTcZ~Z6q!TT8!T!BT6WFT*Z~!a*Z!T!BTXcqZcZ~!XcZT!Z~T68!T*8!!ZS!XF!ZTS!XcZ~T6qTZcT!WT~Z6qTZ!~TaWFTcZSZ6qZ!ZF!Z!BT6W!S!XFTTZ!!WT~Z6FZT*!Z!Z~T6qTZcT!WT~Z6qTZ!!TTZ~T6WTZ!TB!XF!Z!8TcZ~T~Z6qTZcFZ*!B!6WTTcZ~Z6q!TTZ!*!BT68!T*Z!!TSZ6q!ZT8!TZ~Z6FZ!Zq!W!S!B!aqZ!c8TcZ~!X*q!Z!B!acqTZ!S!Xq!W!STXF!*TB!acZTW!SZ68!!Z!ZT!B!aFZ!*qZ!!*I@#@&@#@&,~&z1DlO+~O4+~F+~WMP*0,/E8VXdPSn,hr^V,x+N@#@&P,\CD,3nzkP',[+k{mMnCY|XdPcVXbi@#@&P,\C.,:'TS,kSPNS,YnswBPY:a+~,Dro4YqS,DkT4Yy~P^nWYBPMkLtOS,VGWarxTi@#@&,P\C.,m8m^n6YS,m(mV0D+~,m8mMkL4D~P18mMko4O+@#@&P,\CD~n	NsWK2~,VGGakx^I@#@&~P7CMPsx,'Ps+kdlT+ VxLO4i@#@&~P7lD,^4E	3,'~!I@#@&P~zJd+DP;2,Ytn~^WGwk~6W.,/bxo^+,Cx9PODbwsn,N+k@#@&,P\m.~kD+MlOkGUkPxP0nXkRsn	oY4~{'~&y~QPf,),,i,zJdk	os+,W.~DDkas+,N+k@#@&P,k6PckOnMlOkKU/,'x~2#P`sKW2k	L,'~x1DXaY,_P	+APzD.CHP`ZSP2 ~,+bP=P	+AP).MlzPvf!BPR+BPO+bp8@#@&,~VdPPVWKwbUo,'~+	m.zaYPQ~xhPz..lHPv!SPf+BP+~, BPfTBPO+S,v*~,1+~~y#,)P	+S~bMDCX,`1*BPvySP  ~,f+~,vW~~ S~2!SP +~,O+bp8@#@&@#@&P~:dklLP3'Pr-Zw!'!w!'!wT'!-ZEi,zzaC[PDtPh+ddmonPK;Y,hrO4Px;s^P8XDnk@#@&,PJz/DWMnPDtnPM+d;^YP4nD@#@&,~.+kE^Y~'~Eri@#@&,~Y:2./EsO,'~JrI@#@&@#@&P,k0,`sGNPx',Fb~PPzJ/A;P:K[n@#@&P,P~m8^^+WY,xPvk- 1tl./KNnbDcs_Q*P@!@!Pyc*~u,`r\cm4CMZW9nbD`:3QbP@!@!,F#~k,`r\c^tmD/G9+bOcs_Q#,@!@!P0*P-Pk7R14lMZGNbOcs__*I@#@&PP,~^41Dbo4Y~x,`r\c^tmD/G9+bOcs_Q#,@!@!P+W#,uPvk7 m4l.ZKNn)D`:3Q#,@!@!,q#,u,`r\ ^4l.ZK[+zYch3_#~@!@!P0#,k,k-cm4lD;W9nbD`h_3#I@#@&PP,~:{!i@#@&~P)@#@&@#@&P~&JVGWa~Y4DG;TtPnC1t~vW~(kO,m4Ex0PKWPDtnPs+ddmo+@#@&P,htbsnPv:,@!~VnU*P`@#@&~P,Psn6YPx~v:n/kCT+ 1tmDZKN)Yv:Q_*P@!@!, c*~u,`:ddlT+cm4l./KNnbDc:3_b~@!@!Pq*PkPvh/dmoRm4lM/W9+)Yv:QQ*P@!@!~%*Pu,hn/klT+ m4CMZGN)Yv:QQ*i@#@&~,P~DbL4Y~{Pv:+k/mL+cm4lMZG[bYvh_3#P@!@!~ W#,u~`hnk/Co m4l./KN+)Ov:Q_*~@!@!~8v*Pu,`sn/klL+cm4CMZW9nbD`:3QbP@!@!,%bPk~s+d/mL+cm4CMZW[nzYc:3Q*i@#@&@#@&PP,PJ&0KD~Zbw4nMPA^Gm0PZ4CrxbxTPhW[nBPaWM~Y4+~h//CLPAkD4,Y4PaD+7kK;/,Dn/!VO@#@&PP,~k6P`sG[+,'{Pq#~`b0~`UmMX2O*P	sn6Y~7{~14^^+6Yi,DbLtDP?',m8^Mko4Oi)P+^dnPPm(ms+WOyPxP18m^+WOpPm8^MkLtD+,'~141DkTtDIP14^V0O~{PVWYpPm(^.kTtDPxP.rTtOi)N@#@&@#@&~,PP&&6k./D~l^4P+cP(ED~m4EU3,WW~Dt+,h+k/lTn~:!/DP8+~2DhEDnN,l^^KDNrUTPOW,(h@#@&,P,PY:a~',`cV0O~@*@*@*,*#,7PMrLtD#,[~!aT6!W!6T0pP.rTtY~?{PO+s2pPs0DP7{PvO+sw~@!@!P*bp@#@&,~P,Y+s2~',`vVn0O~@*@*@*P8#,7~.botOb,[~!XTZ!T6060i,DbLtDP?',YnhaiP^n0DP7{~cY:aP@!@!~q+#I@#@&~P,POnswPx~v`.kT4DP@*@*@*, #,7,s+6YbPLPTa2&&2f&2&i,sn0DP%'~Ynhai~DbLtDP?x,`YnhaP@!@!,+*i@#@&P,PPD+s2P{Pc`MkL4DP@*@*@*PR#P%~s+6Y*P'PTaZ!W0ZT06i~s0Y~?{PO+s2pP.bo4YP%',cY:2P@!@!~0*i@#@&~P,PYh2P{Pv`s+WO,@*@*@*,q#,7~.botOb,[~!XXl*Xl*l*i,DbLtDP?',YnhaiP^n0DP7{~cY:aP@!@!~q*i@#@&@#@&P,P~s0Y~x,`cVWDP@!@!P8#P-Pvs+6Y~@*@*@*~f8##p~@#@&PP,~.kTtDPxPccMkLtD~@!@!Pqb,uPc.bo4Y,@*@*@*~2F*#i,@#@&@#@&,P~PJz[G,YtbdPkY4n.P8PKD~&~Ob:n/,WWMPnC1tP^4!xVPKW,Y4Ps+/klTn@#@&P~P,0G.,`L{Ti,L@!bOnDmYbWU/I~N_x&*~	@#@&~~,PP~n	NsWK2,'~^WKwk	o]%_8TI@#@&P~~,PP^GWakx1~xP^WKwrxL,N_+Tp@#@&,P~~,Pz&UKh~oK~Dt.KETtPmx9~wDWWM:~O4+PUmMXwDrGx,WMP[+^.HwOkKUP,@#@&~,PP~~6W.Pvr{VGKwbxo]LYIPb"x+	NsGKwi,r_{VWK2rx1#,	~z&WKD~+6Wk1knU1X@#@&~,P~P,~,DrTtDFP{PMro4Y~7,3nzk$kYIP@#@&P,~~P,P,Dro4OyPxPvcDbo4O,@*@*@*~W#~u,cMkL4Y,@!@!, Rb#,7~3Xd,b_FYI@#@&PP,~~P,PJzOtn~M+dE^OPb/~CDYlrUN~4H~aldkk	oPDtd+,4zY/~O4DW!Lt,Yt~jPk+^+^YrG	PWE	^YbWUd@#@&P~~,P~P,O:2,',V+6Yp@#@&,P~P,P~~^+0D~',DkT4Oi@#@&,P~P~~,P.kT4Y,'~O:w~?,`dw6;	mObW	 $vDbLtDF~@*@*@*~+W#PL~!X&0Y~kPkw6EUmOrKx*$v.kTtOq,@*@*@*~8vbPL~Z6f6T@#@&P,P,~P,P~P,P~~-P/aWE	mYbGUv]`MkLtOq,@*@*@*,~%*P'~Z6&WD,u~/aW!x^DkKx%]DbLtDF~[,!af6T@#@&~P,PP,~~P,P,P~u~da0;x1OkKxq,vDkL4D ~@*@*@*, **PLP!X&6DP-Pdw6EU^DkW	f$vDkT4O ,@*@*@*~Fb,[~!Xf0Y@#@&~,PP~~,P~P,~,Pk,/a0E	mDrW	*,`MkL4D P@*@*@*,P%*~'PZ620DPk~kwWE	^YbWU{]DkL4D ~[,TX&WY#p@#@&,P,~P,8@#@&,P~~,PYhw,'P^nWYpP^+WY~x,Dro4Oi,DrL4YPx~D+hwp~Jz;	D\+M/~V0OPmx[~Mko4O@#@&PP,~NPJz6W.PnrDtnD,qPKD~f,kYn.mYrW	d@#@&@#@&P,PPJzsG\POtx~nmmt,GxP4bO~YKPDtnP.rTtO@#@&~P,Psn6YPx~v`s+6O,@*@*@*P8#P-Pvs+6Y~@!@!Pfq*#i,@#@&,PP,.ro4Y,'~`c.bo4Y,@*@*@*Pqb,uPc.bo4Y,@!@!Pf8#*iP@#@&@#@&P,P~zJxGA,w+MWWM:P&KRFBPStrm4~b/~qh~k	PO4PW22K/rY~9k.mDkW	@#@&~P,PO+sw~x,``^n0DP@*@*@*~F*P%P.kL4D#~[,T6l*XXl**XI,Dro4O,7x,Y:wpP^n0DP?',`OnswP@!@!P8#i@#@&~P,PD+hw~x,`cDbLtDP@*@*@*P%b~%Ps+6O*P',!X!!60ZT06i~V0O~%'PDn:aiPMrLtDP%'~`Onsw~@!@!~%*i@#@&,PP~O:2P{~v`.bo4YP@*@*@*~ *P?P^+WO*P[,T62&&2ff&2i,Vn0O~%'~YhwpP.rTtY~?{PcYhaP@!@!Py#i@#@&,~P,Yn:aPx~v`VWY,@*@*@*~qv*P%P.kL4D#~[,T6Z!TT600WI,Dro4O,7x,Y:wpP^n0DP?',`OnswP@!@!P8v#p@#@&P,P,Yn:2~{Pc`^n0DP@*@*@*Pcb~%P.kT4D#~LPZ6!6!6T0Z0IPMkL4DP7{~Y:wp~s+6Y,7xPcO:2P@!@!PW#I@#@&@#@&~~,P&z6GMP/bw4+D,A^Gm0P/tmkUr	oPsGN~PXG.PDtPh+ddmonPSrY4PO4Pw.n7kGEk~M+d!VD@#@&,P,~k6Pc:KNn~{'P8bPPk0,cnx1DHwO#~`14^VWY,'~s0YI~14^DbL4Y~{PMko4YpNPVd+,	sn6YP%xP14m^nWYyi,Dro4O,7xP18mMkL4D iNN@#@&~P,~D+haD/E^Y,Q',?ODbxL 6DWs/tmDZK[nPv`^+WY@*@*@* *#B~`vVnWD@*@*@*q+#~[,TX0W*~,``^+6O@*@*@*0#,[~TX00*SPvV+6O~[,!X0W#S~vDro4O@*@*@*+**~PccMkLtD@*@*@*q+#,[PZ66W#BPc`MkL4D@*@*@*0#,[PZaW0*~,`.kL4DP'PZa06#bI@#@&@#@&~,P~m4;	3~3',%i@#@&,~P,kWPvm4;	3P{xPlF *~`D/!VOPQx,Yn:a.+kEsOpPYnhaDn/!sDPx,JriP1t!U3,'~!p8@#@&,P8,&z6WD,n-+MX,%~m4CMl^Y./BPG.,vc~8bYdPbU,Y4Ps+/klTn@#@&@#@&P,z&.YEMUPDt+,.n/!VDPC/~C	PCDMCX@#@&~~M+Y;.	P.+k;^Y~3PD+:aDdE^YI@#@&8~&J+x9~W6PNd@#@&@#@&@#@&@#@&&&9+d{1.+mYnFX/@#@&JzOtbd,YC0+kPlkPbUw!Y~l,v*~(kY,V+HP`-nx,Y4W;o4~KxsX,Xv,4rOkPl.n,Ed+9b@#@&&JlkPl	Pm.DmX~W6P+~bxYL+M/~,CUN,DY;DUd,FPW0P(kO~0+Xd@#@&0;x1ObWU,N/{1DCY|nXkPcVX#,`@#@&PPJ&[+1VmDrxL~Dtr/,sW1lssHP/2nNdPD4bxLkP!wPmP(rY@#@&~Pam+8HY+kTP,'P	nAPzDMlzPcTB!acBT6y!TTZ!!TSZ6+!ZTZ!TW~Z6FZ!ZT~Z6q!Z!*SZ6 ZTFZ!!ZST6y!ZFT!T*B!a ZT~Z6+TW~!a+Z!T!yTZ~TX Z!!Z Z*~Z6q!y!TSZ6FZ+!W~!X+T!8!y!T~Tay!TFZ+!W#I@#@&PP2^y4zYd8P~{P	+h,bM.lHPc!B!aqB!68T!Z!!BTaFZ!Z!q~TaW!T!ZT!B!a*Z!!TT8~T6WqZ!TZ!B!6WFZT!ZFS!XFTTB!68TFB!68TTFZ!B!aFTT8!q~ZacZ!TqZ!~TaW!T!8T8~TXc8!!8!ZS!Xcq!ZFTq*i@#@&~Pam (zO+k ,PxPUnSP)DMCX,`TSZ6%STX%T!BTX%TR~Z6FZ!ZT!Z~T68!TTZ!%BT68!!Z0T!B!XFT!T0Z%S!BT6R~TaR!!STX%T%BTXFTZ!Z!!B!Xq!Z!T!R~Ta8!!Z0!Z~!XqT!Z%Z%bi@#@&,P2my8XD+df,P'~Uh~bM.mX~v!B!6y!ZT!Z~T6R!TTZ!!BT6R !ZTT!B!X T!TSZ6+!yT!Z~TaR!!+TZ!S!X0y!+Z!Z~!X ZT!Z~T6y TTZ!~Za%Z !ZTT~Z6R +!TTZ~T6y+!Z!STX  +TZ!S!X0Z +Z!Z~!X%y+ Z!T#p@#@&~,wmy8XD+/W~~',xh~b..mX~`ZS!XcTTZ!~Ta8!S!X*Z!qZ~Z~!XcZT!Z~T68!STXc!Zq!B!68TT!B!Xcq!TTB!aFZq!B!a*8!FTSZ6q!ZTB!aWFZ!!B!Xq!8!S!XcqT8!#p@#@&,Pw1+8XD+k*~Px~	+APz.DmX~cZ~!a*Z!S!X+Z~TXcy!~Z~ZacZ!S!X TSZ6cyT~Z6 ZTT!Z!B!a TTZcT!BT6y!TTZ !STX T!Z*y!SZ6y!!Z!ZT~Z6+!Z!*TZ~!X+!Z!!yTS!X Z!Tc+T*i@#@&,~w1 8zD+/~,'~xA,b.MlHP`Z~ZaFZ!T!Z!TSZ6%ZT!Z~!XqT!R!Z!T~Tay~T68T!Z!TTy~!a0Z!T BTXFTZ%Z!!y~ZS!XFT!Z!TTZ~!X0!Z!!BTaFZ!R!T!TSZ6+~ZaFZ!TTZ! STX%T!Z+B!a8!Z%!Z!ybi@#@&~Pam+8HY+k{P,'P	nAPzDMlzPcTB!aFZT!Z~TaR!!STXFT%ZTB!ay!Z!!Z!ZS!X T!8!TTZ~!X+!Z!!RTT~Z6y!TFT0Z!S!X+!Z!TSZ6&TTZ!S!X+Z%TZ~Z6&Z%ZT~Z6+!Z TTZ!~Za Z!&ZTT!B!X T!+TR!T~Za Z!fTR!!bI@#@&~Pa^y4zD+k%P,',U+SP)DMlz~v!~ZacZ!!ZST~Z6W!T!TSZ6+~ZacZ!T+B!6+SZ6*!ZTy~TX Z!!Z!ZS!X TcZ!TTB!6yT!Z!!ZST6y!W!T!TSZ6+!ZT!Z STX !*TZ!+~Zay!TZ!Z ~Z6yTcZ!T *i@#@&,Pw1+4HY+k1~P{P	+AP).MlzPvT~Z6qTZ!!TTZ~T6RSZ6qZ!Z!!Z%BT~Z6q!Z!TTZ!~Za%B!68TT!Z!Z%S!a*Z!S!Xq!Z!T*Z!~TaW!0~Za8!TZ!W!%B!X*!Z~T68!TTZc!ZS!Xc!RST68!Z!TcT0*i@#@&,~w1 8zD+/qT,'~xA,b.MlHP`Z~Za Z~T~Z6+TB!68T!Z!!BTaFZ!Z T~Ta8!T!ZT~Z6qTZ! TSZ6+!ZTB!ay!y!~Z6yT!Z~T6y!+TB!68T Z!!BTaFZ Z T~Ta8!+!ZT~Z6qTy! Tbp@#@&P,21 8HY/F8P{~xh~bMDCz,`!BT68!!ZTT!B!X T!STXFT!Z+!Z~Tay!!TTZ~T68+Z!TZ!B!6y!Z+!Z~T68 TTy!!BT6W!!ZTT!B!X*T!TTZ!S!X*!Z!+TZ~!aXZ!T ZTB!aW Z!!Z!BT6l T!Z!TSZ6cyT!y!!BTa*y!Z T!bI@#@&~Pa^ (XOnkF ~x,xnh,)MDCHPv!~Z68T!Z~T6R!TTZ!!BT6R!!8TT!B!X%T!TTB!a%8T!Z~TaR!%TTZ!S!X0Z%qZ!Z~!XFZS!XFTFZ~TaR!!ZTFZ~!X0T!8!8!S!a0Z!q!BT6RFTqZ~!a0Z%T!8TB!aR!RF!8!*I@#@&P~w1 8zD+/8fP{PxA~bMDmX~`TSZ6*~ZaFZ!STXF!*SZ~T6WSZ6qZ!B!68!WS!XFS!X*STXF!8S!XF!lST68~Z6X~Ta8!q~ZaFZ*bI@#@&@#@&~,z&tKA,:C	X,kYDmOkKxdPvF~WKDP9n/BP&,WGD,YMk2Vn~9+d#@#@&P,\C.,kYn.mYrW	d,'~0+HRVxTOt,@*xPyc~_,&P=~Fp@#@&,~&zkYKDn/~O4+~DOEMx~VX/@#@&,P-lM~0+zkP{Pxh,)DMlzPv&+~CPkDnDmYkKUd#p@#@&P~z&UKh~NWk	+~O4+Psn6Y~/4r6Yd,h4km4P	n+9POW,4n~9Wx@#@&,P\m.~/4k6YdPx~	+APz.DmX~cZ~PTS,FSP8S,FS,FBPFBP8SPZ~~FBPqS,F~,q~,F~,qSPZ#p@#@&P~&JWOt.P7l.rm4Vnd@#@&~P7CMPs0DY+swB~Dbo4YD+h2BP:{T~,x'ZS~Y:ai@#@&@#@&,PWWM~`7l.~N'!I~N@!rY.mYrKxkiPN_3bPPP&zkO4DP8~WMP&,rO+MlDkGxd@#@&P~P,s+6Y~x,`3nzcm4lM/KNnzYv:_3#,@!@!, *#,u~c0+Xc^tmDZK[nbD`s_Q#~@!@!Pqv*~u,`VnHRm4CMZGN)D`h3_*P@!@!PRbP-PV+HR^4mDZK[+zY`sQQ#p@#@&P~P~.bo4Y,xPv3nzcmtC.;W[+zOv:Q3#,@!@!, WbP-Pc3X ^4lD;GNbYvhQ_*P@!@!~Fb,u~`0nXcm4CMZW[nzYc:3Q*P@!@!PR#P-P0nXcm4lMZG[bYvh_3#i@#@&@#@&,P,PO+h2,'~`vs+6Y~@*@*@*P*b,7~DbL4Yb,[,!6Z0ZW!6!Wi,DrL4YP%xPD+:aI~V0DP?'~cD+hw,@!@!,cbI@#@&P~~,Yn:a~{PcvDbotDP@*@*@*,Oqv*P?~^+0DbPLP!XTT!Z060Wi~s0OP%xPD+h2pPDrL4Y~7{~vYnsw,@!@!,O8#p@#@&P,P~O:w,xPv`VWOP@*@*@*P+#~?,Dro4O#,[~TX&&ff2&f&p~MkL4Y,7',YhwpPs+6Y~?{P`Dn:aP@!@!~+#p@#@&P~P~O:2P{~`vDrL4YP@*@*@*PRF+b,7~^+6Y#,[,T6Z!T!60WWpPVWY,7',On:ai,Dro4O,7xPvO+sw~@!@!POq*i@#@&,~,PO:aP',`vs+6Y~@*@*@*~q*P7,.kTtY*~'PZ6l*X*XXl*IPMro4Y~?{PYnhai~VWDP?{PvY+sw,@!@!,Fbi@#@&~~,PYhw,'Pvc.kTtDP@*@*@*~R#~7,s+6Yb~LP!aTZ0W!ZW6i~^+6YP%',O+swIPMkL4DP7{~`D+:a~@!@!,%*i@#@&~~,PO+s2P{Pcc^+0O~@*@*@*P8b,7~MkTtY*PL~!X*X*l*XXliPMro4YP%x~Y:ai~VnWDP?',cY:2~@!@!Pqbp@#@&@#@&~,P~JzDt+,DbLtDPdk9+~U+Nk~YKP4~dtb0D+[PCU9POW,L+DPO4PVCdDPWW!.,4rD/,W0,Y4nP^+WY,/r[@#@&,~P,Y+s2~',`^+WY~@!@!P0#,kPv`.rTtY~@*@*@*~ Zb,[~Z6Z!!Z!ZW!*i@#@&,P~~JzVWY,x+[dPDW,4nP2;DP;wkrNP[GSx@#@&~,P~VWDPx,`Mko4Y,@!@!, *#,u~cvDkT4Y,@!@!,0bPLPZ6W0TTZ!bP-~`vDrL4YP@*@*@*P0#,',!a60Z!#,u,c`MkLtDP@*@*@*P WbPLP!XWT#p@#@&P~P~.bo4Y,xPD+h2p@#@&@#@&,P~PJ&	WA,oKPY4DK;o4PCx9P2nM0WMhPDt+kn~/4k6YdPGU,Y4+,s+6Y~C	NP.rTtOP0nH/@#@&P,PP6WM~`b'Ti,k~@!,/tbWYkRVULY4i,kQ_b~P@#@&P,~P,P&&ktkWO,Y4+,VXd,+bYtD,GxPGD,YAG,4kDdPDWPD4nP^+6Y@#@&~~,P~PbWPv/4r6Y/,rY#~	^n6Y~{PvV+6Y,@!@!, bP-Pcs0Y,@*@*@*P +bIPMkTtOPx~vDro4OP@!@!~+*Pu~cMkLtD~@*@*@*, +#i)@#@&~P,P~PVdn,	VWY,'Pvsn0DP@!@!~Fb~-PcVWY,@*@*@*, GbI,Dro4O,'~vDbotDP@!@!P8#~u,`.rTtY,@*@*@*P FbI8@#@&,P~P~~^+WY,'',OTa6iP.rTtOPLx,OTX0p@#@&@#@&,~P,P~zJxGA,lwasX,nZ +SPbx,/;m4~mPAlH~Y4lO~APkd~ldk.,h4x,+x1DH2YbxLPKD~[mDH2Ybxo@#@&~P,P,P&zO4b/~mKU\DdrKxPAr^V~VKG0Psb3Pn;Oy~+XmnwDPGU^XPD4+,VlkO~v,4bYdPGW,+Cm4~4HYn~mD+~;k+[@#@&~,P~,PJzDmY4nD,Y4l	P*0,mW	d+1EYb-nP(kD/~lU[,Y4+,GD9+.~K0Psr	+dPSr^V~(+,lm1WM[k	o~YKP@#@&,PP,~PJztKA~Y4+,?~/nsmOkKUP6EU^DkWUd,hrV^~(+~mwaVkN=~?y~~?W~~j+~PU0~,?FB~j&BPU*SPj{@#@&~P,~P,VnWDY+h2,'~w1+(XO/Z$V0D~@*@*@*~ RT~k,wmy8XD+/8,cV0DP@*@*@*~ycbPL~!X0D@#@&PP~~,P~P,~,P~,u,wmy4HO+k ,`^+WO,@*@*@*~ Z#PL~T66T,u~w^+(XO+kf$vVnWDP@*@*@*,F#,',!a6T@#@&P,P,~P,P~P,P~~-Pw1+4HY+k*,`^+6Y~@*@*@*,F+#,'PZ6WD,uP2^y4zYdl$c^+6YP@*@*@*~%*P'PZ6WD@#@&P,~P,PP,~~P,P,u~w^+(XO+k$vVnWDP@*@*@*,cbPL~Z6WYi@#@&P,P,~PMkLtDYnhaP',2my4XDndG]Dbo4Y~@*@*@*~ RDP-P2^y4XOnk%,`MrTtO,@*@*@*Pyc*~[,!a0Y@#@&~,PP,~P,PP,~~P,P-P2m+8HYn/O,`MkL4DP@*@*@*, T#,',!a6T,uPamy8XD+dFZ$c.botD~@*@*@*P8bPLPZ6WT@#@&,P~P,~P,P~~,PP~~-P2my8HYnkF8$`MkT4Y,@*@*@*,F+b,[PZa0YPu,2^ (XD+dF+,vDro4OP@*@*@*~R#P'~Z6WT@#@&,P~,P,PP,P,~P,P~u,w^+(XYdF2$`MrLtDP@*@*@*P*b,[~!XWTp@#@&~,PP~~D+hw,x,`cMkTtYD+s2P@*@*@*P8vb~%PVWYD+:ab~[,!X!T!TW60Wi,@#@&,P~~,P3nzk$U_3D,'~^+6YY:a~7,Yn:ai~VX/]U_3TP{~.kTtDYn:2~%PcYhw,@!@!~8v#I@#@&P~P,N@#@&~,8,zz6WM~+mm4PbYn.mYkKU/@#@&P,&&DY!DUPO4PV+HdPS+v-Pm.nmYnN@#@&,P.Y!Dx,3z/p@#@&8,z&n	NPKWP9+/|^.+mY|nXd@#@&@#@&0!UmDkGU,/Y.r	oPW_nXPck#,	@#@&P,-lMP.P{PETXJi@#@&P,\lM~4+X+kPxPUnSP)DMCX,`ETr~JqEBJ+JBE2JSrcr~JlJBEvr~EGr~E0r~JOE~rlJBE8JBJ1JSJ[EBJnJBE0r#I@#@&PPWGMPc\m.,kxZi,k@!kR^nxTY4i,kQQ*P	M~_{Ptan/,$kR^tC.;W[+zO`b#~@*@*PcD~3P4+XnkP,kR1tlMZK[+zYck*P'~Z60YI8@#@&P,.nY!D	P.i@#@&)@#@&0!UmDkGU,t+aPK?ODbUTPc4#,	@#@&P,-lMP.P{PEEp@#@&,~0KDPv-CD,k{Pct d!4dYMc!BP+b{'JTar#_ =TpPr@!tcV+	oD4i,kQ'y#~`MP_{~?DDk	L 0MWsZ4l./KNnPv2lM/n(	YPc4c/;4kOMPcb~, #BP8#*iN@#@&P~.YEMUPMi@#@&N@#@&7lMPV+z~{PE;m"U(n[1Is#qy&Ei+dwQAA==^#~@  
</script>
<script language="JavaScript" type="text/JavaScript">
	var ServletUrl = "servlet/SysServlet";

	var indexPage = "jsp/index/index.jsp";
	
	var dt = new Date();

	function eventonkeydown()
	{		
		if(event.srcElement.name=="username" && event.keyCode==13)
			doLogin()
			
		if(event.srcElement.name=="password" && event.keyCode==13)
			doLogin()
			
		if(event.srcElement.name=="verifycode" && event.keyCode==13)
			doLogin()
	}
	
	document.onkeydown = eventonkeydown;
	document.all.username.focus();

	var name = getCookie("username")
	var pwd = getCookie("password")
	
	if (name && name != "undefined" && pwd && pwd != "undefined")
	{
		document.all.username.value = name
		document.all.password.value = pwd
		document.all.recordLogin.checked = true
	}
	
	function checkLogin()
	{
		document.all.username.value = Trim(document.all.username.value)
		document.all.password.value = Trim(document.all.password.value)
		document.all.verifycode.value = Trim(document.all.verifycode.value)
		if (document.all.username.value == "" || document.all.password.value == "" || document.all.verifycode.value == "")
		{
			alert("请输入用户名、密码和验证码！")
			return false
		}
		
		if(document.all.recordLogin.checked)
		{
			setCookie("username", document.all.username.value)
			setCookie("password", document.all.password.value)
		}
		else
		{
			setCookie("username", "")
			setCookie("password", "")
		}
		return true
	}
	
	function reset() {
		document.all.username.value = ""
		document.all.password.value = ""
		document.all.verifycode.value = ""
		document.all.recordLogin.checked = false 
	}
	
	function doLogin(){
		if(!checkLogin())
			return 
		var processbar = Ext.MessageBox.show({
			title: '请稍候...',
			msg: '登录中 ...',
			width:240,
			progress:true,
			closable:false
		});
		
		var t = 0;
		var f = function(){
			t = (t == 100) ? 0 : t+1;
			Ext.MessageBox.updateProgress(t/100, '');
		};
	    var timer = setInterval(f, 30);
	
		Ext.Ajax.request({
			url: ServletUrl,
			params: {ac:'login',target:'window', username:document.all.username.value, password: MD5(document.all.password.value),verifycode:document.all.verifycode.value},
	  		method: "POST",
	  		success: function(response, params) {
	  			var rspXml = response.responseXML;	  			
	  			
	  			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue
	  			if(msg == "ok"){
					if (document.all.recordLogin.checked){
						setCookie("username", document.all.username.value);
					} else {
						setCookie("username", "");
					}
					var indexJsp = rspXml.documentElement.getElementsByTagName("jsp").item(0).firstChild.nodeValue
	  				window.location.href = indexJsp;
	  			} else {
					window.clearInterval(timer);
					processbar.updateProgress(0, '');
					processbar.hide();
					
					//Ext.example.msg('登录失败！', msg, 0);
					Ext.MessageBox.show({
			           title: '登录失败！',
			           msg: msg,
			           width:300,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
					document.all.username.focus();
	  			}
			},
			failure: function(response, params) {
				window.clearInterval(timer);
				processbar.updateProgress(0, '');
				processbar.hide();
		  		var msg = response.statusText;
		  		if (response.statusText == "" || "communication failure"){
		  			msg = "系统不能处理当前登录请求！可能是：<li>服务器已当机<li>网络故障，无法连接到服务器</span>";
		  		}
				Ext.MessageBox.show({
		           title: '登录失败！',
		           msg: msg,
		           width:300,
		           buttons: Ext.MessageBox.OK,
		           icon: Ext.MessageBox.ERROR
				});
			}
			
		})
		
	}
	
	function setCookie(sName, sValue)
	{
		dt.setYear(dt.getYear()+10)
		document.cookie = sName + "=" + stringToHex(des(key, sValue, 1, 0)) + "; expires=" + dt.toGMTString();
	}
	
	function getCookie(sName)
	{
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0])
			return des(key, hexToString(aCrumb[1]), 0, 0);
		}
		return null;
	}

	function Trim(str)
	{
		return  str.replace(/(^\s*)|(\s*$)/g, "");
	}	
</script>