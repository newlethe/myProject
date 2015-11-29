package com.sgepit.pmis.gantt;

import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.gantt.hbm.EdoProject;

public class GantDwrOper {
	// 删除临时gantt xml file
	public void delFile(String delFile) {
		if ((new File(delFile)).delete()) {
			System.out.println("成功删除服务器Gantt文件： " + delFile);
		} else {
			System.out.println("上次gantt文件仍旧在服务器中： " + delFile);
		}
	}

	// 获取用户名
	public String getUserName(String userid) {
		String re_value = "";
		try {
			Context initCtx = new InitialContext();
			String sql = "select realname from rock_user where userid='"
					+ userid + "'";
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				re_value = rs.getString(1);
			}
			stmt.close();
			conn.close();
			initCtx.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return re_value;
	}

	// 获取用户名
	public String getTaskName(String taskid, String projectid) {
		String re_value = "";
		try {
			Context initCtx = new InitialContext();
			String sql = "select name_ from edo_task where uid_='" + taskid
					+ "' and projectuid_='" + projectid + "'";
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				re_value = rs.getString(1);
			}
			stmt.close();
			conn.close();
			initCtx.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return re_value;
	}

	// 插入项目人员
	public boolean insertEdo_user_project(String projectid, String names, String pid) {
		Boolean mark = false;
		String[] namesArr = names.substring(13).split("%2C");
		int length = namesArr.length;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement st = conn.createStatement();
			for (int i = 0; i < namesArr.length; i++) {
				String sn = UUID.randomUUID().toString();
				sn = sn.substring(0, 8) + sn.substring(9, 13)
						+ sn.substring(14, 18) + sn.substring(19, 23)
						+ sn.substring(24);
				// 去掉重复的ID
				for (int j = 0; j < namesArr.length; j++) {
					if (namesArr[i] != null && namesArr[i].equals(namesArr[j])
							&& i != j) {
						namesArr[j] = null;
						length--;
					}
				}
				// System.out.println(getedo_user(projectid,namesArr[i])+namesArr[i]);
				if (namesArr[i] != null && getedo_user(projectid, namesArr[i])) {
					String sql = "insert into edo_project_user (uid_,projectid_,userid_,pid)values('"
							+ sn
							+ "','"
							+ projectid
							+ "','"
							+ namesArr[i]
							+ "','"
							+ pid
							+ "') ";
					System.out.println(sql);
					st.execute(sql);
				}
			}
			mark = true;
			st.close();
			conn.close();
			initCtx.close();
		} catch (Exception ex) {
			mark = false;
			ex.printStackTrace();
		}

