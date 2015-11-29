package com.sgepit.frame.flow.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwDefinition;
import com.sgepit.frame.flow.hbm.FlwFace;
import com.sgepit.frame.flow.hbm.FlwFaceParams;
import com.sgepit.frame.flow.hbm.FlwFaceParamsIns;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.FlwFrame;
import com.sgepit.frame.flow.hbm.FlwRoles;
import com.sgepit.frame.flow.hbm.FlwRolesSearch;
import com.sgepit.frame.flow.hbm.TaskView;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.hbm.RockRole2user;
import com.sgepit.frame.util.JdbcUtil;

public class FlwFrameMgmImpl extends BaseMgmImpl
    implements FlwFrameMgmFacade
{
	private FlowDAO flowDAO;
    private String frameBean;
    private String defBean;
    private String fileBean;
    private String faceBean;
    private String paramBean;
    private String nodeViewBean;
    private String paramInsBean;
    private String flwroles;
    
    public FlwFrameMgmImpl()
    {
        frameBean = "com.sgepit.frame.flow.hbm.".concat("FlwFrame");
        defBean = "com.sgepit.frame.flow.hbm.".concat("FlwDefinition");
        fileBean = "com.sgepit.frame.flow.hbm.".concat("FlwFiles");
        faceBean = "com.sgepit.frame.flow.hbm.".concat("FlwFace");
        paramBean = "com.sgepit.frame.flow.hbm.".concat("FlwFaceParams");
        nodeViewBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodeView");
        paramInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwFaceParamsIns");
        flwroles = "com.sgepit.frame.flow.hbm.".concat("FlwRoles");
    }

    public static FlwFrameMgmImpl getFromApplicationContext(ApplicationContext ctx)
    {
        return (FlwFrameMgmImpl)ctx.getBean("flwFrameMgm");
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#setFlowDAO(com.sgepit.frame.flow.dao.FlowDAO)
	 */
    public void setFlowDAO(FlowDAO flowDAO)
    {
        this.flowDAO = flowDAO;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#saveOrUpdateFlwFrame(java.lang.String, java.lang.String)
	 */
    public boolean saveOrUpdateFlwFrame(String frameid, String framename, String unitid)
        throws SQLException, BusinessException
    {
        
    	FlwFrame frame = "".equals(frameid) ? new FlwFrame() : (FlwFrame)flowDAO.findById(frameBean, frameid);
        frame.setFramename(framename);
        frame.setUnitid(unitid);
        flowDAO.saveOrUpdate(frame);
        return true;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteFlwFrame(java.lang.String, boolean)
	 */
    public void deleteFlwFrame(String frameid, boolean flag)
    {
        if(flag)
        {
            List defList = flowDAO.findByWhere2(defBean, (new StringBuilder("frameid = '")).append(frameid).append("'").toString());
            FlwDefinition def;
            for(Iterator iterator = defList.iterator(); iterator.hasNext(); flowDAO.saveOrUpdate(def))
            {
                def = (FlwDefinition)iterator.next();
                def.setFrameid("");
            }

        }
        FlwFrame frame = (FlwFrame)flowDAO.findById(frameBean, frameid);
        flowDAO.delete(frame);
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#checkIsUploadDoc(java.lang.String, java.lang.String)
	 */
    public String checkIsUploadDoc(String flowid, String fileid)
    {
        List list = flowDAO.findByWhere2(fileBean, (new StringBuilder("flowid='")).append(flowid).append("' and nodeid='").append(fileid).append("'").toString());
        return list.isEmpty() ? "" : ((FlwFiles)list.get(0)).getFileid();
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#addOrUpdateFlwFace(com.sgepit.frame.flow.hbm.FlwFace)
	 */
    public int addOrUpdateFlwFace(FlwFace flwFace)
    {
        int flag = 0;
        try
        {
        	if(flwFace.getFaceid().equals(""))
                flowDAO.insert(flwFace);
            else
                flowDAO.saveOrUpdate(flwFace);
        }
        catch(RuntimeException e)
        {
            flag = 1;
            e.printStackTrace();
        }
        return flag;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteFlwFace(java.lang.String)
	 */
    public String deleteFlwFace(String faceid)
    {
        String msg = "";
        List list = flowDAO.findByWhere2(nodeViewBean, (new StringBuilder("funid='")).append(faceid).append("'").toString());
        if(list.isEmpty())
        {
            FlwFace flwFace = (FlwFace)flowDAO.findById(faceBean, faceid);
            List paramsList = flowDAO.findByWhere2(paramBean, (new StringBuilder("faceid='")).append(faceid).append("'").toString());
            flowDAO.deleteAll(paramsList);
            flowDAO.delete(flwFace);
        } else
        {
            msg = "该流程接口方法已被关键节点使用，不能删除！";
        }
        return msg;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#addOrUpdateFlwFaceParams(com.sgepit.frame.flow.hbm.FlwFaceParams)
	 */
    public int addOrUpdateFlwFaceParams(FlwFaceParams flwFaceParams)
    {
        int flag = 0;
        try
        {
            if(flwFaceParams.getParamid().equals(""))
                flowDAO.insert(flwFaceParams);
            else
                flowDAO.saveOrUpdate(flwFaceParams);
        }
        catch(RuntimeException e)
        {
            flag = 1;
            e.printStackTrace();
        }
        return flag;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteFlwFaceParams(java.lang.String)
	 */
    public String deleteFlwFaceParams(String paramid)
    {
        String msg = "";
        FlwFaceParams flwFaceParams = (FlwFaceParams)flowDAO.findById(paramBean, paramid);
        flowDAO.delete(flwFaceParams);
        return msg;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#insertFaceParamsIns(java.lang.String, java.lang.String, java.lang.String)
	 */
    public void insertFaceParamsIns(String insid, String nodeid, String paramvalues)
    {
        String strWhere = (new StringBuilder("insid='")).append(insid).append("' and nodeid='").append(nodeid).append("'").toString();
        List list = flowDAO.findByWhere2(paramInsBean, strWhere);
        FlwFaceParamsIns paramsIns;
        if(list.isEmpty())
            paramsIns = new FlwFaceParamsIns();
        else
            paramsIns = (FlwFaceParamsIns)list.get(0);
        paramsIns.setInsid(insid);
        paramsIns.setNodeid(nodeid);
        paramsIns.setParamvalues(paramvalues);
        flowDAO.saveOrUpdate(paramsIns);
    }
    
    /**
     * 更新流程的业务参数： 
     * @param insid	流程实例ID
     * @param nodeid 流程节点ID
     * @param paramvalues	需要变更的参数： 格式为：param1:value1`param2:value2;
     * @author: Liuay
     * @createDate: Aug 2, 2011
     */
    public void updateFaceParamsIns (String insid, String nodeid, String paramvalues) {
    	String oldParamValues = "";
    	FlwFaceParamsIns faceParamsIns = null;
    	String strWhere = (new StringBuilder("insid='")).append(insid).append("' and nodeid='").append(nodeid).append("'").toString();
        List list = flowDAO.findByWhere2(paramInsBean, strWhere);
        
        if (list.size() == 1) {
        	faceParamsIns = (FlwFaceParamsIns)list.get(0);
        	oldParamValues = faceParamsIns.getParamvalues();
        	
        	if (paramvalues!=null && paramvalues.length()>0 && oldParamValues!=null && oldParamValues.length()>0) {
        		String[] oldParamValArr = oldParamValues.split("`");
        		String[] newParamValArr = paramvalues.split("`");
        		for (int i = 0; i < newParamValArr.length; i++) {
        			String[] tempArr = newParamValArr[i].split(":");
        			String newParam = tempArr[0];
        			String newVal = tempArr[1];
        			for (int j = 0; j < oldParamValArr.length; j++) {
        				String temp = oldParamValArr[j];
        				if (oldParamValArr[j].indexOf(newParam + ":")==0) {
        					oldParamValArr[j] = newParam + ":" + newVal + temp.substring(temp.lastIndexOf(":"));
        					break;
        				}
        			}
        		}
        		String newParamValues = StringUtils.join(oldParamValArr, "`");
        		System.out.println("newest Param values:: " + newParamValues);
        		
        		faceParamsIns.setParamvalues(newParamValues);
        		flowDAO.saveOrUpdate(faceParamsIns);
			}
        }
    }
    
    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#getFaceParamsIns(java.lang.String, java.lang.String, java.lang.String)
	 */
    public String getFaceParamsIns(String insid, String nodeid)
    {
        String paramvalues = "";
    	String strWhere = (new StringBuilder("insid='")).append(insid).append("' and nodeid='").append(nodeid).append("'").toString();
        List list = flowDAO.findByWhere2(paramInsBean, strWhere);
        if (list.size() == 1) {
        	paramvalues = ((FlwFaceParamsIns)list.get(0)).getParamvalues();
        }
        return paramvalues;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteFaceParamsIns(java.lang.String, java.lang.String)
	 */
    public void deleteFaceParamsIns(String insid, String nodeid)
    {
        String strWhere = (new StringBuilder("insid='")).append(insid).append("' and nodeid='").append(nodeid).append("'").toString();
        List list = flowDAO.findByWhere2(paramInsBean, strWhere);
        if(!list.isEmpty())
            flowDAO.deleteAll(list);
        strWhere.split("s");
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#checkIsUploadSign(java.lang.String)
	 */
    public boolean checkIsUploadSign(String userid)
    {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
        List list = jdbcTemplate.queryForList((new StringBuilder("select * from App_BLOB where FILEID='")).append(userid).append("'").toString());
        return !list.isEmpty();
    }
    
    /**
     * 查找用户签名盖章图片是否已经上传
     * @param userid
     * @return
     * @author zhangh 2013-11-06
     */
    public boolean checkIsUploadStamp(String userid,String order){
        List list = flowDAO.findByWhere(AppFileinfo.class.getName(), "businessid like '"+userid+"-"+order+"'");
        return !list.isEmpty();
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#getTableColumns(java.lang.String)
	 */
    public List getTableColumns(String tabName)
    {
        JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
        StringBuilder sb = new StringBuilder();
        sb.append("select COLUMN_NAME,DATA_TYPE,DATA_PRECISION,DATA_LENGTH,DATA_SCALE,NULLABLE ");
        sb.append("from user_tab_columns ");
        sb.append((new StringBuilder("where table_name = '")).append(tabName.toUpperCase()).append("'").toString());
        List list = jdbc.queryForList(sb.toString());
        return list;
    }

	public String getFlowTreeByFrameidAndUserid(String frameid, String userid) {
		//查询用户的角色
		List roles = flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.RockRole2user", "userid='"+userid+"'");
		String nodeString = "[]";
		if(roles.size()>0){//该用户有角色
			Map<String,String> roleMap = new HashMap<String,String>();
			for(Iterator it1=roles.iterator();it1.hasNext();){
				RockRole2user roleuserhbm = (RockRole2user) it1.next();
				roleMap.put(roleuserhbm.getRolepk(), null);
			}
			
			String st = "";
			StringBuffer sb = new StringBuffer();
			sb.append("[");
			
			List flwdefList = flowDAO.findByWhere(defBean, "frameid = '"+frameid+"'");
			for(Iterator it2=flwdefList.iterator();it2.hasNext();){
				FlwDefinition flwdefhbm = (FlwDefinition) it2.next();
				
				List rolesList = flowDAO.findByWhere(flwroles, "ID = '"+flwdefhbm.getFlowid()+"')");
				if(rolesList.size()==1){//流程定义了角色
					FlwRoles frHbm = (FlwRoles)rolesList.get(0);
					if(frHbm.getRolename()==null||frHbm.getRolename().equals("")){
						flowDAO.delete(frHbm);
						continue;
					}
					String[] roleArr = frHbm.getRolename().split(",");
					for(String rolepk : roleArr){
						if(roleMap.containsKey(rolepk)){//拥有流程权限
							sb.append(st).append("{id:\"");
							sb.append(flwdefhbm.getFlowid());
							sb.append("\",");
							sb.append("text:\"");
							sb.append(flwdefhbm.getFlowtitle());
							sb.append("\",");
							sb.append("isyp:\"");
							sb.append(flwdefhbm.getIsyp()==null?"0":"1");
							sb.append("\",");
							sb.append("qtip:\"");
							sb.append(flwdefhbm.getFlowtitle());
							sb.append("\",iconCls:\"flow\",type:\"flow\"}");
							st=",";
							break;
						}
					}
				}
			}
			sb.append("]");
			nodeString = sb.toString();
		}
		return nodeString;
	}
	@SuppressWarnings("unchecked")
	public String getFlowTreeByFrameid(String frameid){
		String st = "";
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		
		List flwdefList = flowDAO.findByWhere(defBean, "frameid = '"+frameid+"'");
		for(Iterator it2=flwdefList.iterator();it2.hasNext();){
			FlwDefinition flwdefhbm = (FlwDefinition) it2.next();
			sb.append(st).append("{id:\"");
			sb.append(flwdefhbm.getFlowid());
			sb.append("\",");
			sb.append("text:\"");
			sb.append(flwdefhbm.getFlowtitle());
			sb.append("\",");
			sb.append("qtip:\"");
			sb.append(flwdefhbm.getFlowtitle());
			sb.append("\",iconCls:\"flow\",type:\"flow\"}");
			st=",";
		}
		sb.append("]");
		return sb.toString();
	}
	/**
	 * 业务流程结构树获取，使用Ext.tree.DWRTreeLoader
	 * @param frameid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<TreeNode> getFlowTreeNodeById(String frameid){
		List<TreeNode> list = new ArrayList<TreeNode>();
		try{
			String parent = frameid != null && !frameid.equals("") ? frameid : "root";
			
			if(parent.equals("root")){
				String sql = "select t.frameid,t.framename, (select count(t1.flowid) from flw_definition t1 where t1.frameid=t.frameid) childs " +
						     "from FLW_FRAME t";
				List lt = flowDAO.getDataAutoCloseSes(sql);
				for(Iterator it=lt.iterator();it.hasNext();){
					Object[] objects = (Object[]) it.next();
					String id = (String) objects[0];
					String text = (String) objects[1];
					int childs = ((java.math.BigDecimal)objects[2]).intValue();
					
					TreeNode tn = new TreeNode();
					tn.setId(id);
					tn.setText(text);
					tn.setDescription(text);
					tn.setIconCls("folder");
					tn.setLeaf((childs>0?false:true));
					tn.setNodeType("document");
					list.add(tn);
				}
			}else{
				List lt = flowDAO.findByWhere(defBean, "frameid = '"+frameid+"'");
				for(Iterator it=lt.iterator();it.hasNext();){
					FlwDefinition flwdefhbm = (FlwDefinition) it.next();
					TreeNode tn = new TreeNode();
					tn.setId(flwdefhbm.getFlowid());
					tn.setText(flwdefhbm.getFlowtitle());
					tn.setDescription(flwdefhbm.getFlowtitle());
					tn.setIconCls("flow");
					tn.setLeaf(true);
					tn.setNodeType("flow");
					list.add(tn);
				}
			}
		}catch(Exception ex){
			ex.printStackTrace();
		}
		return list;
	}
	/**
	 * 业务流程结构树获取(权限过滤)，使用Ext.tree.DWRTreeLoader
	 * @param frameid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<TreeNode> getFlowTreeNodeByIdAndRole(String frameid){
		WebContext wc = WebContextFactory.get(); 
		String userid = (String) wc.getSession().getAttribute(com.sgepit.frame.base.Constant.USERID);
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parentId = frameid != null && !frameid.equals("") ? frameid : "root";
		String filterFlowBy = "UNIT";
		
		WebContext webContext = WebContextFactory.get(); 
	    HttpSession session = webContext.getSession() ;
	    String userBelongUnitid = (String)session.getAttribute(Constant.USERBELONGUNITID);
		
		try{
			List<RockRole2user> role2userList = flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.RockRole2user", "userid='"+userid+"'");
			if(role2userList.size()>0){//该用户有角色
				if(parentId.equals("root")){
					String sql = "select t.frameid,t.framename, (select count(t1.flowid) from flw_definition t1 where " +
							     "t1.frameid=t.frameid) childs from FLW_FRAME t";
					List lt = flowDAO.getDataAutoCloseSes(sql);
					for(Iterator it=lt.iterator();it.hasNext();){
						Object[] objects = (Object[]) it.next();
						String id = (String) objects[0];
						String text = (String) objects[1];
						int childs = ((java.math.BigDecimal)objects[2]).intValue();
						
						TreeNode tn = new TreeNode();
						tn.setId(id);
						tn.setText(text);
						tn.setDescription(text);
						tn.setIconCls("folder");
						tn.setLeaf((childs>0?false:true));
						tn.setNodeType("document");
						list.add(tn);
					}
				}else{
//					Modified by Liuay 2011-07-26 一般的流程发起页面，不显示质量验评的流程
					List lt = flowDAO.findByWhere(defBean, "frameid = '"+frameid+"' and (isyp is null or isyp='0')");
//					Modified by Liuay 2011-07-26【end】
					for(Iterator it=lt.iterator();it.hasNext();){
						FlwDefinition flwdefhbm = (FlwDefinition) it.next();
						List rolesList = flowDAO.findByWhere(flwroles, "ID = '"+flwdefhbm.getFlowid()+"')");
						if(rolesList.size()>0){//流程定义了角色
							FlwRoles frHbm = (FlwRoles)rolesList.get(0);
							if(frHbm.getRolename()==null||frHbm.getRolename().equals("")){
								flowDAO.delete(frHbm);
								continue;
							}
							String flwRole =  frHbm.getRolename();
							
//							Modified by Liuay 2011-07-25 流程发起按照角色、单位过滤；
							boolean hasThisRight = true;
							String flowRangeUnitIds = "";
							if (filterFlowBy.equals("UNIT")) {
								String sql1 = "select unitid from flw_definition_range where flowid='" + flwdefhbm.getFlowid() + "'";
								List unitRangeList = JdbcUtil.query(sql1);
								for (int i = 0; i < unitRangeList.size(); i++) {
									flowRangeUnitIds += "`" + ((Map<String, String>)unitRangeList.get(i)).get("unitid");
								}
								if (flowRangeUnitIds.length()==0 || (flowRangeUnitIds.length()>0 && (flowRangeUnitIds+"`").indexOf("`" + userBelongUnitid + "`")==-1)) {
									hasThisRight = false;
								}
							}
//							Modified by Liuay 2011-07-25【end】
							
//							Modified by Liuay 2011-07-26 当前用户在流程的使用单位范围内或者当前用户在流程定义的单位下
							if (hasThisRight || userBelongUnitid.equals(flwdefhbm.getUnitid())) {
								for(RockRole2user role2user : role2userList){
									if(flwRole.indexOf((role2user.getRolepk()))>-1){//拥有流程权限
										TreeNode tn = new TreeNode();
										tn.setId(flwdefhbm.getFlowid());
										tn.setText(flwdefhbm.getFlowtitle());
										tn.setDescription(flwdefhbm.getFlowtitle());
										tn.setIconCls("flow");
										tn.setLeaf(true);
										tn.setNodeType("flow");
										list.add(tn);
										break;
									}
								}
							}
						}
					}
				}
			}
		}catch(Exception ex){
			ex.printStackTrace();
		}
		return list;
	}
	
	/**
	 * 流程查询权限的流程树结构
	 * 
	 * @param frameid	流程文件夹ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-7-13
	 */
	public List<TreeNode> getFlowTreeNodeByIdAndSearchRole(String frameid){
		WebContext wc = WebContextFactory.get(); 
		String userid = (String) wc.getSession().getAttribute(com.sgepit.frame.base.Constant.USERID);
		List<TreeNode> list = new ArrayList<TreeNode>();
		String parentId = frameid != null && !frameid.equals("") ? frameid : "root";
		
		try{
			List<RockRole2user> role2userList = flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.RockRole2user", "userid='"+userid+"'");
			
			if(role2userList.size()>0){//该用户有角色
				if(parentId.equals("root")){
					String sql = "select t.frameid,t.framename, (select count(t1.flowid) from flw_definition t1 where " +
							     "t1.frameid=t.frameid) childs from FLW_FRAME t";
					List lt = flowDAO.getDataAutoCloseSes(sql);
					for(Iterator it=lt.iterator();it.hasNext();){
						Object[] objects = (Object[]) it.next();
						String id = (String) objects[0];
						String text = (String) objects[1];
						int childs = ((java.math.BigDecimal)objects[2]).intValue();
						
						TreeNode tn = new TreeNode();
						tn.setId(id);
						tn.setText(text);
						tn.setDescription(text);
						tn.setIconCls("folder");
						tn.setLeaf((childs>0?false:true));
						tn.setNodeType("document");
						list.add(tn);
					}
				}else{
					List lt = flowDAO.findByWhere(defBean, "frameid = '"+frameid+"' ");
//					List lt = flowDAO.findByWhere(defBean, "frameid = '"+frameid+"' and (isyp is null or isyp='0')");
					for(Iterator it=lt.iterator();it.hasNext();){
						FlwDefinition flwdefhbm = (FlwDefinition) it.next();
						List rolesList = flowDAO.findByWhere(FlwRolesSearch.class.getName(), "ID = '"+flwdefhbm.getFlowid()+"')");
						if(rolesList.size()>0){//流程查询权限的角色
							FlwRolesSearch frHbm = (FlwRolesSearch)rolesList.get(0);
							if(frHbm.getRolename()==null||frHbm.getRolename().equals("")){
								flowDAO.delete(frHbm);
								continue;
							}
							String flwRole =  frHbm.getRolename();
							
//							流程查询时，需要根据查询权限进行过滤
							for(RockRole2user role2user : role2userList){
								if(flwRole.indexOf((role2user.getRolepk()))>-1){//拥有流程权限
									TreeNode tn = new TreeNode();
									tn.setId(flwdefhbm.getFlowid());
									tn.setText(flwdefhbm.getFlowtitle());
									tn.setDescription(flwdefhbm.getFlowtitle());
									tn.setIconCls("flow");
									tn.setLeaf(true);
									tn.setNodeType("flow");
									list.add(tn);
									break;
								}
							}
						}
					}
				}
			}
		}catch(Exception ex){
			ex.printStackTrace();
		}
		return list;
	}
	
	/**
	 * 获取所有的查询权限范围内的已处理、未处理流程
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param param
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-7-13
	 */
	public List getFlwInsBySearchRoles(String orderBy, Integer start, Integer limit, HashMap<String, String> param) {
		String flowid = param.get("flowid");
		String frameid = param.get("frameid");
		String userid = param.get("userid");
		String whereStr = param.get("whereStr");
		
		String insql = "";
		
		if(flowid.equals("-1") || flowid.equals("0")) {
//			需要根据查询权限过滤
			List<RockRole2user> role2userList = flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.RockRole2user", "userid='"+userid+"'");
			
			if(role2userList.size()>0){//该用户有角色
//				流程查询时，需要根据查询权限进行过滤
				for(RockRole2user role2user : role2userList){
					insql += " union all select id from flw_roles_search where rolename like '%" + role2user.getRolepk() + "%' ";
				}
			}
			
			if (insql.length()>0) {
				insql = insql.substring(10);
			}
		} 
		
//		如果选择的流程分类，需要根据权限和分类过滤 【树是异步加载，无法在前台过滤】
		String frameInSql = "";
		if (flowid.equals("0")) {
			frameInSql = " and flowid in (select flowid from flw_definition where frameid = '" + frameid + "' )";
		}
		
		if (!flowid.equals("-1") && !flowid.equals("0")) {
			whereStr += " and flowid = '" + flowid + "'";
		}
		
		String sql = "select flowid, logid, insid, flowtitle, title, status, flowno, unit, spec, fromnode, tonode, ftime, ftype, notes, " +
				" flag, nodename, nodeid, toname, orgname, posname, fromname, removeinfo, isyp, xmbh, unitid" +
				" from task_view where " + whereStr;
		
		if (insql.length()>0) {
			sql += " and flowid in (" + insql + ")";
		}
		
		sql += frameInSql;
		
		System.out.println("----" + sql);
		
		Session s = null;
		List l = new ArrayList();
		int size = 0;
		try {
			s = HibernateSessionFactory.getSession();
			SQLQuery q = s.createSQLQuery(sql)
				.addScalar("flowid", Hibernate.STRING)
				.addScalar("logid", Hibernate.STRING)
				.addScalar("insid", Hibernate.STRING)
				.addScalar("flowtitle", Hibernate.STRING)
				.addScalar("title", Hibernate.STRING)
				.addScalar("status", Hibernate.STRING)
				.addScalar("flowno", Hibernate.STRING)
				.addScalar("unit", Hibernate.STRING)
				.addScalar("spec", Hibernate.STRING)
				.addScalar("fromnode", Hibernate.STRING)
				.addScalar("tonode", Hibernate.STRING)
				.addScalar("ftime", Hibernate.TIMESTAMP)
				.addScalar("ftype", Hibernate.STRING)
				.addScalar("notes", Hibernate.STRING)
				.addScalar("flag", Hibernate.STRING)
				.addScalar("nodename", Hibernate.STRING)
				.addScalar("nodeid", Hibernate.STRING)
				.addScalar("toname", Hibernate.STRING)
				.addScalar("orgname", Hibernate.STRING)
				.addScalar("posname", Hibernate.STRING)
				.addScalar("fromname", Hibernate.STRING)
				.addScalar("removeinfo", Hibernate.STRING)
				.addScalar("isyp", Hibernate.STRING)
				.addScalar("xmbh", Hibernate.STRING)
				.addScalar("unitid", Hibernate.STRING);
			size = q.list().size();
			
			q.setFirstResult(start);
			q.setMaxResults(limit);
			l = q.list();
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			s.close();
		}
		
		List returnList = new ArrayList();
		for (int i = 0; i <l.size(); i++) {
			TaskView taskView = new TaskView();
			Object[] objs = (Object[]) l.get(i);
			taskView.setFlowid((String)objs[0]);
			taskView.setLogid((String)objs[1]);
			taskView.setInsid((String)objs[2]);
			taskView.setFlowtitle((String)objs[3]);
			taskView.setTitle((String)objs[4]);
			taskView.setStatus((String)objs[5]);
			taskView.setFlowno((String)objs[6]);
			taskView.setUnit((String)objs[7]);
			taskView.setSpec((String)objs[8]);
			taskView.setFromnode((String)objs[9]);
			taskView.setTonode((String)objs[10]);
			taskView.setFtime((Date)objs[11]);
			taskView.setFtype((String)objs[12]);
			taskView.setNotes((String)objs[13]);
			taskView.setFlag((String)objs[14]);
			taskView.setNodename((String)objs[15]);
			taskView.setNodeid((String)objs[16]);
			taskView.setToname((String)objs[17]);
			taskView.setOrgname((String)objs[18]);
			taskView.setPosname((String)objs[19]);
			taskView.setFromname((String)objs[20]);
			taskView.setRemoveinfo((String)objs[21]);
			taskView.setIsyp((String)objs[22]);
			taskView.setXmbh((String)objs[23]);
			taskView.setUnitid((String)objs[24]);
			
			returnList.add(taskView);
		}
		returnList.add(size);
		
		return returnList;
	}
}
