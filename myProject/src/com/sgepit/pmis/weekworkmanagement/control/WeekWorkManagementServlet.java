/**
 * 
 */
package com.sgepit.pmis.weekworkmanagement.control;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.dhtmlx.connector.ComboConnector;
import com.dhtmlx.connector.ConnectorBehavior;
import com.dhtmlx.connector.DataAction;
import com.dhtmlx.connector.FormConnector;
import com.dhtmlx.connector.GridConnector;
import com.dhtmlx.connector.SortingRule;
import com.dhtmlx.connector.TreeGridConnector;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.util.ConnectionMan;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.weekworkmanagement.hbm.WeekworkManagementM;
import com.sgepit.pmis.weekworkmanagement.hbm.WeekworkProfessionPower;
import com.sgepit.pmis.weekworkmanagement.service.WeekWorkManagementService;

/**
 * @author qiupy 2013-5-3
 * 
 */
public class WeekWorkManagementServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory
			.getLog(WeekWorkManagementServlet.class);
	private WebApplicationContext wac;
	private WeekWorkManagementService weekWorkManagementService;
	private BaseDAO baseDao;

	public WeekWorkManagementServlet() {
		super();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("ac");
		if (method != null) {
			if (method.equals("loadProfessionalGrid")) {
				loadProfessionalGrid(request, response);
			} else if (method.equals("loadUserGrid")) {
				loadUserGrid(request, response);
			}else if (method.equals("userUnitTree")) {
				getUserUnitTree(request, response);
			}else if (method.equals("saveSelectUser")) {
				saveSelectUser(request, response);
			}else if (method.equals("loadWeekWorkD")) {
				loadWeekWorkD(request, response);
			}else if (method.equals("loadProfessional")) {
				loadProfessional(request, response);
			}else if (method.equals("loadWeekWorkM")) {
				loadWeekWorkM(request, response);
			}
		}
	}

	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.weekWorkManagementService = (WeekWorkManagementService) this.wac
				.getBean("weekWorkManagementService");
		this.baseDao = (BaseDAO)this.wac.getBean("baseDAO");
	}

	/**
	 * 
	* @Title: loadProfessionalGrod
	* @Description: 加载专业分类列表
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-4
	 */
	public void loadProfessionalGrid(HttpServletRequest request,
			HttpServletResponse response) {
		String pid = request.getParameter("pid") == null ? "" : request
				.getParameter("pid");
		Connection conn = ConnectionMan.getConnection();
		try {
			String sql = "select uids,professional_code,professional_name,pid from WEEKWORK_PROFESSIONAL where pid='"
					+ pid + "'";
			GridConnector grid = new GridConnector(conn, request, response);
			class professionalGridBehavior extends ConnectorBehavior{
				@Override
				public void beforeSort(ArrayList<SortingRule> sorters){
					SortingRule sr = new SortingRule("professional_code", "asc");
					sorters.add(sr);
				}

				@Override
				public void beforeDelete(DataAction action) {
					String uids = action.get_value("uids");
					String delSql="delete from WEEKWORK_PROFESSION_POWER where professional_id='"+uids+"'";
					JdbcTemplate jt = new JdbcTemplate(HibernateSessionFactory.getConnectionFactory());
					jt.execute(delSql);
				}
				
			}
			grid.event.attach(new professionalGridBehavior());
			if (grid.is_select_mode()) {
				grid.render_sql(sql, "uids",
						"uids,professional_code,professional_name,pid");
			} else
				grid.render_table("WEEKWORK_PROFESSIONAL", "uids",
						"uids,professional_code,professional_name,pid");
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 
	* @Title: getUserUnitTree
	* @Description: 构造单位用户树
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-4
	 */
	public void getUserUnitTree(HttpServletRequest request,
			HttpServletResponse response) {
		String professionalId = request.getParameter("professionalId") == null ? "" : request
				.getParameter("professionalId");
		Connection conn = ConnectionMan.getConnection();
		try {
			String countSql = "select count(*) from weekwork_profession_power where professional_id='"
					+ professionalId + "' and user_id=c.userid";
			String sql = "SELECT * FROM"
					+ "( SELECT unitid uids,unitid rid,upunit parentid,unitname realname,'0' ch,'unit' type FROM sgcc_ini_unit"
					+ " UNION ALL"
					+ " SELECT b.userid uids,b.userid rid,a.unitid parentid,c.realname,decode(("
					+ countSql
					+ "),0,'0','1') ch,'user' type"
					+ " FROM sgcc_ini_unit a JOIN rock_user2dept b ON a.unitid=b.dept_id JOIN rock_user c ON b.userid=c.userid ) where 1=1";
			TreeGridConnector tree = new TreeGridConnector(conn, request,
					response);
			tree.render_sql(sql, "uids", "realname,ch", "rid,type", "parentid");
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 * 
	* @Title: loadUserGrid
	* @Description: 加载用户列表
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-4
	 */
	public void loadUserGrid(HttpServletRequest request,
			HttpServletResponse response) {
		String professionalId = request.getParameter("professionalId") == null ? "" : request
				.getParameter("professionalId");
		Connection conn = ConnectionMan.getConnection();
		try {
			GridConnector grid = new GridConnector(conn, request, response);
			HashMap<String, String> unitMap = getOptionsMap("unitid",
					"unitname", "SGCC_INI_UNIT", "1=1");
			grid.set_options("unit_id", unitMap);
			HashMap<String, String> userMap = getOptionsMap("userid",
					"realname", "ROCK_USER", "1=1");
			grid.set_options("user_id", userMap);
			String sql = "select uids,unit_id,user_id,professional_id from WEEKWORK_PROFESSION_POWER where professional_id='"
					+ professionalId + "'";
			if (grid.is_select_mode()) {
				grid.render_sql(sql, "uids",
						"uids,unit_id,user_id,professional_id");
			} else
				grid.render_table("WEEKWORK_PROFESSION_POWER", "uids",
						"uids,unit_id,user_id,professional_id");
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 * 
	* @Title: saveSelectUser
	* @Description: 保存用户与专业分类的关系
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-4
	 */
	public void saveSelectUser(HttpServletRequest request,
			HttpServletResponse response) {
		String professionalId = request.getParameter("professionalId") == null ? "" : request
				.getParameter("professionalId");
		String data = request.getParameter("data")==null?"":request.getParameter("data");
		String datas[] = data.split(",");
		PrintWriter pw = null;
		try {
			pw = response.getWriter();
			this.baseDao.deleteAll(this.baseDao.findByWhere(WeekworkProfessionPower.class.getName(), "professionalId='"+professionalId+"'"));
			for (int i = 0; i < datas.length; i++) {
				RockUser rUser=(RockUser) this.baseDao.findById(RockUser.class.getName(), datas[i]);
				if(rUser!=null){
					WeekworkProfessionPower wpp=new WeekworkProfessionPower();
					wpp.setUids(weekWorkManagementService.getUuidValue());
					wpp.setProfessionalId(professionalId);
					wpp.setUnitId(rUser.getDeptId());
					wpp.setUserId(datas[i]);
					this.baseDao.insert(wpp);
				}
			}
			pw.write("true");
		} catch (Exception e) {
			e.printStackTrace();
			pw.write("false");
		}finally{
			if(pw != null) pw.close();
		}
	}
	/**
	 * 
	* @Title: loadWeekWorkD
	* @Description: 加载周工作事项明细信息
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-6
	 */
	public void loadWeekWorkD(HttpServletRequest request,
			HttpServletResponse response) {
		String pid = request.getParameter("pid") == null ? "" : request
				.getParameter("pid");
		String weekPeriod = request.getParameter("weekPeriod") == null ? "" : request
				.getParameter("weekPeriod");
		String weekProfessional = request.getParameter("weekProfessional") == null ? "" : request
				.getParameter("weekProfessional");
		boolean existCurrentWeekWork = request.getParameter("existCurrentWeekWork") == null ? true : Boolean.parseBoolean(request
				.getParameter("existCurrentWeekWork"));
		Connection conn = ConnectionMan.getConnection();
		try {
			GridConnector grid = new GridConnector(conn, request, response);
			HashMap<String, String> userMap = getOptionsMap("userid",
					"realname", "ROCK_USER", "1=1");
			grid.set_options("duty_person", userMap);
			String sql = "select uids,'' xh,workable_items,duty_person,work_schedule,performance,main_id from weekwork_management_d where main_id in("
					+ "select uids from weekwork_management_m where professional_id='"
					+ weekProfessional
					+ "' and week_period='"
					+ weekPeriod
					+ "' and pid='" + pid + "')";
			if(!existCurrentWeekWork){
				sql+=" and 1=2";
			}
			if (grid.is_select_mode()) {
				grid
						.render_sql(sql, "uids",
								"uids,xh,workable_items,duty_person,work_schedule,performance,main_id");
			} else
				grid
						.render_table("weekwork_management_d", "uids(uids)",
								"uids,-,workable_items,duty_person,work_schedule,performance,main_id");
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 * 
	* @Title: loadProfessional
	* @Description: 加载专业下拉框信息
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-6
	 */
	public void loadProfessional(HttpServletRequest request,
			HttpServletResponse response){
		Connection conn = ConnectionMan.getConnection();
		String pid = request.getParameter("pid") == null ? "" : request
				.getParameter("pid");
		String userid = request.getParameter("userid") == null ? "" : request
				.getParameter("userid");
		try {
			String sql = "select professional_code,professional_name from weekwork_professional where pid='"+pid+"'";
			if(userid!=null&&!"".equals(userid)){
				sql+=" and uids in(select PROFESSIONAL_ID from WEEKWORK_PROFESSION_POWER where USER_ID='"+userid+"')";
			}
			ComboConnector combo = new ComboConnector(conn, request, response);
			class professionalComboBehavior extends ConnectorBehavior{
				@Override
				public void beforeSort(ArrayList<SortingRule> sorters){
					SortingRule sr = new SortingRule("professional_code", "asc");
					sorters.add(sr);
				}
			}
			combo.event.attach(new professionalComboBehavior());
			combo.render_sql("select * from ("+sql+")", "professional_code", "professional_name");
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 * 
	* @Title: loadWeekWorkM
	* @Description: 加载周工作事项主要信息
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2013-5-6
	 */
	public void loadWeekWorkM(HttpServletRequest request,
			HttpServletResponse response){
		Connection conn = ConnectionMan.getConnection();
		String pid = request.getParameter("pid") == null ? "" : request
				.getParameter("pid");
		String weekPeriod = request.getParameter("weekPeriod") == null ? "" : request
				.getParameter("weekPeriod");
		String weekProfessional = request.getParameter("weekProfessional") == null ? "" : request
				.getParameter("weekProfessional");
		try {
			String sql = "select uids,LAST_WEEK_WORK,CURRENT_WEEK_WORK,PROFESSIONAL_ID,WEEK_PERIOD,PID from WEEKWORK_MANAGEMENT_M where pid='"+pid+"' and PROFESSIONAL_ID='"+weekProfessional+"' and WEEK_PERIOD='"+weekPeriod+"'";
			FormConnector fc = new FormConnector(conn, request, response);
			fc.event.attach(new WeekWorkMComboBehavior());
			if (fc.is_select_mode()) {

				fc
						.render_sql(
								sql,
								"uids",
								" uids,LAST_WEEK_WORK,CURRENT_WEEK_WORK,PROFESSIONAL_ID,WEEK_PERIOD,PID");
			} else {
				fc
						.render_table(
								"WEEKWORK_MANAGEMENT_M",
								"uids",
								" uids,LAST_WEEK_WORK,CURRENT_WEEK_WORK,PROFESSIONAL_ID,WEEK_PERIOD,PID");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	class WeekWorkMComboBehavior extends ConnectorBehavior{
		@Override
		public void beforeUpdate(DataAction action) {
			String uids = action.get_value("uids");
			String week_period = action.get_value("WEEK_PERIOD");
			String professional_id = action.get_value("PROFESSIONAL_ID");
			String pid = action.get_value("PID");
			String last_week_work = action.get_value("LAST_WEEK_WORK");
			String current_week_work = action.get_value("CURRENT_WEEK_WORK");
			WeekworkManagementM weekWork=(WeekworkManagementM) baseDao.findById(WeekworkManagementM.class.getName(), uids);
			weekWork.setCurrentWeekWork(current_week_work);
			weekWork.setLastWeekWork(last_week_work);
			weekWork.setPid(pid);
			weekWork.setProfessionalId(professional_id);
			weekWork.setWeekPeriod(week_period);
			baseDao.saveOrUpdate(weekWork);
			action.success();
		}

		@Override
		public void beforeInsert(DataAction action) {
			String week_period = action.get_value("WEEK_PERIOD");
			String professional_id = action.get_value("PROFESSIONAL_ID");
			String pid = action.get_value("PID");
			String last_week_work = action.get_value("LAST_WEEK_WORK");
			String current_week_work = action.get_value("CURRENT_WEEK_WORK");
			WeekworkManagementM weekWork=new WeekworkManagementM();
			weekWork.setUids(weekWorkManagementService.getUuidValue());
			weekWork.setCurrentWeekWork(current_week_work);
			weekWork.setLastWeekWork(last_week_work);
			weekWork.setPid(pid);
			weekWork.setProfessionalId(professional_id);
			weekWork.setWeekPeriod(week_period);
			baseDao.insert(weekWork);
			action.success();
		}
	}
	/**
	 * set_options所需要的map
	 * 
	 * @param codeCol
	 *            数据库中值的字段名 如：unitid
	 * @param nameCol
	 *            显示值的字段名称 如：unitname
	 * @param table
	 *            数据库表名 如：sgcc_ini_unit
	 * @param filter
	 *            过滤条件 如：1=1
	 * @return
	 */
	public static HashMap<String, String> getOptionsMap(String codeCol,
			String nameCol, String table, String filter) {
		HashMap<String, String> returnMap = new LinkedHashMap<String, String>();
		String sql = "select " + codeCol + "," + nameCol + " from " + table
				+ " where " + filter;
		List list = JdbcUtil.query(sql);
		for (int i = 0; i < list.size(); i++) {
			Map map = (Map) list.get(i);
			String value = map.get(codeCol.toUpperCase()).toString();
			String lable = map.get(nameCol.toUpperCase()) == null ? "" : map
					.get(nameCol.toUpperCase()).toString();
			returnMap.put(value, lable);
		}
		return returnMap;
	}
}