		return mark;
	}

	// 项目是否是否存在此用户
	public boolean getedo_user(String projectid, String userid) {
		Boolean b_mark = true;
		String sql = "select * from edo_project_user where projectid_='"
				+ projectid + "' and userid_='" + userid+"'";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement st = conn
					.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
							ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = st.executeQuery(sql);
			rs.last();
			int flag = rs.getRow();
			rs.beforeFirst();
			if (flag > 0) {
				b_mark = false;
			}
			st.close();
			conn.close();
			initCtx.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return b_mark;
	}

	public String[] rtMember(String projectuid_) throws NamingException,
			SQLException, ClassNotFoundException {
		Context initCtx = new InitialContext();
		DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
		Connection conn = ds.getConnection();

		String sql = "select distinct r.userid as userid,r.realname as realname,s.unitname,u.roleid,u.uid_ from rock_user r,edo_project_user u,sgcc_ini_unit s where r.userid(+)=u.userid_ and r.dept_id=s.unitid and u.projectid_='"
				+ projectuid_ + "'";
		String[] jsonArray = new String[2];

		try {
			Statement stmt = conn
					.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
							ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = stmt.executeQuery(sql);
			ResultSetMetaData rsmd = rs.getMetaData();
			rs.last();
			jsonArray[0] = rs.getRow() + "";
			jsonArray[1] = "[";
			rs.beforeFirst();
			while (rs.next()) {
				jsonArray[1] += "{" + rsmd.getColumnName(1).toLowerCase()
						+ ":'" + rs.getString(1) + "',"
						+ rsmd.getColumnName(2).toLowerCase() + ":'"
						+ rs.getString(2) + "',"
						+ rsmd.getColumnName(3).toLowerCase() + ":'"
						+ rs.getString(3) + "',"
						+ rsmd.getColumnName(4).toLowerCase() + ":'"
						+ rs.getString(4)+ "',"
						+ rsmd.getColumnName(5).toLowerCase() + ":'"
						+ rs.getString(5) +"'},";
			}
			jsonArray[1] = jsonArray[1].substring(0, jsonArray[1].length() - 1);
			jsonArray[1] = jsonArray[1] + "]";
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		if ("]".equals(jsonArray[1])) {
			jsonArray[1] = "[]";
		}
		// System.out.println(jsonArray[1]);
		return jsonArray;
	}

	// //////////获的用户
	public String[] getUsername(String node) throws NamingException,
			SQLException, ClassNotFoundException {
		
		Context initCtx = new InitialContext();
		DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
		Connection conn = ds.getConnection();
		String sql = "";
		String[] jsonArray = new String[2];
		// System.out.println(pid);
		try {
			if (node.equals("")) {
				sql = "select userid,realname from rock_user order by userid";
			} else {
				String unitWhere = "select unitid from sgcc_ini_unit start with unitid='" + node + "' connect by prior unitid=upunit";
				sql = "select * from (select userid,realname from rock_user where dept_id in (" + unitWhere + ") or posid in (" + unitWhere + ")"
						+ "order by userid)";
			}
			Statement stmt = conn
					.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
							ResultSet.CONCUR_READ_ONLY);
			ResultSet rs = stmt.executeQuery(sql);
			ResultSetMetaData rsmd = rs.getMetaData();
			rs.last();
			jsonArray[0] = rs.getRow() + "";
			jsonArray[1] = "[";
			rs.beforeFirst();

			while (rs.next()) {
				jsonArray[1] += "{" + rsmd.getColumnName(1).toLowerCase()
						+ ":'" + rs.getString(1) + "',"
						+ rsmd.getColumnName(2).toLowerCase() + ":'"
						+ rs.getString(2) + "'},";
			}
			jsonArray[1] = jsonArray[1].substring(0, jsonArray[1].length() - 1);
			jsonArray[1] = jsonArray[1] + "]";
			// System.out.println("a[0]"+jsonArray[0]);
			// System.out.println("a[1]"+jsonArray[1]);
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		if (jsonArray[1].equals("]")) {
			jsonArray[1] = "[]";
		}
		return jsonArray;
	}
	public boolean execute(String sql) {
		boolean flag = false;
		try {
			Context initCtx = new InitialContext();

			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String[] s = sql.split(";");
			for(int i=0; i<s.length; i++) {
				if(!s[i].trim().equals("")) {
					stmt.addBatch(s[i]);
				}
			}
			stmt.executeBatch();
			stmt.close();
			conn.close();
			initCtx.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return flag;
	}	
	
	
	/**
	 * 判断是否已经存在里程碑计划和一级网络计划
	 * @param nameArr
	 * @param pid
	 * @return
	 */
	public boolean isHavePlan(String[] nameArr,String pid){
		Boolean bool = true;
		String sql = "";
		try {
			for (int i = 0; i < nameArr.length; i++) {
				sql = "select * from edo_project where name_='"+nameArr[i]+"' and pid='"+pid+"'";		
		
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement st = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
				ResultSet rs = st.executeQuery(sql);
				rs.last();
				int num = rs.getRow();
				rs.beforeFirst();
				st.close();
				conn.close();
				initCtx.close();
				if (num > 0){
					bool = false;
					break;
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		return bool;
	}
	
	/**
	 * 判断是否存在“里程碑计划”和“一级网络计划”，存在则跳过，不存在自动初始化
	 * @param pid 工程项目编号
	 * @param plan 值为li或yi，区分里程碑计划和一级网络计划
	 * @param projectuid 项目计划编号
	 * @return String 不存在，返回新增的最新编号；存在，返回当前计划编号
	 * @author zhangh
	 * @createDate 2010-6-17
	 */
	public void isHaveProjectPlan(String pid){
		try {
			//里程碑计划
			String[] nameArr = {"里程碑计划","一级网络计划"};
			String sql = "";
			String insertSql = "";
			for (int i = 0; i < nameArr.length; i++) {
				sql = "select * from edo_project where name_='"+nameArr[i]+"' and pid='"+pid+"'";
				
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement st = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_READ_ONLY);
				ResultSet rs = st.executeQuery(sql);
				rs.last();
				int num = rs.getRow();
				if (num == 0){
					String sn = UUID.randomUUID().toString();
					sn = sn.replace("-","");
					insertSql = "insert into edo_project values('"+sn+"','"+nameArr[i]+"'," +
					"sysdate,sysdate,sysdate,sysdate," +
					"1,480,8,17,480,2400,20,'"+pid+"',0)";
					st.execute(insertSql);
					//为初始化的里程碑和一级网络执行数据交互
					String[] snArr = {sn};
					this.projectExchangeDataToQueue(snArr, pid);
				}
				rs.beforeFirst();
				st.close();
				conn.close();
				initCtx.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 数据交互
	 * @param uids
	 * @param pid
	 */
	public Boolean projectExchangeDataToQueue(String[] uidsArr,String pid){
		try {
			System.out.println(">>"+uidsArr);
			List allDataList = new ArrayList();
			List<EdoProject> listPro = new ArrayList<EdoProject>();
			for (int i = 0; i < uidsArr.length; i++) {
				EdoProject pro = new EdoProject();
				pro.setUid(uidsArr[i]);
				listPro.add(pro);
			}
			allDataList.addAll(listPro);
			//获取PCDataExchangeService实例
			PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			//获取数据交换对象列表
			List<PcDataExchange> exchangeList = dataExchangeService.getExchangeDataList(allDataList, pid, null, null);
			//将数据加入队列
			dataExchangeService.addExchangeListToQueue(exchangeList);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 根据项目类型初始化甘特图显示信息。
	 * 根据Pid获取项目类型
	 * @param uids
	 * @throws NamingException 
	 * @throws SQLException 
	 * 
	 */
	@SuppressWarnings("rawtypes")
	public String insertNewDate(String pid,String projectID){
		String getType = null;
		String btnDisableSql = "update edo_project set btndisable = 1 where uid_='"+projectID+"'";
		String sqlType = "select t.PRJ_TYPE_NAME from v_pc_zhxx_prj_info t where t.PID='"+pid+"'";
		List listType = JdbcUtil.query(sqlType);
		Map mapType=(Map)listType.get(0);
		if(mapType.get("PRJ_TYPE_NAME").toString().equals("风电")){
			getType ="风电项目";
		}
        if(mapType.get("PRJ_TYPE_NAME").toString().equals("火电")){
		    getType = "火电项目";
		}
        if(mapType.get("PRJ_TYPE_NAME").toString().equals("火电新")){
        	getType = "火电项目新";
        }

		String pSql = "select (select t.unitname from sgcc_ini_unit t where t.unitid = '"+pid+"') prjName, " +
				" to_char(t.startdate_,'yyyy-mm-dd') prjStart, " +
				" to_char(t.finishdate_,'yyyy-mm-dd') prjEnd from edo_project t where t.uid_ = '"+projectID+"' ";
		List pList = JdbcUtil.query(pSql);
		if(!(pList.size()>0))return null;
		Map pMap = (Map) pList.get(0);
		
		String sql1 = "select t1.property_name,t1.property_code,t1.type_name from PROPERTY_CODE t1" +
				" where t1.type_name =(select t.uids from PROPERTY_TYPE t where type_name='";
		String sql2 = "";
		//火电项目里程碑节点分3部分，1#,2#机组，公共部分 pengy 2014-2-17
		if (getType != null && getType.equals("火电项目新")){
			sql2 = sql1 + getType + "') order by t1.property_code";
		} else {
			sql2 = sql1 + getType + "')";		
		}
		List list = JdbcUtil.query(sql2);
		
		String sql = "delete edo_task t where t.projectuid_='"+projectID+"' ";
		JdbcUtil.execute(sql);                //删除操作

		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String getDate = sdf.format(date);
		//初始化插入根节点：项目名称
		String insertSQL = "insert into edo_task values('" +
					UUID.randomUUID().toString().toUpperCase()+"'," +
					"1, '" + pMap.get("prjName") + "', 0, 1, 1, 500," +
					"to_date('" + pMap.get("prjStart") + " 8:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
					"to_date('" + pMap.get("prjEnd") + " 17:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
					"8, 39, 8, 1, 0, 0, 0, 1, '', '', 0, '', ''," +
					"to_date('" + getDate + "','yyyy-mm-dd hh24:mi:ss')," +
					"'" + projectID+"', -1 )";
		JdbcUtil.execute(insertSQL);

		/*
		"(" +
		"uid_," +
		"id_, name_, type_, outlinenumber_, outlinelevel_, priority_," +
		"start_," +
		"finish_," +
		"duration_, durationformat_, work_, estimated_, percentcomplete_, milestone_, summary_, critical_, " +
		"hyperlink_,hyperlinkaddress_,constrainttype_,constraintdate_,notes_," +
		"createdate_," +
		"projectuid_, parenttaskuid_" +
		")" +
		*/
		//非火电项目不变
		if (!mapType.get("PRJ_TYPE_NAME").toString().equals("火电")&& !mapType.get("PRJ_TYPE_NAME").toString().equals("火电新")){
			for(int i= 0 ; i<list.size();i++){
				Map map=(Map)list.get(i);
				insertSQL =" insert into edo_task values('" +
							UUID.randomUUID().toString().toUpperCase()+"'," +
							(Integer.parseInt(map.get("PROPERTY_CODE").toString())+1) +"," +
							"'"+map.get("PROPERTY_NAME")+"'," +
							"0, '1."+map.get("PROPERTY_CODE")+"', "+2+", "+500+"," +
							"to_date('"+pMap.get("prjStart")+ " 8:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
							"to_date('"+pMap.get("prjEnd")+ "17:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
							"8, 39, 8, 1, 0, 1, 0, 0, " +
							"'', '', 0, '', ''," +
							"to_date('"+getDate+"','yyyy-mm-dd hh24:mi:ss')," +
							"'"+projectID+"', -1)";
				JdbcUtil.execute(insertSQL);
			}
		} else {
			//edo_task表的id_字段是从1开始的序列,1为根节点
			int idNum = 2;
			for(int i=0; i<list.size(); i++){
				Map map=(Map)list.get(i);
				//查询二级节点下的里程碑节点，二级节点为1#、2#机组、公共部分
				sql2 = sql1 + map.get("PROPERTY_NAME") + "') order by t1.property_code";
				List list2 = JdbcUtil.query(sql2);
				insertSQL = "insert into edo_task values('" +
							UUID.randomUUID().toString().toUpperCase()+"'," +
							idNum + ",'" + map.get("PROPERTY_NAME")+"', 0, '1." +
							map.get("PROPERTY_CODE")+ "', 2, 500," +
							"to_date('" + pMap.get("prjStart") + " 8:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
							"to_date('" + pMap.get("prjEnd") + "17:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
							"8, 39, 8, 1, 0, 1, 0, 1, '', '', 0, '', ''," +
							"to_date('" + getDate + "','yyyy-mm-dd hh24:mi:ss')," +
							"'" + projectID + "', -1)";
				JdbcUtil.execute(insertSQL);
				//第三层为里程碑节点
				for (int j=0; j<list2.size(); j++){
					Map map2 = (Map)list2.get(j);
					insertSQL = "insert into edo_task values('" +
							UUID.randomUUID().toString().toUpperCase()+"'," +
							(idNum + Integer.parseInt(map2.get("PROPERTY_CODE").toString())) +
							",'" + map2.get("PROPERTY_NAME") +
							"',0,'1." + map.get("PROPERTY_CODE") +"."+ map2.get("PROPERTY_CODE") +"',2,500," +
							"to_date('" + pMap.get("prjStart")+ " 8:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
							"to_date('" + pMap.get("prjEnd")+ "17:00:00"+"','yyyy-mm-dd hh24:mi:ss')," +
							"8, 39, 8, 1, 0, 1, 0, 1, '', '', 0, '', ''," +
							"to_date('" + getDate + "','yyyy-mm-dd hh24:mi:ss'), '" +
							projectID + "', -1)";
					JdbcUtil.execute(insertSQL);
				}
				idNum += list2.size() + 1;
			}
		}
		JdbcUtil.execute(btnDisableSql);
		return  "scuess";
	}
}

