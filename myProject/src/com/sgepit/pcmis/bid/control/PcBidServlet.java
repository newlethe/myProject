package com.sgepit.pcmis.bid.control;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.fileAndPublish.control.ComFileSortServlet;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pcmis.bid.hbm.PcBidCompQuery;
import com.sgepit.pcmis.bid.hbm.PcBidOpenBidding;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;
import com.sgepit.pcmis.bid.hbm.VPcJiaJieReportIndex;
import com.sgepit.pcmis.bid.service.PCBidApplyService;
import com.sgepit.pcmis.bid.service.PCBidService;
import com.sgepit.pcmis.bid.service.PCBidTbUnitService;

public class PcBidServlet extends MainServlet {
	private static final Log log = LogFactory.getLog(ComFileSortServlet.class);
	private WebApplicationContext wac;
	private PCBidApplyService pcBidApplyService;
	private PCBidService pcBidService;
	private PCBidTbUnitService pcBidTbUnitService;
	/**
	 * Constructor of the object.
	 */
	public PcBidServlet() {
		super();
	}
	/**
	 * Initialization of the servlet. <br>
	 * 
	 * @throws ServletException
	 *             if an error occurs
	 */
	public void init(ServletConfig config) throws ServletException {
		// Put your code here
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.pcBidApplyService = (PCBidApplyService) this.wac
				.getBean("pcBidApplyService");
		this.pcBidService=(PCBidService)this.wac.getBean("pcBidService");
		this.pcBidTbUnitService=(PCBidTbUnitService)this.wac.getBean("pcBidTbUnitService");
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		this.doPost(request, response);
	}
	/**
	 * The doPost method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to
	 * post.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String method = request.getParameter("ac") == null ? ""
				: (String) request.getParameter("ac");
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String pid = request.getParameter("pid");
		if (method != null) {
			if(method.equals("exportApplicantData")){
				try {
					exportApplicantData(request, response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}	
			else if(method.equals("exportOpenBiddingData")){
				try {
					exportOpenBiddingData(request, response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			else if(method.equals("syncBuilding3GroupUnitTree")){
				try {
					syncBuilding3GroupUnitTree(request, response);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			else if(method.equals("getUnselectTbUnit")){
				try {
					getUnselectTbUnit(request, response);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			else if(method.equals("getJiaJieReportIndex")){
				try {
					getJiaJieReportIndex(request, response);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}			
			else if(method.equals("listBidCompQuery")){
					listBidCompQuery(request, response);
			}
			else if(method.equals("getTbUnitPrice")){
				getTbUnitPrice(request, response);
			}
			else if (method.equals("getJsonStrForTransToZLSByType")) {
				String fileId = request.getParameter("fileId").toString();
				String fileTypes = "FAPDocument,FAPAttach,PCBidApplyReport,PCBidNoticeOther,PCBidOpenBidOther,PCBidAssessReport," +
						"PCBidPreVeryfy,PCBidApplicantOther,PCBidFile,PCBidFile,PCBidClarifyContent,PCBidIssueWinNotice," +
						"PCBidNotice,PCBidProgress,PcBidSendZbdoc,PcBidZbAgency,PCBidAgency,PCBidAgencyOther,PCBidAgencyContract,PcBidProgress";
				String yjrName = request.getParameter("yjrName").toString();
				String type = request.getParameter("type")==null?"":request.getParameter("type").toString();
				String jsonStr = this.pcBidService.getJsonStrForTransToZLSByType(type,fileId, fileTypes, yjrName);
				super.outputStr(response, jsonStr);
			}
			else if(method.equals("importExcelData")){
		    	try {
					doActionExcelInput(request,response);
				} catch (FileUploadException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		    }
		}
		
		
		
		
	}

	/**
	 * 导出招标单位预审信息
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportApplicantData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{	
		String content_uids = request.getParameter("content_uids")==null ? "" : request.getParameter("content_uids");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		InputStream templateIn = this.pcBidService.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("contentUids", content_uids);
			map1.put("businessType", businessType);
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();		
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + businessType + "_" + content_uids + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());	
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}	
	/**
	 * 导出招标开标信息
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportOpenBiddingData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{	
		String content_uids = request.getParameter("content_uids")==null ? "" : request.getParameter("content_uids");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		InputStream templateIn = this.pcBidService.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("contentUids", content_uids);
			map1.put("businessType", businessType);
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();		
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + businessType + "_" + content_uids + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());	
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}	
	@SuppressWarnings("unchecked")
	private void syncBuilding3GroupUnitTree(HttpServletRequest request,
			HttpServletResponse response)  throws IOException {
		Map paramsmap = new HashMap();
		Enumeration  enumer = request.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = enumer.nextElement().toString();
			paramsmap.put(key,request.getParameter(key));
		}
		String unitid=request.getParameter("unitid");
		String upunit=request.getParameter("upunit");
		String hascheck=request.getParameter("hascheck");
		String USERBELONGUNITTYPEID=request.getParameter("USERBELONGUNITTYPEID");
		paramsmap.put("DefaultOrgRootID", Constant.DefaultOrgRootID);
		paramsmap.put(Constant.UNITTYPE, request.getSession().getAttribute(Constant.UNITTYPE));
		paramsmap.put(Constant.USERID, request.getSession().getAttribute(Constant.USERID));
		paramsmap.put(Constant.USERUNITID, upunit);
		paramsmap.put(Constant.USERDEPTID, request.getSession().getAttribute(Constant.USERDEPTID));
		paramsmap.put(Constant.USERPOSID, request.getSession().getAttribute(Constant.USERPOSID));
		paramsmap.put("unitid", unitid);
		paramsmap.put("upunit", upunit);
		paramsmap.put("hascheck", hascheck);
		String jsonStr=this.pcBidService.syncBuilding3GroupUnitTree(paramsmap);
		outputString(response,jsonStr );
	}
	/* 【发售招标文件】、【接收投标文件及投标保证金】、【开标】、
	 * 【评标及评标结果公示】、【发放中标通知书】
	 * 选择预审结果里面的单位
	 * 招投标模块选择预审结果单位
	 * */
	private void getUnselectTbUnit(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;		
		String bidContentId=request.getParameter("bidContentId")==null?"":request.getParameter("bidContentId");
		String orderby=request.getParameter("orderby")==null?"":request.getParameter("orderby");
		String tbUnitType=request.getParameter("tbUnitType")==null?"":request.getParameter("tbUnitType");
		List<PcBidTbUnitInfo> pcBidTbUnitInfo = this.pcBidService
		.getUnselectTbUnit(tbUnitType, bidContentId, orderby, start,
				limit);	
		String jsonStr = makeJsonDataForGrid(pcBidTbUnitInfo);	
		super.outputStr(response, jsonStr);
	
		
	}
	/**
	 * 嘉节首页查询七大报表【嘉节】
	 * @param pid		项目单位ID
	 * @return list
	 * @author: shangtw
	 * @createDate: 2012-7-10
	 */
	private void getJiaJieReportIndex(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String pid = request.getParameter("pid");
		List<VPcJiaJieReportIndex> vPcJiaJieReportIndex = this.pcBidService
		.getJiaJieReportIndex(pid);	
		String jsonStr = makeJsonDataForGrid(vPcJiaJieReportIndex);	
		super.outputStr(response, jsonStr);	
	}	
	/**
	 * 招投标汇总查询
	 * @author: shangtw
	 * @createDate: 2012-9-6
	 */
	private void listBidCompQuery(HttpServletRequest request,
			HttpServletResponse response) {
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String pid = request.getParameter("pid") ==null  ? " 1=1 " :request.getParameter("pid").toString();		
		String zbType = request.getParameter("zbType") ==null ? "" :request.getParameter("zbType");	
		String isBid = request.getParameter("isBid") == null ? "" : request.getParameter("isBid");
		String bidcontent = request.getParameter("bidcontent") == null ? "" : request.getParameter("bidcontent");
		String bidstarttime = request.getParameter("bidstarttime") == null ? "" : request.getParameter("bidstarttime");
		String tbunit1 = request.getParameter("tbunit") == null ? "" : request.getParameter("tbunit");
		String bidway = request.getParameter("bidway") == null ? "" : request.getParameter("bidway");
		String sql = "";
		String bw = "";
		if((!"".equals(bidway))&&bidway!=null){
			sql = "select t.property_code from PROPERTY_CODE t where t.property_name = '"+bidway+"'";
			List<Map<String, Object>> wayList = JdbcUtil.query(sql);
			for(Map<String, Object> wayMap:wayList){
				bw = wayMap.get("property_code").toString();
			}
		}
		Session s = null;
		List l = null;	
		int size = 0;
		List returnList = new ArrayList();	
		String sql1="select pbc.uids,pbc.contentes,pbz.zb_type,pbz.uids as zbuids," +
				" round((v.conmoney)/10000) conmoney, round((v.conpay)/10000) conpay, v.conid, v.conno, v.conname, " +
				"pbc.bdg_money bdg_money from " +
				" pc_bid_zb_content pbc,pc_bid_zb_apply pbz,V_CON V, pc_bid_issue_win_doc pw,pc_bid_tb_unit_info pu," +
				" pc_bid_progress pp " +
				" where pbc.pid='"+pid+"' " +
					"and pbz.pid='"+pid+"' " +
					"and pbc.zb_uids=pbz.uids " +
					"and pw.pid = '"+pid+"' " +
					"and pu.pid='"+pid+"' " +
					"and pp.pid='"+pid+"' " +
					"and pw.content_uids = pbc.uids " +
					"and pu.uids = pw.tb_unit " +
					"and pu.content_uids = pbc.uids "+
					"and pp.content_uids = pbc.uids " +
					"and pp.progress_type='BidAssess' "+
					//"and pp.progress_type='OpenBidding' "+
					" AND V.BIDTYPE(+)= PBC.UIDS " ;
				//" order by pbz.zb_type";//查询招标类型招标内容
		if((!"".equals(zbType))&&zbType!=null){
//			sql1 ="select pbc.uids,pbc.contentes,pbz.zb_type,pbz.uids as zbuids, " +
//				" round((v.conmoney)/10000) conmoney, round((v.conpay)/10000) conpay, v.conid, v.conno, v.conname from " +
//				" pc_bid_zb_content pbc,pc_bid_zb_apply pbz,V_CON V " +
//				" where pbc.pid='"+pid+"' and pbz.pid='"+pid+"' and pbc.zb_uids=pbz.uids and pbz.zb_type='"+zbType+"' " +
//				" AND V.BIDTYPE(+) = PBC.UIDS " +
//				" order by pbz.zb_type";//查询招标类型招标内容
			sql1 += " and pbz.zb_type='"+zbType+"'";
		}
		if((!"".equals(isBid)) && isBid !=null){
			sql1 +=" and V.IS_BID = '"+isBid+"'";
		}
		if((!"".equals(tbunit1))&&tbunit1!=null){
			sql1 +=" and pu.tb_unit like '%"+tbunit1+"%'";
		}
		if((!"".equals(bidstarttime))&&bidstarttime!=null){
			sql1 +=" and pp.start_date=TO_DATE('"+bidstarttime+"','yyyy-mm-dd')";
		}
		if((!"".equals(bidcontent))&&bidcontent !=null){
			sql1 +=" and pbc.contentes like '%"+bidcontent+"%'";
		}
		if((!"".equals(bw))&&bw !=null){
			sql1 +=" and pp.pb_ways = '"+bw+"'";
		}
		System.out.println(">>>>>>>>>>>>>>>sql1="+sql1);
		String sql0 = "select * " +
				"from (select t.*, rownum rn " +
					"from ("+sql1+") t " +
						"where rownum <= "+(start+limit)+") " +
				"where rn > "+start+"";
		List<Map<String, Object>> resultList0 = JdbcUtil.query(sql1);
		List<Map<String, Object>> resultList1 = JdbcUtil.query(sql0);
		size=resultList0.size();
		for (Map<String, Object> map : resultList1) {	
			PcBidCompQuery pcBidCompQuery=new PcBidCompQuery();
			pcBidCompQuery.setZbuids(map.get("zbuids").toString());
			pcBidCompQuery.setUids(map.get("uids").toString());
			pcBidCompQuery.setBidtype(map.get("zb_type").toString());
			pcBidCompQuery.setBidcontent(map.get("contentes").toString());
			//合同名称
			if(null==map.get("conname")){
				pcBidCompQuery.setConname("");
			}else{
				pcBidCompQuery.setConname(map.get("conname").toString());
			}			
			//合同付款金额
			if(null==map.get("conpay")){
				pcBidCompQuery.setConpay(0d);
			}else{
				pcBidCompQuery.setConpay(Double.valueOf(map.get("conpay").toString()));
			}
			//概算金额
			if(null == map.get("bdg_money")){
				pcBidCompQuery.setBdgMoney(0d);
			}else{
				pcBidCompQuery.setBdgMoney(Double.valueOf(map.get("bdg_money").toString()));
			}
			String sql2="select start_date from pc_bid_progress where content_uids='"+map.get("uids").toString()+"' and progress_type='OpenBidding' and pid='"+pid+"'";
			List<Map<String, Object>> resultList2 = JdbcUtil.query(sql2);
			for (Map<String, Object> map2 : resultList2) {	
				pcBidCompQuery.setBidstarttime((Date) map2.get("start_date"));
			}
			int length=0;
			if(null!=pcBidTbUnitService.getAllUnits(map.get("uids").toString())){
				length=	pcBidTbUnitService.getAllUnits(map.get("uids").toString()).size();
			}
			pcBidCompQuery.setTbuids(String.valueOf(length));
			String sql3=" select tb_unit,tb_price from pc_bid_issue_win_doc where pid='"+pid+"' and content_uids='"+map.get("uids").toString()+"'";
			List<Map<String, Object>> resultList3 = JdbcUtil.query(sql3);
			String tbunit="";
			Double bidprice=0.0;
			for (Map<String, Object> map3 : resultList3) {	
				if(map3.get("tb_unit")!=null){
					String sqlunit="select tb_unit from pc_bid_tb_unit_info where uids='"+map3.get("tb_unit").toString()+"' and pid='"+pid+"' and content_uids='"+map.get("uids").toString()+"'";
					List<Map<String, Object>> resultListunit= JdbcUtil.query(sqlunit);	
					for (Map<String, Object> mapunit : resultListunit) {	
						tbunit+=mapunit.get("tb_unit").toString()+",";
					}					
				}
				if(map3.get("tb_price")!=null){
					bidprice+=Double.valueOf(map3.get("tb_price").toString());
				}
				
			}	
			if(tbunit!=""){
				tbunit=tbunit.substring(0, tbunit.length()-1);
			}
			pcBidCompQuery.setTbunit(tbunit);
			pcBidCompQuery.setBidprice(bidprice);
			String sql4="select round(sum(conmoney)/10000) as conmoney,count(conid) as conidcount from v_con where pid='"+pid+"' and bidtype='"+map.get("uids").toString()+"'";
			//System.out.println("sql4:"+sql4);
			List<Map<String, Object>> resultList4 = JdbcUtil.query(sql4);
			for (Map<String, Object> map4 : resultList4) {	
				Object o=map4.get("conmoney");
				Double money=null;
				if(o!=null){
					String conM=o.toString();
					money=Double.valueOf(conM);
				}
				pcBidCompQuery.setConprice(money);
			}			
			pcBidCompQuery.setBidfj(map.get("uids").toString());
			pcBidCompQuery.setBidassess(map.get("uids").toString());
			
			String sql5="select pb_ways from pc_bid_progress where progress_type='BidAssess' and content_uids='"+map.get("uids").toString()+"'";
			List<Map<String, Object>> resultList5 = JdbcUtil.query(sql5);
			for (Map<String, Object> map5 : resultList5) {
				if(map5.get("pb_ways")!=null)
				pcBidCompQuery.setBidway(map5.get("pb_ways").toString());
			}
			
			returnList.add(pcBidCompQuery);
		}
		returnList.add(size);
	    String jsonStr = makeJsonDataForGrid(returnList);	
		try {
			outputStr(response, jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}		
	}
	/**
	 * 招投标投标单位及报价总查询
	 * @author: shangtw
	 * @createDate: 2012-9-6
	 */	
	private void getTbUnitPrice(HttpServletRequest request,
			HttpServletResponse response) {
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;		
		String bidContentId=request.getParameter("bidContentId")==null?"":request.getParameter("bidContentId");
		String orderby=request.getParameter("orderby")==null?"":request.getParameter("orderby");	
		String pid=request.getParameter("pid")==null?"":request.getParameter("pid");
		List<PcBidTbUnitInfo>returnList=new ArrayList<PcBidTbUnitInfo>();
		List<PcBidTbUnitInfo>PcBidTbUnitInfoList =pcBidTbUnitService.getAllUnits(bidContentId);	
		List<PcBidOpenBidding>pcBidOpenBiddingList=pcBidService.getVeryfiedUnits(bidContentId, pid);
		for(int i=0;i<PcBidTbUnitInfoList.size();i++){
			PcBidTbUnitInfo pcBidTbUnitInfo=PcBidTbUnitInfoList.get(i);
			pcBidTbUnitInfo.setPrice(0.0);
			returnList.add(pcBidTbUnitInfo);
		}
		for(int i=0;i<returnList.size();i++){
			PcBidTbUnitInfo pcBidTbUnitInfo=returnList.get(i);
		for(int j=0;j<pcBidOpenBiddingList.size();j++){
			PcBidOpenBidding pcBidOpenBidding=pcBidOpenBiddingList.get(j);
			if((pcBidTbUnitInfo.getUids()).equals(pcBidOpenBidding.getTbUnit())){
				pcBidTbUnitInfo.setPrice(pcBidOpenBidding.getOffer());
			}
		}
	}
		String jsonStr = makeJsonDataForGrid(returnList);	
		try {
			super.outputStr(response, jsonStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}	
	
	/**
	 * 
	* @Title: doActionExcelInput
	* @Description: 投标单位预审信息数据导入
	* @param request
	* @param response
	* @throws IOException
	* @throws FileUploadException   
	* @return void    
	* @throws
	* @author qiupy 2014-7-3
	 */
	private void doActionExcelInput(HttpServletRequest request,
			HttpServletResponse response) throws IOException, FileUploadException {
	    String pid =   request.getParameter("pid");
	    String masterId = request.getParameter("masterId");
	    response.setCharacterEncoding("utf-8");           
	    response.setContentType("text/html; charset=utf-8"); 
	    PrintWriter out = response.getWriter();
        String upLoad =  Constant.AppRootDir.concat(java.io.File.separator).concat(Constant.TEMPFOLDER);;
        DiskFileItemFactory factory = new DiskFileItemFactory();
        // 缓冲区大小
        factory.setSizeThreshold(4096);  
       // 临时文件目录
        File tempFolder = new File(upLoad);
        if (!tempFolder.exists()){
        	tempFolder.createNewFile();
		}
       factory.setRepository(tempFolder);
       ServletFileUpload  upload = new ServletFileUpload(factory);
       upload.setHeaderEncoding(Constant.ENCODING);
       List<FileItem> fileItemList = upload.parseRequest(request);
       String message = "";
       Map<String,String> map=new HashMap<String, String>();
       map.put("pid", pid);
       map.put("masterId", masterId);
       if(fileItemList.size()>0){
    	   for(FileItem fileItem : fileItemList){
    		   if(!fileItem.isFormField()){
    			   message = this.pcBidService.importData(map,fileItem);
    			   }}
    		   }
		out.print(message);
		out.flush();
		out.close();
	}
}	
