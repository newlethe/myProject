package com.sgepit.pmis.rzgl.control;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.dhtmlx.connector.DataAction;
import com.dhtmlx.connector.DataItem;
import com.dhtmlx.connector.FormConnector;
import com.dhtmlx.connector.GridConnector;
import com.dhtmlx.connector.SortingRule;
import com.dhtmlx.connector.TreeConnector;
import com.dhtmlx.connector.TreeGridConnector;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.util.ConnectionMan;
import com.sgepit.frame.util.DhxCustomerBehavior;
import com.sgepit.frame.util.DhxUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.UUIDGenerator;
import com.sgepit.pmis.rzgl.RzglConstant;
import com.sgepit.pmis.rzgl.RzglConstant.DFormat;
import com.sgepit.pmis.rzgl.hbm.RzglFlQxUnit;
import com.sgepit.pmis.rzgl.hbm.RzglFlTree;
import com.sgepit.pmis.rzgl.service.RzglService;
/**
 * 日志管理-分类树
 * @author zhengw
 * @version V1.0
 * @since 2014-2-17
*/

public class RzglServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final Log log = LogFactory
			.getLog(RzglServlet.class);
	
	private WebApplicationContext wac;
	/*日志管理service*/
	private RzglService rzglService;
	private BaseDAO baseDao;
	
	public RzglServlet() {
		super();
	}
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		doPost(req, res);
	}
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		String method = req.getParameter("ac");
		//将附件类型放到req里
		req.setAttribute("rzgl_rz_fj", RzglConstant.RZGL_RZ_FJ);
		req.setAttribute("rzgl_pl_fj", RzglConstant.RZGL_PL_FJ);
		if (method != null && !"".equals(method)) {
			if (method.equals("LoadFlTreeGrid")) {
				LoadFlTreeGrid(req,res);
			}else if (method.equals("loadFlForm")) {
				loadFlForm(req,res);
			}else if (method.equals("loadFlQxUnit")) {
				loadFlQxUnit(req,res);
			}else if (method.equals("rzglFlTreeLoad")) {
				rzglFlTreeLoad(req,res);
			}else if (method.equals("RzglLoadRzGrid")) {
				rzglLoadRzGrid(req,res);
			}else if (method.equals("rzglLoarRzForm")) {
				rzglLoarRzForm(req,res);
			}else if (method.equals("rzglLoadPlGrid")) {
				rzglLoadPlGrid(req,res);
			}else if (method.equals("rzglLoadPlForm")) {
				rzglLoadPlForm(req,res);
			}
			
		}
	}
	
	
	
	/*
	 * 根据beansName取service等
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.rzglService = (RzglService) this.wac
				.getBean("rzglService");
		this.baseDao = (BaseDAO)this.wac.getBean("baseDAO");
	}
	
	class FlTreeGridCustom extends DhxCustomerBehavior{

		@Override
		public void beforeDelete(DataAction action) {
			//校验节点下是否有日志，是否叶子节点已经在前台js校验
			String uids = action.get_value("uids");
			if (uids == null || "".equals(uids) ) {
				action.set_response_text("选择的节点已经不存在，请刷新重试");
				action.error();
			}else {
				String sql = "select * from rzgl_rz z where z.fl_uids='"+uids+"'";
				List<Map<String, Object>> list = JdbcUtil.query(sql);
				if (list == null || list.size() == 0) {
					rzglService.deleteById(uids);
					action.success();
				}else {
					action.set_response_text("选择的分类下面有日志，不允许删除。");
					action.error();
				}
			}
		}

		@Override
		public void beforeInsert(DataAction action) {
			//分类下有日志不允许新增子分类，避免日志变为父节点的记录
			String uids = action.get_value("uids");
			String sql = "select * from rzgl_rz z where z.fl_uids='"+uids+"'";
			List<Map<String, Object>> list = JdbcUtil.query(sql);
			if (list == null || list.size() == 0) {
				
			}else {
				action.set_response_text("选择的分类下面有日志，不允许新增分类。");
				action.error();
			}
		}
		
		
	}
	/**
	 * 日志分类TreeGrid加载
	 * @param req
	 * @param res
	 */
	public void LoadFlTreeGrid(HttpServletRequest req, HttpServletResponse res) {
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			String sql = "select * from rzgl_fl_tree";
			TreeGridConnector tg = new TreeGridConnector(conn, req, res);
			tg.event.attach(new FlTreeGridCustom());
			if(tg.is_select_mode()){
				tg.render_sql(sql, "uids", "uids,fl_name,fl_code,order_num","","parrent_uids");
			}else {
				tg.render_table("rzgl_fl_tree", "uids", "uids,-,-,-");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	class FlFormCustom extends DhxCustomerBehavior{

		@Override
		public void beforeUpdate(DataAction action) {
			String uids = action.get_value("uids");
			String up_uids = action.get_value("up_uids");
			String up_code = action.get_value("up_code");
			String up_name = action.get_value("up_name");
			String curr_code = action.get_value("curr_code");
			String curr_name = action.get_value("curr_name");
			String create_dept = action.get_value("create_dept");
			String create_user = action.get_value("create_user");
			//这里不管是新增，还是编辑，都有两个对象要保持，上级节点，与当前节点
			//上级节点
			RzglFlTree up_fl = null;
			RzglFlTree curr_fl = null;
			if (up_uids == null || "".equals(up_uids)) {//upuids为空说明是执行的新增
				//这里为了防止多次点保存，编码重复,再次点击为编辑
				String sql = "select * from rzgl_fl_tree f where f.fl_code = '"+curr_code+"'";
				List<Map<String, Object>> list = JdbcUtil.query(sql);
				if (list != null && list.size() > 0) {
					up_fl = rzglService.findById(uids);
					up_fl.setFlName(up_name);
					curr_fl = rzglService.findById(list.get(0).get("uids").toString());
					curr_fl.setFlName(curr_name);
				}else {
					up_fl = rzglService.findById(uids);
					up_fl.setFlName(up_name);
					curr_fl = new RzglFlTree();
					//curr_fl.setUids(UUIDGenerator.UUID());
					curr_fl.setFlCode(curr_code);
					curr_fl.setFlName(curr_name);
					curr_fl.setCreateDate(new Date());
					curr_fl.setParrentUids(uids);
					curr_fl.setOrderNum(new BigDecimal("1"));
					if (create_dept != null && !"".equals(create_dept)) {
						curr_fl.setCreateDept(create_dept);
					}
					curr_fl.setCreateUser(create_user);
				}
			}else {
				up_fl = rzglService.findById(up_uids);
				up_fl.setFlName(up_name);
				curr_fl = rzglService.findById(uids);
				curr_fl.setFlName(curr_name);
			}
			List<RzglFlTree> entityList = new ArrayList<RzglFlTree>();
			entityList.add(up_fl);
			entityList.add(curr_fl);
			rzglService.saveAll(entityList);
			action.success();
		}

		@Override
		public void beforeRender(DataItem data) {
			String up_code = data.get_value("up_code");
			String curr_code = data.get_value("curr_code");
			if (curr_code == null || "".equals(curr_code)) {//当前节点编码查询为空则是新增
				//如果是新增节点，则需要跟当前节点生成编码
				curr_code = rzglService.getNewFlNo(up_code, "fl_code", "rzgl_fl_tree", null);
				data.set_value("curr_code", curr_code);
			}
			
		}
		
		
	}
	/**
	 * 分类form加载
	 * @param req
	 * @param res
	 */
	public void loadFlForm(HttpServletRequest req, HttpServletResponse res) {
		String selectId = req.getParameter("selectId");
		String buttonId = req.getParameter("buttonId");
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			String sql = "";
			if (buttonId != null && !"".equals(buttonId)) {
				if ("edit".equals(buttonId)) {
					sql = "select f.parrent_uids as up_uids,f.uids as uids,(select ff.fl_code from rzgl_fl_tree ff "
							+" where ff.uids=f.parrent_uids ) as up_code,(select ff.fl_name from rzgl_fl_tree ff "
							+" where ff.uids=f.parrent_uids ) as up_name,f.fl_name as curr_name,f.fl_code as curr_code "
							+" from rzgl_fl_tree f where f.uids='"+selectId+"'";
				}else if ("add".equals(buttonId)) {
					sql = "select f.uids as uids,'' as up_uids,f.fl_name as up_name,f.fl_code as up_code,'' as curr_code,"
							+"'' as curr_name from rzgl_fl_tree f where f.uids = '"+selectId+"'";
				}
			}
			FormConnector fc = new FormConnector(conn, req, res);
			fc.event.attach(new FlFormCustom());
			if (fc.is_select_mode()) {
				fc.render_sql(sql, "uids", "uids,up_uids,up_code,up_name,curr_name,curr_code");
			}else {
				fc.render_table("rzgl_fl_tree", "uids", "uids,up_uids,up_code,up_name,curr_name,curr_code,create_user,create_dept");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	class QxTreeGridCustom extends DhxCustomerBehavior{
		private String flId;
		
		public QxTreeGridCustom() {
			super();
		}

		public QxTreeGridCustom(String flId) {
			super();
			this.flId = flId;
		}

		@Override
		public void beforeSort(ArrayList<SortingRule> sorters) {
			SortingRule sr1 = new SortingRule("unitid", "asc");
			sorters.add(sr1);
		}

		@Override
		public void beforeRender(DataItem data) {
			String dept = data.get_value("unitid");
			String sql = "";
			if (flId != null && !"".equals(flId)) {
				sql = "select * from rzgl_fl_qx_unit q where q.qx_fl='"+flId+"' and q.qx_dept='"+dept+"'";
				List<Map<String, Object>> qList = JdbcUtil.query(sql);
				if (qList != null && qList.size() > 0) {
					data.set_value("qx", "1");
				}
			}
		}

		@Override
		public void beforeUpdate(DataAction action) {
			String selectDept = action.get_value("unitid");
			String czqx = action.get_value("qx");
			flId = action.get_value("selectFl");
			String sonFlSql = "SELECT * FROM rzgl_fl_tree f START WITH f.uids = '"+flId+"' CONNECT BY f.parrent_uids = PRIOR f.uids";
			String upItemSql = "SELECT * FROM sgcc_ini_unit u START WITH u.unitid = '"+selectDept+"' CONNECT BY PRIOR u.upunit = u.unitid";
			String sonItemSql = "SELECT * FROM sgcc_ini_unit u START WITH u.unitid = '"+selectDept+"' CONNECT BY u.upunit = PRIOR u.unitid";
			List<RzglFlQxUnit> addQxList = new ArrayList<RzglFlQxUnit>();
			//判断权限跟新类型，1赋权，0取消权限
			if ("1".equals(czqx)) {
				String sql = upItemSql+" union "+sonItemSql;
				List<Map<String, Object>> flList = JdbcUtil.query(sonFlSql);
				List<Map<String, Object>> itemList = JdbcUtil.query(sql);
				if (itemList != null && itemList.size() > 0 && flList != null && flList.size() > 0) {
					for (int i = 0; i < flList.size(); i++) {
						String f_id = flList.get(i).get("uids").toString();
						for (int j = 0; j < itemList.size(); j++) {
							String unitId = itemList.get(j).get("unitid").toString();
							//查询权限关系表，如果已经存在了就不重复存
							RzglFlQxUnit qx = rzglService.findQxByFlAndDept(f_id, unitId);
							if (qx != null) {
								System.out.println("sssss");
							}else {
								qx = new RzglFlQxUnit();
								qx.setQxFl(f_id);
								qx.setQxDept(unitId);
								qx.setCreateDate(new Date());
								//qx.setCreateUser("");
								addQxList.add(qx);
							}
						}
					}
				}else {
					action.set_response_text("分类或组织机构未选择。");
					action.error();
				}
				rzglService.saveAllQx(addQxList);
			}else {
				List<Map<String, Object>> itemList = JdbcUtil.query(sonItemSql);
				for (int i = 0; i < itemList.size(); i++) {
					RzglFlQxUnit qx = rzglService.findQxByFlAndDept(flId,itemList.get(i).get("unitid").toString());
					if (qx != null) {
						addQxList.add(qx);
					}
				}
				rzglService.deleteAllQx(addQxList);
			}
			action.success();
		}
		
	}
	/**
	 * 分类权限TreeGrid树加载
	 * @param req
	 * @param res
	 */
	public void loadFlQxUnit(HttpServletRequest req,HttpServletResponse res) {
		String flId = req.getParameter("flId");
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			String sql = "SELECT u.*, '0' as qx,'"+flId+"' as selectFl FROM sgcc_ini_unit u";
			TreeGridConnector tg = new TreeGridConnector(conn, req, res);
			tg.event.attach(new QxTreeGridCustom(flId));
			if (tg.is_select_mode()) {
				tg.render_sql(sql, "unitid", "unitid,unitname,qx,selectFl","","upunit");
			}else {
				tg.render_table("sgcc_ini_unit", "unitid", "uids,-,qx,selectFl");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	class FlTreeCustom extends DhxCustomerBehavior{

		@Override
		public void beforeRender(DataItem data) {
			data.set_userdata("fl_name", data.get_value("fl_name"));
		}
		
	}
	/**
	 * 分类树加载
	 * @param req
	 * @param res
	 */
	public void rzglFlTreeLoad(HttpServletRequest req, HttpServletResponse res) {
		String userId = req.getParameter("userId");
		String roletype = req.getParameter("roletype");
		String deptId = "";
		if (userId != null && !"".equals(userId)) {
			String userSql = "select u.dept_id from rock_user u where u.userid='"+userId+"'";
			List<Map<String, Object>> uList = JdbcUtil.query(userSql);
			if (uList != null && uList.size() > 0) {
				deptId = uList.get(0).get("dept_id").toString();
			}
		}
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			TreeConnector tc = new TreeConnector(conn, req, res);
			String sql = "";
			if (deptId != null && !"".equals(deptId)  ) {
				if ("1".equals(deptId)) {
					sql = "select * from rzgl_fl_tree f";
				}else {
					sql = "select * from (SELECT distinct (f.uids),  f.fl_name,f.fl_code,f.parrent_uids FROM rzgl_fl_tree f START WITH f.uids in ("
							+"select q.qx_fl from rzgl_fl_qx_unit q where q.qx_dept='"+deptId+"') CONNECT BY PRIOR f.parrent_uids = f.uids ) where 1=1 ";
				}
			}else {
				if (roletype != null && !"".equals(roletype)) {
					if ("0".equals(roletype)) {
						sql = "select * from rzgl_fl_tree f";
					}
				}
			}
			//DhxUtil.generateComboDataXml(dataList, displayField, valueField, selectIndex)
			tc.event.attach(new FlTreeCustom());
			if(tc.is_select_mode()){
				tc.render_sql(sql, "uids", "fl_name","","parrent_uids");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	class RzGridCustom extends DhxCustomerBehavior{

		@Override
		public void beforeSort(ArrayList<SortingRule> sorters) {
			SortingRule sr1 = new SortingRule("create_date", "DESC");
			sorters.add(sr1);
		}

		@Override
		public void beforeRender(DataItem data) {
			DhxUtil.transConnectorQueryDateTime(data, "create_date", DFormat.YMD.getFormat(),null, "create_date");
			String[] orderVar = {data.get_value("uids"),RzglConstant.RZGL_RZ_FJ,"0"};
			String orderFj = data.get_value("fj_str");
			String orderFj_linkValue = DhxUtil.renderLinkValue("附件["+orderFj+"]", "showFileWin",orderVar);
			data.set_value("fj_str", orderFj_linkValue);
		}

		@Override
		public void afterDelete(DataAction action) {
			String uids = action.get_value("uids");
			String deleteBlodSql = "delete sgcc_attach_blob b where b.file_lsh in (select l.file_lsh "
					+" from sgcc_attach_list l where l.transaction_id = '"+uids+"' and l.transaction_type = '"+RzglConstant.RZGL_RZ_FJ+"')";
			String deleteAttachSql = "delete sgcc_attach_list l where l.transaction_id='"+uids+"' and l.transaction_type='"+RzglConstant.RZGL_RZ_FJ+"'";
			JdbcUtil.execute(deleteBlodSql);
			JdbcUtil.execute(deleteAttachSql);
		}
		
		
	}
	/**
	 * 日志Grid加载
	 * @param req
	 * @param res
	 */
	public void rzglLoadRzGrid(HttpServletRequest req, HttpServletResponse res) {
		//这里接收参数，组织条件
		String jsonParm = req.getParameter("jsonParm");
		String userId = req.getParameter("userId");
		String roletype = req.getParameter("roletype");
		String whereSqlStr = "";
		if (!"{}".equals(jsonParm)) {
			whereSqlStr = this.getRzGridFiter(jsonParm,userId,roletype);
		}
		//这里根据参数拼接语句
		StringBuffer sbf = new StringBuffer();
		sbf.append("select z.*,(select count(*) from sgcc_attach_list l where l.transaction_id = z.uids and l.transaction_type = '"+RzglConstant.RZGL_RZ_FJ+"' ) as fj_str from rzgl_rz z where 1=1 ").append(whereSqlStr);
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gc = new GridConnector(conn, req, res);
			gc.event.attach(new RzGridCustom());
			gc.set_options("create_user", DhxUtil.getOptionsMap("userid","realname","rock_user"));
			if (gc.is_select_mode()) {
				gc.render_sql(sbf.toString(), "uids", "uids,create_date,work_content,create_user,fj_str");
			}else {
				gc.render_table("rzgl_rz", "uids", "uids,create_date,work_content,create_user,fj_str");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 处理json参数，拼接日志查询条件的方法
	 * @param jsonParm:json参数串
	 * @return
	 */
	public String getRzGridFiter(String jsonParm,String userId,String roletype) {
		String startDateStr = "";
		String endDateStr = "";
		String yg_xm = "";
		String fl = "";
		String userid = "";
		JSONObject param = null;
		if(jsonParm != null){
			param = JSONObject.fromObject(jsonParm);
		}
		if(param != null){
			Iterator<?> it = param.keys();
			while(it.hasNext()){
				String key = (String) it.next();
				String value = param.getString(key);
				if(key.equals("start")){
					startDateStr = value;
				}else if(key.equals("end")){
					endDateStr = value;
				}else if(key.equals("yg_xm")){
					yg_xm = value;
				}else if(key.equals("fl")){
					fl = value;
				}else if (key.equals("userid")) {
					userid = value;
				}
			}
		}
		StringBuffer sbf = new StringBuffer();
		if (!"".equals(startDateStr) && !"".equals(endDateStr)) {
			sbf.append(" and to_char(z.create_date,'yyyy-MM-dd') >= '").append(startDateStr).append("' ");
			sbf.append(" and to_char(z.create_date,'yyyy-MM-dd') <= '").append(endDateStr).append("' ");
		}
		if ("".equals(startDateStr) && !"".equals(endDateStr)) {
			sbf.append(" and to_char(z.create_date,'yyyy-MM-dd') <= '").append(endDateStr).append("' ");
		}
		if (!"".equals(startDateStr) && "".equals(endDateStr)) {
			sbf.append(" and to_char(z.create_date,'yyyy-MM-dd') >= '").append(startDateStr).append("' ");
		}
		if (yg_xm != null && !"".equals(yg_xm)) {
			sbf.append(" and z.create_user in (select u.userid from rock_user u where u.realname like '%");
			sbf.append(yg_xm).append("%') ");
		}
		if (userid != null && !"".equals(userid)) {
			sbf.append(" and z.create_user ='").append(userid).append("' ");
		}
		if (fl !=null && !"".equals(fl)) {
			//增加权限分类过滤
			String qxFlSql = null;
			if(userId != null && !"".equals(userId) && roletype != null && !"".equals(roletype)){
				qxFlSql = this.getRzglFlByQx(userId,roletype);
			}
			List<RzglFlTree> flList = rzglService.getSonFlByFl(fl,qxFlSql); 
			
			String fl_in = rzglService.getFlWhereInByFlList(flList);
			if (fl_in != null) {
				sbf.append(" and z.fl_uids in (");
				sbf.append(fl_in);
				sbf.append(")");
			}
		}
		return sbf.toString();
	}
	class RzFormCustom extends DhxCustomerBehavior{

		@Override
		public void beforeInsert(DataAction action) {
			action.set_value("uids", UUIDGenerator.UUID());
			action.set_id(action.get_value("uids"));
			DhxUtil.transConnectorModifyDateTime(action, "create_date", DFormat.ORACLE_YMD_HMS.getFormat());
			action.set_value("fj_str", RzglConstant.RZGL_RZ_FJ);
		}
		
		@Override
		public void beforeRender(DataItem data) {
			DhxUtil.transConnectorQueryDateTime(data, "create_date", DFormat.YMD.getFormat(),null, "create_date");
		}

		@Override
		public void beforeUpdate(DataAction action) {
			action.set_id(action.get_value("uids"));
			DhxUtil.transConnectorModifyDateTime(action, "create_date", DFormat.ORACLE_YMD_HMS.getFormat());
			action.set_value("fj_str", RzglConstant.RZGL_RZ_FJ);
		}
		
	}
	/**
	 * 日志form加载
	 * @param req
	 * @param res
	 */
	public void rzglLoarRzForm(HttpServletRequest req, HttpServletResponse res) {
		Connection conn = null;
		String uids = req.getParameter("uids");
		try {
			conn = ConnectionMan.getConnection();
			String sql = "select z.*,(select u.realname from rock_user u where u.userid = z.create_user) as create_user_name,"
					+" (select t.fl_name from rzgl_fl_tree t where t.uids = z.fl_uids) as fl_uids_name from rzgl_rz z ";
			if (uids != null && !"".equals(uids)) {
				sql += " where z.uids='"+uids+"'";
			}
			FormConnector fc = new FormConnector(conn, req, res);
			fc.event.attach(new RzFormCustom());
			if (fc.is_select_mode()) {
				fc.render_sql(sql, "uids", "uids,fl_uids,fl_uids_name,create_date,create_user,create_user_name,work_content,fj_str");
			}else {
				fc.render_table("rzgl_rz", "uids", "uids,fl_uids,-,create_date,create_user,-,work_content,fj_str");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	class RzPlGridCustom extends DhxCustomerBehavior{

		@Override
		public void beforeSort(ArrayList<SortingRule> sorters) {
			SortingRule sr1 = new SortingRule("create_date", "DESC");
			sorters.add(sr1);
		}

		@Override
		public void beforeRender(DataItem data) {
			DhxUtil.transConnectorQueryDateTime(data, "create_date", DFormat.YMD.getFormat(),null, "create_date");
			String[] orderVar = {data.get_value("uids"),RzglConstant.RZGL_PL_FJ,"0"};
			String orderFj = data.get_value("fj_str");
			String orderFj_linkValue = DhxUtil.renderLinkValue("附件["+orderFj+"]", "showFileWin",orderVar);
			data.set_value("fj_str", orderFj_linkValue);
		}


		@Override
		public void afterDelete(DataAction action) {
			String uids = action.get_value("uids");
			String deleteBlodSql = "delete sgcc_attach_blob b where b.file_lsh in (select l.file_lsh "
					+" from sgcc_attach_list l where l.transaction_id = '"+uids+"' and l.transaction_type = '"+RzglConstant.RZGL_PL_FJ+"')";
			String deleteAttachSql = "delete sgcc_attach_list l where l.transaction_id='"+uids+"' and l.transaction_type='"+RzglConstant.RZGL_PL_FJ+"'";
			JdbcUtil.execute(deleteBlodSql);
			JdbcUtil.execute(deleteAttachSql);
		}
		
	}
	/**
	 * 评论grid加载
	 * @param req
	 * @param res
	 */
	public void rzglLoadPlGrid(HttpServletRequest req, HttpServletResponse res) {
		String rzUids = req.getParameter("rzUids");
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			StringBuffer sbf = new StringBuffer();
			sbf.append("select z.*,(select count(*) from sgcc_attach_list l where l.transaction_id = z.uids and l.transaction_type = '"+RzglConstant.RZGL_PL_FJ+"' ) as fj_str from rzgl_rz_pl z where z.rz_uids='"+rzUids+"'");
			GridConnector gc = new GridConnector(conn, req, res);
			gc.event.attach(new RzPlGridCustom());
			gc.set_options("create_user", DhxUtil.getOptionsMap("userid","realname","rock_user"));
			if (gc.is_select_mode()) {
				gc.render_sql(sbf.toString(), "uids", "uids,'',create_date,pl_content,create_user,fj_str,rz_uids");
			}else {
				gc.render_table("rzgl_rz_pl", "uids", "uids,-,create_date,pl_content,create_user,-,-");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	
	class PlFormCustom extends DhxCustomerBehavior{

		@Override
		public void beforeRender(DataItem data) {
			DhxUtil.transConnectorQueryDateTime(data, "create_date", DFormat.YMD.getFormat(),null, "create_date");
		}

		@Override
		public void beforeInsert(DataAction action) {
			action.set_value("uids", UUIDGenerator.UUID());
			action.set_id(action.get_value("uids"));
			DhxUtil.transConnectorModifyDateTime(action, "create_date", DFormat.ORACLE_YMD_HMS.getFormat());
			action.set_value("fj_str", RzglConstant.RZGL_PL_FJ);
		}

		@Override
		public void beforeUpdate(DataAction action) {
			action.set_id(action.get_value("uids"));
			DhxUtil.transConnectorModifyDateTime(action, "create_date", DFormat.ORACLE_YMD_HMS.getFormat());
			action.set_value("fj_str", RzglConstant.RZGL_PL_FJ);
		}
		
	}
	/**
	 * 评论form加载
	 * @param req
	 * @param res
	 */
	public void rzglLoadPlForm(HttpServletRequest req, HttpServletResponse res) {
		String uids = req.getParameter("uids");
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			String sql = "select z.*,(select u.realname from rock_user u where u.userid = z.create_user) as create_user_name from rzgl_rz_pl z ";
			if (uids != null && !"".equals(uids)) {
				sql += " where z.uids='"+uids+"'";
			}
			FormConnector fc = new FormConnector(conn, req, res);
			fc.event.attach(new PlFormCustom());
			if (fc.is_select_mode()) {
				fc.render_sql(sql, "uids", "uids,rz_uids,create_date,create_user,create_user_name,fj_str,pl_content");
			}else {
				fc.render_table("rzgl_rz_pl", "uids", "uids,rz_uids,create_date,create_user,-,fj_str,pl_content");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 得到权限过滤分类的Sql语句
	 * @param userId：用户uids
	 * @param roletype：角色权限type
	 * @return：分类节点过滤出来的sql
	 */
	public String getRzglFlByQx(String userId,String roletype) {
		String deptId = "";
		if (userId != null && !"".equals(userId)) {
			String userSql = "select u.dept_id from rock_user u where u.userid='"+userId+"'";
			List<Map<String, Object>> uList = JdbcUtil.query(userSql);
			if (uList != null && uList.size() > 0) {
				deptId = uList.get(0).get("dept_id").toString();
			}
		}
		String sql = "";
		if (deptId != null && !"".equals(deptId)  ) {
			if ("1".equals(deptId)) {
				sql = "select uids from rzgl_fl_tree f";
			}else {
				sql = "select uids from (SELECT distinct (f.uids),  f.fl_name,f.fl_code,f.parrent_uids FROM rzgl_fl_tree f START WITH f.uids in ("
						+"select q.qx_fl from rzgl_fl_qx_unit q where q.qx_dept='"+deptId+"') CONNECT BY PRIOR f.parrent_uids = f.uids ) where 1=1 ";
			}
		}else {
			if (roletype != null && !"".equals(roletype)) {
				if ("0".equals(roletype)) {
					sql = "select uids from rzgl_fl_tree f";
				}
			}
		}
		return sql;
	}
}
