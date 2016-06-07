package com.sgepit.pmis.zlaq.control;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.hibernate.Session;

import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.zlaq.dao.ZlaqTreeDAO;
import com.sgepit.pmis.zlaq.hbm.ZlaqTree;

public class ZlaqServlet extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public ZlaqServlet() {
		super();
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
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String ac = request.getParameter("ac")!=null?request.getParameter("ac").toString():"buildAllTree";
		String parentId = request.getParameter("parentId")!=null?request.getParameter("parentId").toString():"-1";
		String nodeName = request.getParameter("nodeName")!=null?request.getParameter("nodeName").toString():"";
		String projectType = request.getParameter("projectType")!=null?request.getParameter("projectType").toString():"";
		String voltageLevel = request.getParameter("voltageLevel")!=null?request.getParameter("voltageLevel").toString():"";
		response.setContentType("text/html;charset=gbk");
		if(ac.equals("buildAllTree")){
			String str = this.getBulidTreeJson(request,parentId);
			PrintWriter out = response.getWriter();
			out.print(str);
			out.flush();
			out.close();
		}else if(ac.equals("buildAllTreeWhitProj")){
			String str = this.getBulidTreeWithProjectJson(request,parentId);
			PrintWriter out = response.getWriter();
			out.print(str);
			out.flush();
			out.close();
		}else if(ac.equals("moveTreeNode")){
			PrintWriter out = response.getWriter();
			if((request.getParameter("treeId")!=null)&&(request.getParameter("relationPk")!=null)&&(request.getParameter("type")!=null)){
				String treeId = request.getParameter("treeId").toString();
				String relationPk = request.getParameter("relationPk").toString();
				String type = request.getParameter("type").toString();
				String str = this.moveTreeNode(treeId, relationPk, type);
				out.print(str);
			}else{
				out.print("false");
			}
			out.flush();
			out.close();
		}else if(ac.equals("addNode")){
			PrintWriter out = response.getWriter();
			String msg = "false";
			String stackTrace = "";
			//System.out.println(new String(nodeName.getBytes("ISO-8859-1"),"UTF-8"));
			try{
				//msg = insertTreeNode(parentId,new String(nodeName.getBytes("UTF-8"),"GBK"));
				msg = insertTreeNode(parentId,nodeName);
			}catch(Exception e){
				stackTrace = getStackTrace(e);
			}
			out.print(msg);
			out.flush();
			out.close();
			
		}else if(ac.equals("editNode")){
			PrintWriter out = response.getWriter();
			String msg = "false";
			String stackTrace = "";
			//System.out.println(new String(nodeName.getBytes("ISO-8859-1"),"UTF-8"));
			try{
				//msg = insertTreeNode(parentId,new String(nodeName.getBytes("UTF-8"),"GBK"));
				msg = editTreeNode(parentId,nodeName);
			}catch(Exception e){
				stackTrace = getStackTrace(e);
			}
			out.print(msg);
			out.flush();
			out.close();
			
		}else if(ac.equals("deleteNode")){
			PrintWriter out = response.getWriter();
			String msg = "false";
			msg = deleteTreeNode(parentId);
			out.print(msg);
			out.flush();
			out.close();
			
		}else if(ac.equals("refVoltageLV")){
			PrintWriter out = response.getWriter();
			String msg = "false";
			msg = refVoltageLevel(projectType,voltageLevel);
			out.print(msg);
			out.flush();
			out.close();
			
		}
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doGet(request, response);
	}


	public void init() throws ServletException {
		// Put your code here
	}
	
	/**
	  * �ƶ��ڵ�λ��
	  * @param treeId ���ƶ��Ľڵ�
	  * @param relationPk 
	  * @param type
	  * 	(in:��relationPk��
	  * 	after:��relationPk����
	  * 	before:��relationPk����)
	  * @return
	  * @throws BusinessException
	  **/
	public String  moveTreeNode(String treeId,String relationPk,String type){
		String flag = "true";
		try{
			ZlaqTreeDAO treeDAO = ZlaqTreeDAO.getInstence();
			ZlaqTree hbm = (ZlaqTree)treeDAO.findById(treeId);

			if(type.equals("append")){//��ĳ��ڵ���
				hbm.setParentid(relationPk);
				String sql = "select max(pxh) from zlaq_tree where parentid='"+relationPk+"'";
				List list = treeDAO.getData(sql);
				int order = 0;
				if(list!=null&&list.size()>0){
					if(list.get(0)!=null){
						order = ((BigDecimal)list.get(0)).intValue();
					}
				}
				hbm.setPxh(order+1);
				treeDAO.saveOrUpdate(hbm);
			}else{
				ZlaqTree relationHbm = (ZlaqTree)treeDAO.findById(relationPk);
				if(type.equals("above")){//��ĳ��ڵ�����
					//�ж�relationPk��˳���-1�ǲ��Ǳ�ռ��
					String where = "pxh="+(relationHbm.getPxh()-1)+" and parentid='"+relationHbm.getParentid()+"'";
					List list = treeDAO.findWhere(where);
					Integer curOrder = relationHbm.getPxh()-1;
					if(list!=null&&list.size()>0){
						//�4ν��Ժ��˳���+1
						where = "pxh>="+(relationHbm.getPxh())+" and parentid='"+relationHbm.getParentid()+"'";
						List orderlist = treeDAO.findWhere(where);
						setTreeOrderCode(orderlist);
						curOrder = relationHbm.getPxh();
					}
					hbm.setParentid(relationHbm.getParentid());
					hbm.setPxh(curOrder);
					treeDAO.saveOrUpdate(hbm);
				}else if(type.equals("below")){//��ĳ��ڵ�����
					//�ж�relationPk��˳���+1�ǲ��Ǳ�ռ��
					String where = "pxh="+(relationHbm.getPxh()+1)+" and parentid='"+relationHbm.getParentid()+"'";
					List list = treeDAO.findWhere(where);
					if(list!=null&&list.size()>0){
						//�4ν��Ժ��˳���+1
						where = "pxh>"+(relationHbm.getPxh())+" and parentid='"+relationHbm.getParentid()+"'";
						List orderlist = treeDAO.findWhere(where);
						setTreeOrderCode(orderlist);
					}
					hbm.setParentid(relationHbm.getParentid());
					hbm.setPxh(relationHbm.getPxh()+1);
					treeDAO.saveOrUpdate(hbm);
				}
			} 
		}catch(Exception e){
			flag = "false";
		}
		
		return flag;
	}
	
	private void setTreeOrderCode(List list){
		if(list!=null&&list.size()>0){
			ZlaqTreeDAO treeDAO = ZlaqTreeDAO.getInstence();
			ZlaqTree hbm = null;
			for(int i=0;i<list.size();i++){
				hbm = (ZlaqTree)list.get(i);
				hbm.setPxh(hbm.getPxh()+1);
				treeDAO.saveOrUpdate(hbm);
			}
		}
	}
	private String insertTreeNode(String parentId,String nodeName){
		String flag = "true";
		ZlaqTreeDAO treeDAO = ZlaqTreeDAO.getInstence();
		try{
			String sql = "select max(pxh) from zlaq_tree where parentid='"+parentId+"'";
			List list = treeDAO.getData(sql);
			int order = 0;
			if(list!=null&&list.size()>0){
				if(list.get(0)!=null){
					order = ((BigDecimal)list.get(0)).intValue();
				}
			}
			ZlaqTree hbm = new ZlaqTree();
			hbm.setTreeid(SnUtil.getNewID(""));
			hbm.setParentid(parentId);
			hbm.setTreename(nodeName);
			hbm.setPxh(order+1);
			treeDAO.saveOrUpdate(hbm);
		}catch(Exception e){
			flag = "false";
		}
		return flag;
		
	}
	
	private String editTreeNode(String nodeId,String nodeName){
		String flag = "true";
		ZlaqTreeDAO treeDAO = ZlaqTreeDAO.getInstence();
		try{
			ZlaqTree hbm = (ZlaqTree)treeDAO.findById(nodeId);
			if(hbm!=null){
				hbm.setTreename(nodeName);
				treeDAO.saveOrUpdate(hbm);
			}else{
				flag = "false";
			}
			
		}catch(Exception e){
			flag = "false";
		}
		return flag;
		
	}
	private String deleteTreeNode(String nodeId){
		String flag = "true";
		Session session = null;
		try{
			session = HibernateSessionFactory.getSession();
			String sql = "delete zlaq_tree where treeid in " +
					"(select treeid from zlaq_tree t start WITH treeid = '"+nodeId+"' connect by PRIOR treeid = parentid)";			
			session.createSQLQuery(sql).executeUpdate();
			session.close();
		}catch(Exception e){
			flag = "false";
		}
		return flag;
		
	}
	private String refVoltageLevel(String projectType, String voltageLevel){
		String rtn = "true";
		return rtn;
	}
	//�첽<asynchronism>
	private String getBulidTreeJson(HttpServletRequest request,String paretnId){
		StringBuffer JSONStr = new StringBuffer();
		JSONStr.append("[");
		ZlaqTreeDAO treeDAO = ZlaqTreeDAO.getInstence();
		String pid = request.getParameter("node")!=null ? (String)request.getParameter("node"):paretnId ;
//		List<ZlaqTree> list = treeDAO.findWhereOrderBy("parentid= '"+pid+"'","pxh");
		String sql = "select treeid,treename,parentid,pxh,path from v_zlaq_tree"
			+ " where parentid= '"+pid+"' order by pxh";
		List<Object[]> tempList = treeDAO.getData(sql);
		for(Object[] obj:tempList){
//			ZlaqTree hbm =  list.get(i);
//			String treeName = hbm.getTreename();
//			String treeId = hbm.getTreeid();
			String treeName = obj[1].toString();//hbm.getProjectName();
			String treeId = obj[0].toString();//hbm.getLsh();
			String path = obj[4].toString();//hbm.getPath();
			String desc = treeId+"`"+treeName;
			String leaf =  treeDAO.findWhere("parentid= '"+treeId+"'").size()==0?"true":"false";
			String cls = leaf.equals("true") ? "file" : "folder";
			JSONStr.append("{\"text\":\""+treeName+"\",\"id\":\""+treeId+"\",\"leaf\":"+leaf+",\"cls\":\""+cls+"\",\"description\":\""+desc+"\",\"path\":\""+path+"\"");
			JSONStr.append("},");
		}
		if (JSONStr.length() > 1)
		{
			JSONStr.deleteCharAt(JSONStr.lastIndexOf(","));
		}
		JSONStr.append("]");
		return JSONStr.toString();
	}
	//�첽<asynchronism>
	private String getBulidTreeWithProjectJson(HttpServletRequest request,String paretnId){
/*		ZlaqTreeDAO treeDAO = ZlaqTreeDAO.getInstence();
		String pid = request.getParameter("node")!=null ? (String)request.getParameter("node"):paretnId ;
		String projStageFilter = request.getParameter("projStage")!=null&&!request.getParameter("projStage").equals("") ? " and (project_stage is null or project_stage in ("+(String)request.getParameter("projStage")+"))":"" ;
		String iftcFilter = request.getParameter("iftc")!=null&&!request.getParameter("iftc").equals("all") ? " and (iftc is null or iftc ='"+(String)request.getParameter("iftc")+"')":"" ;
		String type = request.getParameter("type")!=null&&!request.getParameter("type").equals("") ? (String)request.getParameter("type"):"plan" ;
		String fxgcFilter = type.equalsIgnoreCase("fact")?"":" and (iffxgc is null or iffxgc <> '1') ";
		String unitIdFilter = request.getParameter("unitId")!=null&&!request.getParameter("unitId").equals("") ? " and (type = 'T' or (type = 'N' and unit_id like ('%"+(String)request.getParameter("unitId")+"%'))) ":"" ;
		Boolean showFxgc = request.getParameter("showFxgc")!=null&&!request.getParameter("showFxgc").equals("true") ? false:true ;
		//String projIdFilter = request.getParameter("projId")!=null&&!request.getParameter("projId").equals("") ? " and (iffxgc is null or iffxgc <> '1' or (iffxgc = '1' and treeid in ("+(String)request.getParameter("projId")+"))) ":"" ;
		String projIdFilter = request.getParameter("projId")!=null&&!request.getParameter("projId").equals("") ? (showFxgc?" and (iffxgc is null or iffxgc <> '1' or (iffxgc = '1' and treeid in ("+(String)request.getParameter("projId")+"))) ":" and (iffxgc is null or (iffxgc is not null and treeid in ("+(String)request.getParameter("projId")+"))) "):"" ;
		//List<ZlaqTree> list = treeDAO.findWhereOrderBy("parentid= '"+pid+"'","pxh");
		String sql = "select treeid,treename,parentid,pxh,path,iffxgc,type from v_zlaq_treeAndInfo"
				+ " where parentid= '"+pid+"' " + projStageFilter + iftcFilter + fxgcFilter + unitIdFilter + projIdFilter + " order by pxh";
		List<Object[]> tempList = treeDAO.getData(sql);
		List<ZhjhProjInfo> list = new ArrayList<ZhjhProjInfo>();
		for(Object[] obj:tempList){
			ZhjhProjInfo o = new ZhjhProjInfo();
			if(obj[0]!=null) o.setLsh(obj[0].toString());
			if(obj[1]!=null) o.setProjectName(obj[1].toString());
			if(obj[2]!=null) o.setParentProjId(obj[2].toString());
			//if(obj[3]!=null) o.setPxh(new Integer(obj[3].toString()));
			if(obj[5]!=null) o.setIffxgc(obj[5].toString());
			if(obj[6]!=null) o.setMemoC5(obj[6].toString());
			list.add(o);
		}*/
		StringBuffer JSONStr = new StringBuffer();
		JSONStr.append("[");
/*		for (int i = 0; i < list.size(); i++) {
			ZhjhProjInfo hbm =  list.get(i);
			String treeName = hbm.getProjectName();
			String treeId = hbm.getLsh();
			String desc = treeId+"`"+treeName;
			String iffxgc = hbm.getIffxgc();
			String nodeType = hbm.getMemoC5();
			//String leaf =  treeDAO.findByWhere("parentid= '"+treeId+"'").size()==0?"true":"false";
			sql = "select treeid,treename,parentid,pxh,path from v_zlaq_treeAndInfo"
				 + " where parentid= '"+treeId+"' " + projStageFilter + iftcFilter + fxgcFilter + unitIdFilter + projIdFilter;
			String leaf =  treeDAO.getData(sql).size()==0 && nodeType.equalsIgnoreCase("N")?"true":"false";
			String cls = iffxgc!=null && nodeType.equalsIgnoreCase("N") ? "folder" : "folder";
			JSONStr.append("{\"text\":\""+treeName+"\",\"id\":\""+treeId+"\",\"leaf\":"+leaf+",\"cls\":\""+cls+"\",\"description\":\""+desc+"\",\"iffxgc\":\""+iffxgc+"\"");
			JSONStr.append("},");
		}
		if (JSONStr.length() > 1)
		{
			JSONStr.deleteCharAt(JSONStr.lastIndexOf(","));
		}*/
		JSONStr.append("]");
		return JSONStr.toString();
	}
		
	private String getTreeJSonStr(String parentId){
		String treeJsonStr = "[{@node,expanded:true}]";
		//treeLoadType:tree ���ط�ʽ����Ϊͬ��<synchronization>���첽<asynchronism>����ͬ�ļ��ط�ʽ����ݸ�ʽ��һ��
		String sql = "select treeid, parentid, treename, pxh,leaf from" +
		" (select treeid,parentid,treename,pxh," +
		" (select count(treeid) from zlaq_tree where parentid = t.treeid) as leaf" +
		" from zlaq_tree t start WITH treeid = '"+parentId+"' connect by PRIOR treeid = parentid)";
		Context initCtx;
		try {
			initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = null;
			Statement stmt = null;
			try {
				conn = ds.getConnection();
				stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql);
				List<String[]> l = new ArrayList<String[]>();
				while(rs.next()){
					String treeid = rs.getString(1)==null?"":rs.getString(1).trim();
					String parentid = rs.getString(2)==null?"":rs.getString(2).trim();
					String treename = rs.getString(3)==null?"":rs.getString(3).trim();
					String pxh = rs.getString(4)==null?"":rs.getString(4).trim();
					String leafNum = String.valueOf(rs.getInt(5));
					String[] nodes = {treeid,parentid,treename,pxh,leafNum,"-1"};
					l.add(nodes);
				}
				
				for (int i = 0; i < l.size(); i++) {
					String p = l.get(i)[0];
					int showLeafNum = 0;
					for (int j = 0; j < l.size(); j++) {
						if (l.get(j)[1].equals(p)) {
							showLeafNum ++ ;
						}
					}
					l.get(i)[5] = String.valueOf(showLeafNum);
				}
				
				for (int i = 0; i < l.size(); i++) {
					String[] aNode = l.get(i);
					String nodeStr = "id:'" + aNode[0] + "'"
						+ ",text:'" + aNode[2] + "'"
						+ ",description:'" + aNode[0]+'`'+aNode[2] + "'";
					//ʵ���ӽڵ���Ŀ
					int leafS = Integer.parseInt(aNode[4]);
					//ѡ�е��ӽڵ����
					int leafN = Integer.parseInt(aNode[5]);
					if (leafS>0) {
						if(leafN>0) {
							nodeStr += ",children:[";
							for(int ik=1;ik<leafN;ik++) {
								nodeStr += "{@node},";
							}
							nodeStr += "{@node}]";
						}else{
							nodeStr += ",children:[]";
						}
					} else {
						nodeStr += ",leaf:true";
					}
					treeJsonStr = treeJsonStr.replaceFirst("@node",nodeStr);
				}
				
				rs.close();
				stmt.close();
				conn.close();
				initCtx.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}finally{
				try{
					if(stmt==null){
						stmt.close();
					}
				}catch(Exception e){
					e.printStackTrace();
				}
				try{
					if(!conn.isClosed()){
						conn.close();
					}
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		} catch (NamingException e) {
			e.printStackTrace();
		}
		return treeJsonStr;
	}
	/**
	 * ���쳣��ջ�л�ȡ��Ӧ����ص���Ϣ
	 * 
	 * @param e
	 * @return
	 */
	public String getStackTrace(Exception e) {
		StringBuffer msg = new StringBuffer("");
		StackTraceElement[] st = e.getStackTrace();
		for (int i = 0; i < st.length; i++) {
			if (st[i].getClassName().indexOf("com.hdkj") > -1) {
				msg.append("at ");
				msg.append(st[i].getClassName());
				msg.append(".");
				msg.append(st[i].getMethodName());
				msg.append("(");
				msg.append(st[i].getFileName());
				msg.append(":");
				msg.append(st[i].getLineNumber());
				msg.append(")\n");
			}
		}
		return msg.toString();
	}

	
}

