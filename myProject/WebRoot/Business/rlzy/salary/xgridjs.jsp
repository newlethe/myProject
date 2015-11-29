<%@ page language="java" pageEncoding="UTF-8"%>
<!-- @author:lizp  -->
<%@ include file="/dhtmlxGridCommon/xgridCommon/baseCommon.jsp" %>
<link rel="stylesheet" type="text/css" href="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.css"></link>
<link rel="stylesheet" type="text/css" href="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid_skins.css"></link>
<link rel="stylesheet" type="text/css" href="<%=path%>/dhtmlxgrid/codebase/dhtmlxcalendar.css"></link><!--date的css-->
<!--XGRID-->
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcommon.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgridcell.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxtreegrid.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_selection.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_math.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxdataprocessor.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid_extx.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/excells/dhtmlxgrid_excell_link.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid_filter.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_srnd.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxtreegrid_filter.js"></script>
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_mcol.js"></script><!--列拖拽  -->
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/excells/dhtmlxgrid_excell_time.js"></script><!--time-->
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar.js"></script><!--date-->
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/dhtmlxgrid/codebase/excells/dhtmlxgrid_excell_calendar.js"></script><!--date-->		
<!--END XGRID-->
<script type='text/javascript' src="<%=path%>//Business/rlzy/salary/colManage.js"></script><!--column管理-->		
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/excel/dataToExcel.js"></script><!--导出excel管理-->		
<script type='text/javascript' src="<%=path%>/dhtmlxGridCommon/xgridCommon/dhtmlxgridext.js"></script><!--xgrid开发应用-->