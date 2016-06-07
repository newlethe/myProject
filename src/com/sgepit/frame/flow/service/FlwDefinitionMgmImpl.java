package com.sgepit.frame.flow.service;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.persistence.UniqueConstraint;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwCommonNode;
import com.sgepit.frame.flow.hbm.FlwCommonNodeFiles;
import com.sgepit.frame.flow.hbm.FlwCommonNodePath;
import com.sgepit.frame.flow.hbm.FlwDefinition;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.FlwFrame;
import com.sgepit.frame.flow.hbm.FlwNode;
import com.sgepit.frame.flow.hbm.FlwNodePath;
import com.sgepit.frame.flow.hbm.FlwNodePathView;
import com.sgepit.frame.flow.hbm.FlwNodeView;
import com.sgepit.frame.flow.hbm.FlwRoles;
import com.sgepit.frame.flow.hbm.FlwRolesSearch;
import com.sgepit.frame.sysman.hbm.RockRole;
import com.sgepit.frame.util.JdbcUtil;

public class FlwDefinitionMgmImpl extends BaseMgmImpl
    implements FlwDefinitionMgmFacade
{
	private FlowDAO flowDAO;
    private String defBean;
    private String nodeBean;
    private String nodeViewBean;
    private String pathViewBean;
    private String cnodeBean;
    private String cpathBean;
    private String cpathlinkBean;
    private String flwroles;
    public FlwDefinitionMgmImpl()
    {
        defBean = "com.sgepit.frame.flow.hbm.".concat("FlwDefinition");
        nodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwNode");
        nodeViewBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodeView");
        pathViewBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodePathView");
        cnodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNode");
        cpathBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNodePath");
        cpathlinkBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNodePathLink");
        flwroles = "com.sgepit.frame.flow.hbm.".concat("FlwRoles");
    }

    public static FlwDefinitionMgmImpl getFromApplicationContext(ApplicationContext ctx)
    {
        return (FlwDefinitionMgmImpl)ctx.getBean("flwDefinitionMgmImpl");
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#setFlowDAO(com.sgepit.frame.flow.dao.FlowDAO)
	 */
    public void setFlowDAO(FlowDAO flowDAO)
    {
        this.flowDAO = flowDAO;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#parseJsonStr(java.lang.String, java.lang.String, java.lang.String)
	 */
    public UpdateBeanInfo parseJsonStr(String str, String className, String primayKey)
    {
        List beanList = new ArrayList();
        if(str != null)
        {
            JSONArray ja = JSONArray.fromObject(str);
            Set set = ja.getJSONObject(0).keySet();
            List pkValueList = new ArrayList();
            for(int i = 0; i < ja.size(); i++)
            {
                JSONObject obj = ja.getJSONObject(i);
                if(obj.containsKey(primayKey))
                    pkValueList.add(obj.getString(primayKey));
                else
                    pkValueList.add(null);
            }

            try
            {
                beanList = JSONArray.toList(ja, Class.forName(className));
            }
            catch(ClassNotFoundException e)
            {
                e.printStackTrace();
            }
            return new UpdateBeanInfo(set, beanList, pkValueList);
        } else
        {
            return null;
        }
    }

    /**	保存普通节点方法
     * @param flag	是否是新增节点
     * @param flowid
     * @param nodeid
     * @param xmlName
     * @param cnodePaths
     * @param cnodes	普通节点对象（前台传来的json串格式）
     * @return
     */
    public int saveFlwCommonNode(boolean flag, String flowid, String nodeid, String xmlName, String cnodePaths, String cnodes){
        try{
        	FlwDefinition flwDef = (FlwDefinition)this.flowDAO.findById(this.defBean, flowid);
            FlwNode node = (FlwNode)this.flowDAO.findByWhere2(this.nodeBean, "flowid='" + flowid + "' and nodeid='" + nodeid + "'").get(0);
            node.setFlwDefinition(flwDef);
            node.setXmlname(xmlName);
            this.flowDAO.saveOrUpdate(node);

            UpdateBeanInfo ubi1 = parseJsonStr(cnodes, this.cnodeBean, "condeid");
            List cnodeTempList = ubi1.beanList;
            FlwCommonNode cnode;
            for (Iterator iterator = cnodeTempList.iterator(); iterator.hasNext(); this.flowDAO.saveOrUpdate(cnode)) {
            	cnode = (FlwCommonNode)iterator.next();
            }
            
            if ((cnodePaths != null) && (cnodePaths.length() > 0) && (!cnodePaths.equals("[]"))) {
//          先删除已经有的路径信息
            	List<FlwCommonNodePath> cpathList = this.flowDAO.findByWhere(FlwCommonNodePath.class.getName(), "flowid = '" + flowid + "' and nodeid='" + nodeid + "'");
            	this.flowDAO.deleteAll(cpathList);
            	
            	UpdateBeanInfo ubi2 = parseJsonStr(cnodePaths, this.cpathBean, "cpathid");
            	List cnodePathTempList = ubi2.beanList;
            	FlwCommonNodePath cpath;
            	for (Iterator iterator = cnodePathTempList.iterator(); iterator.hasNext(); this.flowDAO.saveOrUpdate(cpath))
            	{
	                FlwCommonNodePath o = (FlwCommonNodePath)iterator.next();
	                cpath = new FlwCommonNodePath();
	                cpath.setFlowid(o.getFlowid());
	                cpath.setStartid(o.getStartid());
	                cpath.setEndid(o.getEndid());
	                cpath.setStarttype(o.getStarttype());
	                cpath.setNodeid(nodeid);
            	}
            }
            List cPathLinkList = this.flowDAO.findByWhere(this.cpathlinkBean, "flowid = '" + flowid + "'");
            this.flowDAO.deleteAll(cPathLinkList);
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return 1;
        }
        return 0;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#saveFlwDefGuide(java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
    public int saveFlwDefGuide(String flowid, String flwTitle, String xmlName, String nodePaths, String nodes, String userBelongUnitid)
    {
        try
        {
        	FlwDefinition flwDef;
            if("".equals(flowid))
                flwDef = new FlwDefinition();
            else
                flwDef = (FlwDefinition)flowDAO.findById(defBean, flowid);
            flwDef.setFlowtitle(flwTitle);
            flwDef.setXmlname(xmlName);
            flwDef.setState("0");
            flwDef.setUnitid(userBelongUnitid);
            flowDAO.saveOrUpdate(flwDef);
            
            
            UpdateBeanInfo ubi2 = parseJsonStr(nodes, nodeViewBean, "nodeid");
            List nodeTempList = ubi2.beanList;
            FlwNode node;
            for(Iterator iterator = nodeTempList.iterator(); iterator.hasNext(); flowDAO.saveOrUpdate(node))
            {
                FlwNodeView obj = (FlwNodeView)iterator.next();
                node = (FlwNode) flowDAO.findById("com.sgepit.frame.flow.hbm.FlwNode", obj.getNodeid());
                if (node == null) {
                	node = new FlwNode();
                }
                String funid="";
                if("null".equals(obj.getFunid())){
                	funid="\"null\"" ;
                	node.setFunid(funid);
                }else{
                	node.setFunid(obj.getFunid());
                }
                node.setHandler(obj.getHandler());
                node.setName(obj.getName());
                node.setNodeid(obj.getNodeid());
                node.setRole(obj.getRole());
                node.setType(obj.getType());
                //处理人类型：S表示普通，P表示流程发起人
                node.setIstopromoter(obj.getIstopromoter());
                node.setFlwDefinition(flwDef);
            }

            if(!"".equals(flowid))
                delNodePath(flowid);
            UpdateBeanInfo ubi1 = parseJsonStr(nodePaths, pathViewBean, "pathid");
            List nodePathTempList = ubi1.beanList;
            FlwNodePath nodePath;
            for(Iterator iterator = nodePathTempList.iterator(); iterator.hasNext(); flowDAO.saveOrUpdate(nodePath))
            {
                FlwNodePathView obj = (FlwNodePathView)iterator.next();
                nodePath = new FlwNodePath();
                nodePath.setStartid(obj.getStartid());
                nodePath.setStartType(obj.getStartType());
                nodePath.setEndid(obj.getEndid());
                nodePath.setFlwDefinition(flwDef);
            }

        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return 1;
        }
        return 0;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#createXML(java.lang.String, java.lang.String)
	 */
    public String createXML(String xml, String name)
        throws IOException
    {
        String fileName;
        RandomAccessFile raf;
        UUID uuid = UUID.randomUUID();
        fileName = "".equals(name) ? uuid.toString() : name;
        String path = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").concat(fileName).concat(".xml").replace("\\", "/");
        File file = new File(path);
        raf = new RandomAccessFile(file, "rw");
        try
        {
            raf.write(xml.getBytes("UTF-8"));
        }
        catch(IOException e)
        {
            e.printStackTrace();
            throw e;
        }
        raf.close();
        return fileName;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteXML(java.lang.String)
	 */
    public void deleteXML(String xml)
    {
    	  String path = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").concat(xml).replace("\\", "/");
		  File file = new File(path);
		  if(file.exists())
            file.delete();
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#stopFlow(java.lang.String)
	 */
    public void stopFlow(String flowid)
    {
        FlwDefinition def = (FlwDefinition)flowDAO.findById(defBean, flowid);
        def.setFrameid("");
        def.setState("1");
        flowDAO.saveOrUpdate(def);
    }

    private void delNodePath(String flowid)
    {
        FlwDefinition def = (FlwDefinition)flowDAO.findById(defBean, flowid);
        FlwNodePath path;
        for(Iterator iterator = def.getFlwNodePaths().iterator(); iterator.hasNext(); flowDAO.delete(path))
            path = (FlwNodePath)iterator.next();

    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#changeFlowFrame(java.lang.String, java.lang.String)
	 */
    public void changeFlowFrame(String flowid, String frameid)
    {
        FlwDefinition def = (FlwDefinition)flowDAO.findById(defBean, flowid);
        def.setFrameid(frameid);
        
        if(frameid!=null&&!(frameid.equals(""))){
        	String isyp = def.getIsyp()!=null&&def.getIsyp().equals("1")?"1":"0";
        	if(isyp.equals("1")){
        		FlwFrame flwFrame = (FlwFrame)flowDAO.findById("com.sgepit.frame.flow.hbm.".concat("FlwFrame"), frameid);
        		flwFrame.setIsyp("1");
        		flowDAO.saveOrUpdate(flwFrame);
        	}
        }
        flowDAO.saveOrUpdate(def);
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#saveBKToNode(java.lang.String[][])
	 */
    public boolean saveBKToNode(String nodeList[][])
    {
        boolean flag = false;
        try
        {
            for(int i = 0; i < nodeList.length; i++)
            {
                String flowid = nodeList[i][0];
                String nodeid = nodeList[i][1];
                String bookmark = nodeList[i][2];
                List list = flowDAO.findByWhere2(nodeBean, (new StringBuilder("flowid='")).append(flowid).append("' and nodeid='").append(nodeid).append("'").toString());
                if(!list.isEmpty())
                {
                    FlwNode node = (FlwNode)list.get(0);
                    node.setBookmark(bookmark);
                    flowDAO.saveOrUpdate(node);
                }
            }

            flag = true;
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return false;
        }
        return flag;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#saveBKToCommon(java.lang.String[][])
	 */
    public boolean saveBKToCommon(String commonList[][])
    {
        boolean flag = false;
        try
        {
            for(int i = 0; i < commonList.length; i++)
            {
                String flowid = commonList[i][0];
                String nodeid = commonList[i][1];
                String bookmark = commonList[i][2];
                String cnodeid = commonList[i][3];
                List list = flowDAO.findByWhere2(cnodeBean, (new StringBuilder("flowid='")).append(flowid).append("' and nodeid='").append(nodeid).append("' and cnodeid='").append(cnodeid).append("'").toString());
                if(!list.isEmpty())
                {
                    FlwCommonNode cnode = (FlwCommonNode)list.get(0);
                    cnode.setBookmark(bookmark);
                    flowDAO.saveOrUpdate(cnode);
                }
            }

            flag = true;
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return false;
        }
        return flag;
    }

	public String getFlwRolws(String flowid) {
//		发起流程权限查询
		Map<String,String> selectRole = new HashMap<String,String>();
		FlwRoles flwrolesHbm = (FlwRoles) flowDAO.findById(flwroles, flowid);
		if(flwrolesHbm!=null&&flwrolesHbm.getRolename()!=null){
			String rolesStr = flwrolesHbm.getRolename();
			String[] roleArr = rolesStr.split(",");
			for(String roleid : roleArr){
				if(!roleid.equals("")){
					selectRole.put(roleid, null);
				}
			}
		}
//		流程查询权限
		Map<String,String> selectSearchRole = new HashMap<String,String>();
		FlwRolesSearch flwrolesSearchHbm = (FlwRolesSearch) flowDAO.findById(FlwRolesSearch.class.getName(), flowid);
		if(flwrolesSearchHbm!=null&&flwrolesSearchHbm.getRolename()!=null){
			String rolesStr = flwrolesSearchHbm.getRolename();
			String[] roleArr = rolesStr.split(",");
			for(String roleid : roleArr){
				if(!roleid.equals("")){
					selectSearchRole.put(roleid, null);
				}
			}
		}
		
		List rlist = flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.RockRole", "1=1");
		StringBuilder sb = new StringBuilder();
		sb .append("[");
		String comma = "";
		for(Iterator it=rlist.iterator();it.hasNext();){
			RockRole rolehbm = (RockRole) it.next();
			Map map = new HashMap();    
			map.put("roleid",rolehbm.getRolepk());     
			map.put("rolename",rolehbm.getRolename());     
			map.put("selectStart", (selectRole.containsKey(rolehbm.getRolepk())?Boolean.TRUE:Boolean.FALSE));     
			map.put("selectSearch", (selectSearchRole.containsKey(rolehbm.getRolepk())?Boolean.TRUE:Boolean.FALSE));     
			JSONObject jsonObject = JSONObject.fromObject( map );   
			sb.append(comma).append(JSONObject.fromObject(map));
			comma = ",";
		}
		sb.append("]");
		return sb.toString();
	}

	/**
	 * 设置流程的起草权限及查询权限
	 * @param flowid
	 * @param roles			起草权限
	 * @param rolesSearch	查询权限
	 * @return
	 */
	public boolean setFlwRolws(String flowid, String roles, String rolesSearch) {
		try{
//			起草权限
			FlwRoles flwrolesHbm = (FlwRoles) flowDAO.findById(flwroles, flowid);
			if(flwrolesHbm==null){
				(new JdbcTemplate(Constant.DATASOURCE)).execute(
					"insert into FLW_ROLES (ID,ROLENAME) VALUES ('"+flowid+"','"+roles+"')");
			}else{
				if(roles.equals("")){
					(new JdbcTemplate(Constant.DATASOURCE)).execute(
							"delete from FLW_ROLES where ID='"+flowid+"'");
				}else{
					(new JdbcTemplate(Constant.DATASOURCE)).execute(
							"update FLW_ROLES set ROLENAME='"+roles+"' where ID='"+flowid+"'");
				}
			}
			
//			查询权限
			FlwRolesSearch flwrolesSearchHbm = (FlwRolesSearch) flowDAO.findById(FlwRolesSearch.class.getName(), flowid);
			if(flwrolesSearchHbm==null){
				(new JdbcTemplate(Constant.DATASOURCE)).execute(
					"insert into FLW_ROLES_SEARCH (ID,ROLENAME) VALUES ('"+flowid+"','"+rolesSearch+"')");
			}else{
				if(rolesSearch.equals("")){
					(new JdbcTemplate(Constant.DATASOURCE)).execute(
							"delete from FLW_ROLES_SEARCH where ID='"+flowid+"'");
				}else{
					(new JdbcTemplate(Constant.DATASOURCE)).execute(
							"update FLW_ROLES_SEARCH set ROLENAME='"+rolesSearch+"' where ID='"+flowid+"'");
				}
			}
		}catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
		return true;
	}
	
	/**
	 * 设置流程的适用单位
	 * @param flowid
	 * @param unitIds
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 22, 2011
	 */
	public boolean setFlwRangeUnit(String flowid, String unitIds) {
		String deleteSql = "delete from flw_definition_range where unitid not in " +
				"(select unitid from rock_user where userid in " +
					"(select distinct fromnode from flw_log t where insid in" +
					" (select insid from flw_instance where flowid = '" + flowid + "') and ftype = '7A'))" +
					" and flowid = '" + flowid + "'";
		JdbcUtil.execute(deleteSql);
		String[] unitidArr = unitIds.split("`");
		for (int i = 0; i < unitidArr.length; i++) {
			String unitid = unitidArr[i];
			String mergeSql = "merge into flw_definition_range t1" +
					" using (select '" + unitid + "' unitid, '" + flowid + "' flowid from dual) t2" +
					" on (t1.unitid=t2.unitid and t1.flowid=t2.flowid)" +
					" when not matched then " +
					" insert (unitid, flowid) values('" + unitid + "', '" + flowid + "')";
			JdbcUtil.execute(mergeSql);
		}
		return true;
	}
	
	/**
	 * 获取流程设置的适用范围
	 * @param flowid
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 22, 2011
	 */
	public String getFlwRangeUnit(String flowid) {
		String selSql = "select unitid from flw_definition_range where flowid='" + flowid + "'";
		List list = JdbcUtil.query(selSql);
		String unitIds = "";
		for (int i = 0; i < list.size(); i++) {
			unitIds += "`" + ((Map<String, String>)list.get(i)).get("unitid");
		}
		if (unitIds.length()>0) {
			unitIds = unitIds.substring(1);
		}
		return unitIds;
	}
	
	
	/**
	 * 根据当前关键节点初始化普通节点文档读写权限配置
	 * @param nodeid 当前关键节点id
	 * @return
	 * @author zhangh 2012-08-02
	 */
	public String initCommonNodeFileType(String nodeid){
		FlwNode node = (FlwNode) this.flowDAO.findById(FlwNode.class.getName(), nodeid);
		if(node == null) return "当前关键节点不存在，请检测后重新设置！";
		String where = "nodeid = '"+node.getNodeid()+"'";
		List<FlwFiles> flwFilesList = this.flowDAO.findByWhere(FlwFiles.class.getName(), where);
		if(flwFilesList == null || flwFilesList.size() == 0) return "当前关键节点下还没有文档，请先上传文档！";
		List<FlwCommonNode> cnodeList = this.flowDAO.findByWhere(FlwCommonNode.class.getName(), where);
		if(cnodeList == null || cnodeList.size() == 0) return "当前关键节点下还没有普通节点，不需要设置！";
		
		for (int i = 0; i < cnodeList.size(); i++) {
			FlwCommonNode cnode = cnodeList.get(i);
			where = "cnodeid = '"+cnode.getCnodeid()+"' and nodeid = '"+node.getNodeid()+"'";
			List<FlwCommonNodeFiles> cnodeFilesList = this.flowDAO.findByWhere(FlwCommonNodeFiles.class.getName(), where);
			if(cnodeFilesList.size()>0) continue;
			FlwCommonNodeFiles cnodeFiles = new FlwCommonNodeFiles();
			cnodeFiles.setNodeid(cnode.getNodeid());
			cnodeFiles.setCnodeid(cnode.getCnodeid());
			cnodeFiles.setFileid(flwFilesList.get(0).getFileid());
			cnodeFiles.setFlowid(cnode.getFlowid());
			cnodeFiles.setReadtype("0");
			this.flowDAO.insert(cnodeFiles);
		}
		return "";
	}
	
	/**
	 * 保存普通节点文档读写权限配置
	 * @param cnodeFiles
	 * @return
	 * @author zhangh 2012-08-03
	 */
	@SuppressWarnings("unchecked")
	public String saveCommonNodeFileType(FlwCommonNodeFiles[] cnodeFilesArr){
		for (int i = 0; i < cnodeFilesArr.length; i++) {
			FlwCommonNodeFiles cnodeFiles = cnodeFilesArr[i];
			String where = "nodeid = '"+cnodeFiles.getNodeid()+"'";
			List<FlwFiles> flwFilesList = this.flowDAO.findByWhere(FlwFiles.class.getName(), where);
			if(flwFilesList == null || flwFilesList.size() == 0)continue;
			cnodeFiles.setFileid(flwFilesList.get(0).getFileid());
			this.flowDAO.saveOrUpdate(cnodeFiles);
		}
		return "OK";
	}
	
}
