package com.sgepit.fileAndPublish.control;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.fileAndPublish.hbm.ComFileSort;
import com.sgepit.fileAndPublish.service.IComFileSortService;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.JdbcUtil;

public class ComFileSortServlet extends MainServlet {
	private static final Log log = LogFactory.getLog(ComFileSortServlet.class);
	private WebApplicationContext wac;
	private IComFileSortService comFileSortService;

	/**
	 * Constructor of the object.
	 */
	public ComFileSortServlet() {
		super();
	}

	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.comFileSortService = (IComFileSortService) this.wac
				.getBean("ComFileSortService");
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//页面使用post提交，解决乱码
		request.setCharacterEncoding("UTF-8");
		
		String method = request.getParameter("method") != null ? request
				.getParameter("method").toString() : "noMethod";
		String parentId = request.getParameter("parentId") != null ? request
				.getParameter("parentId").toString() : "1";
		String node = request.getParameter("node") != null ? request
				.getParameter("node").toString() : "1";
		String pid = request.getParameter("pid");
		if ( pid == null ){
			pid = request.getSession().getAttribute(Constant.USERBELONGUNITID).toString();
		}
				
		if (method.equals("buildChildNodes")) {
			List<ComFileSort> list = this.comFileSortService
					.getComFileNodesByParentId(node, null);
			StringBuffer JSONStr = new StringBuffer();
			JSONStr.append("[");
			for (int i = 0; i < list.size(); i++) {
				ComFileSort hbm = list.get(i);
				String nodeName = hbm.getSortName();
				String nodeId = hbm.getUids();
				String desc = nodeId + "`" + nodeName;
				List childList = JdbcUtil
						.query("select uids from com_file_sort where parent_id = '"
								+ nodeId + "'");
				String leaf = childList.size() == 0 ? "true" : "false";
				String cls = leaf.equals("true") ? "file" : "folder";
				JSONStr.append("{\"text\":\"" + nodeName + "\",\"id\":\""
						+ nodeId + "\",\"leaf\":" + leaf + ",\"cls\":\"" + cls
						+ "\",\"description\":\"" + desc + "\"");
				JSONStr.append("},");
			}
			if (JSONStr.length() > 1) {
				JSONStr.deleteCharAt(JSONStr.lastIndexOf(","));
			}
			JSONStr.append("]");
			outputString(response, JSONStr.toString());
		} else if (method.equals("buildAllTree")) {
			String jsonStr = this.bulidAllTreeByDept(parentId,  null);
			outputString(response, jsonStr);
		} else if (method.equals("buildAllTreeByDept")) {
			String deptId = request.getParameter("deptId");
			String jsonStr = this.bulidAllTreeByDept(parentId,  deptId);
			outputString(response, jsonStr);
		} else if ( method.equals("buildAllTreeByDeptAndChild")){
			String deptId = request.getParameter("deptId");
			if ( deptId != null ){
				List<Map> list = new ArrayList<Map>();
				String sql = "select unitid,unit_type_id from "
						+ "(select unitid,unit_type_id from sgcc_ini_unit  start WITH unitid = '"
						+ deptId + "' connect by PRIOR unitid = upunit) "
						+ "where unit_type_id <> '9'";
				list = JdbcUtil.query(sql);
				String deptIds = "";
				for (int i = 0; i < list.size(); i++) {
					deptIds += "`" + list.get(i).get("unitid").toString();
				}
				String jsonStr = this.bulidAllTreeByDept(parentId,  deptIds);
				outputString(response, jsonStr);
			}
		} 
		
