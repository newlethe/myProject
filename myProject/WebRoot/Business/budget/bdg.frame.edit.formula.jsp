<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>公式说明</title>
		<base href="<%=basePath%>">

		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>	
		<!-- PAGE -->

		<style type='text/css'>
			*{
				padding:0;
				margin:0;
				font-size:14px;
				font-family:"宋体";
			}
			body{
				margin : 5px;
			}
			table{
				border-collapse: collapse;
				/*table-layout:fixed;*/
				border:1px #0060CC solid;
				margin:0 auto;
			}
			.table_th{background:#D3D3D3;font:bold 14px/20px "宋体";border:1px #7FBBFF solid;padding:5px 5px; align:center;}
			table tr td{font:14px/20px "宋体";border:1px #7FBBFF solid;padding:2px 5px;}
			a:link,a:visited,a:active{color:#000;text-decoration: none;}
			a:hover{color:#f00;text-decoration: none;}
		</style>
		<script type="text/javascript">
			window.onload = function(){
				var wordArr = new Array();
				DWREngine.setAsync(false);
				baseMgm.getData("select p.property_name,p.detail_type from property_code p where p.type_name=(select uids from property_type r where r.type_name='字段说明')",function(list){
					if(list){
						for(var i=0;i<list.length;i++){
							var temp = new Array();
							temp.push(list[i][0]);
							temp.push(list[i][1]);
							wordArr.push(temp);
						}
					}
				});
				DWREngine.setAsync(true);
				var tab = document.getElementById("formula");
				var len = tab.rows.length;
				for(var i=0 ;i<wordArr.length;i++){
					var aRow = tab.insertRow(len+i);
					aRow.insertCell(0).innerHTML = wordArr[i][0]; 
					aRow.insertCell(1).innerHTML = wordArr[i][1]; 
					
				}
			}
		</script>
	</head>
	<body>
		<div>
			<table id="formula" name="formula" width="755" align="center">
				<tr>
					<td align="center" name='word' width="200" class="table_th">字段名称</td>
					<td align="center" name='desc' width="530" class="table_th">字段公式说明</td>
				</tr>
			</table>
		</div>
	</body>
</html>