		else if (method.equals("updateNode")) {
			String rtn = "{success:";
			try {
				String uids = request.getParameter("uids") == null ? ""
						: request.getParameter("uids").toString();
				String sortBh = request.getParameter("sortBh") == null ? ""
						: request.getParameter("sortBh").toString();
				String sortName = request.getParameter("sortName") == null ? ""
						: request.getParameter("sortName").toString();

//				sortBh = new String(sortBh.getBytes("ISO-8859-1"), "UTF-8");
//				sortName = new String(sortName.getBytes("ISO-8859-1"), "UTF-8");

				if (!uids.equals("")) {
					Boolean result = this.comFileSortService.updateNodeInfo(
							uids, sortName, sortBh);
					if (result) {
						rtn += "true,msg:'操作执行成功!'}";
					} else {
						rtn += "false,msg:'数据更新失败，请联系管理员'}";
					}
				} else {
					rtn += "false,msg:'更新主键为空'}";
				}

			} catch (Exception e) {
				// TODO Auto-generated catch block
				log.error("文档分类树属性更新失败，详见：" + e.getMessage());
				rtn += "false,msg:'" + e.getMessage() + "'}";
				e.printStackTrace();
			}
			outputStr(response, rtn);

		} else if (method.equals("addNode")) {
			String rtn = "{success:";
			String sortBh = request.getParameter("sortBh") == null ? ""
					: request.getParameter("sortBh").toString();
			String sortName = request.getParameter("sortName") == null ? ""
					: request.getParameter("sortName").toString();
			String deptId = request.getSession().getAttribute(Constant.USERDEPTID).toString();
			String deptIds = null;
			if ( !deptId.equals("") ){
				List<Map> list = new ArrayList<Map>();
				String sql = "select unitid,unit_type_id from "
						+ "(select unitid,unit_type_id from sgcc_ini_unit  start WITH unitid = '"
						+ deptId + "' connect by PRIOR unitid = upunit) "
						+ "where unit_type_id <> '9'";
				list = JdbcUtil.query(sql);
				deptIds = "";
				for (int i = 0; i < list.size(); i++) {
					deptIds += "`" + list.get(i).get("unitid").toString();
				}
			}
		
			
			
			if (!sortBh.equals("")) {
				Boolean result = this.comFileSortService
						.addNodeForComFileSortTree(parentId, sortName, deptIds, pid, sortBh);
				if (result) {
					rtn += "true,msg:'操作执行成功!'}";
				} else {
					rtn += "false,msg:'数据更新失败，请联系管理员'}";
				}
			} else {
				Boolean result = this.comFileSortService
						.addNodeForComFileSortTree(parentId, sortName, deptIds, pid);
				if (result) {
					rtn += "true,msg:'操作执行成功!'}";
				} else {
					rtn += "false,msg:'数据更新失败，请联系管理员'}";
				}
			}

		} else if (method.equals("deleteNode")) {
			if (request.getParameter("sortId") != null) {
				String rtn = "{success:";
				String nodeId = request.getParameter("sortId").toString();
				if (this.comFileSortService.deleteNode(nodeId)) {
					rtn += "true,msg:'操作执行成功!'}";
				} else {
					rtn += "false,msg:'数据更新失败，请联系管理员'}";
				}
				outputStr(response, rtn);
			}
		} else if (method.equals("moveNode")) {
			String relationNodeId = request.getParameter("relationPk") == null ? ""
					: request.getParameter("relationPk").toString();
			String moveType = request.getParameter("moveType") == null ? ""
					: request.getParameter("moveType").toString();
			String rtn = "{success:";
			if (!relationNodeId.equals("") && !moveType.equals("")) {
				if (this.comFileSortService.moveComFileSortTreeNode(node,
						relationNodeId, moveType)) {
					rtn += "true,msg:'操作执行成功!'}";
				} else {
					rtn += "false,msg:'移动节点操作失败，请联系管理员'}";
				}
			}
			outputStr(response, rtn);
		} else if (method.equals("buileRightTree")) {
			if (request.getParameter("sortId") != null) {
				String sortId = request.getParameter("sortId").toString();
				String excludeDept = request.getParameter("excludeDept") == null ? "0" : request.getParameter("excludeDept");
				List list;
				if ( excludeDept.equals("1") ){
					list = comFileSortService.getComFileSortRightTree(sortId, pid, true);
				}
				else{
					list = this.comFileSortService
					.getComFileSortRightTree(sortId, pid, false);
				}
				
				JSONArray arrayjson = new JSONArray();// 定义一个jsonarray型的对象
				int size = list.size();
				if (list != null && list.size() > 0) {
					if (list.get(list.size() - 1).getClass().getName().equals(
							"java.lang.Integer")) {
						size = (Integer) list.get(list.size() - 1);
						list.remove(list.size() - 1);
					}
				}
				JsonConfig jsonConfig = new JsonConfig();
				jsonConfig.registerJsonValueProcessor(String.class,
						new JSONUtil.NullValueProcesser());
				arrayjson = JSONArray.fromObject(list, jsonConfig);
				JSONObject jsonResult = new JSONObject();
				jsonResult.put("topics", arrayjson);
				jsonResult.put("totalCount", size);
				outputString(response, jsonResult.toString());
			}
		}
		//文件分类选择分类下发的单位
		else if(method.equals("getIssueFileSortUnit")){
			//分类下发的节点
			String g_rootId=request.getParameter("g_rootId")==null?"":request.getParameter("g_rootId");
			String userBelongUnitId = (String)request.getSession().getAttribute(Constant.USERBELONGUNITID);
			Integer start = request.getParameter("start") != null ? Integer
					.valueOf(request.getParameter("start")) : null;
			Integer limit = request.getParameter("limit") != null ? Integer
					.valueOf(request.getParameter("limit")) : null;		
			String jsonStr=getIssueFileSortUnit(g_rootId, userBelongUnitId, start, limit);
			outputString(response,jsonStr);
		}		
	}

	private String bulidAllTreeByDept(String parentId,  String deptiId) {
		
		List<Map> list = this.comFileSortService.getComFileSortTreeByParentId(
				parentId, deptiId);
		String jsonStr = "[{@node,expanded:true}]";
		for (int i = 0; i < list.size(); i++) {
			Map map = list.get(i);
			// select uids,sort_bh as sortBh,sort_name as sortName ,parent_id as
			// parentId, pxh, pxh_full as pxhFull,childNodeNum
			String nodeName = map.get("sortName") == null ? "" : map.get(
					"sortName").toString();
			String nodeId = map.get("uids") == null ? "" : map.get("uids")
					.toString();
			String nodeBh = map.get("sortBh") == null ? "" : map.get("sortBh")
					.toString();
			String desc = nodeId + "`" + nodeName;
			
			String nodePid = map.get("pid") == null ? "" : map.get("pid").toString();
			
			String isSync = map.get("is_sync") == null ? "0" : map.get("is_sync").toString();
			
			String nodeStr = "\"text\":\"" + nodeName + "\",\"id\":\""
					+ nodeId + "\",\"desc\":\"" + nodeBh + "\",\"pid\":\""
					+ nodePid + "\",\"isSync\":\""
					+ isSync + "\",";
					;
			int l = ((BigDecimal) map.get("childNodeNum")).intValue();
			if (l > 0) {
				nodeStr += "children:[";
				for (int j = 1; j < l; j++) {
					nodeStr += "{@node},";
				}
				nodeStr += "{@node}]";
			} else {
				nodeStr += "\"leaf\":true";
			}
			jsonStr = jsonStr.replaceFirst("@node", nodeStr);

		}
		return jsonStr;
	}
	/**
	 * 分类下发单位选择
	 * @param rootId
	 * @param userBelongUnitId	当前登录用户所属单位ID
	 * @param start
	 * @param limit
	 * @return
	 */	
	private String getIssueFileSortUnit(String rootId, String userBelongUnitId, Integer start,Integer limit) {
		List<SgccIniUnit>sgccIniUnitList=comFileSortService.getIssueFileSortUnit(rootId, userBelongUnitId, start,limit);
		String jsonStr = makeJsonDataForGrid(sgccIniUnitList);
		return jsonStr;
	}
}
