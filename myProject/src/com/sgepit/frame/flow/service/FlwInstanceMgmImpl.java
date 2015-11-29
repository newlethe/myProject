package com.sgepit.frame.flow.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.map.ListOrderedMap;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwAdjunctIns;
import com.sgepit.frame.flow.hbm.FlwDefinition;
import com.sgepit.frame.flow.hbm.FlwFaceParamsIns;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.FlwFilesIns;
import com.sgepit.frame.flow.hbm.FlwInstance;
import com.sgepit.frame.flow.hbm.FlwLog;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;

public class FlwInstanceMgmImpl extends BaseMgmImpl
    implements FlwInstanceMgmFacade
{
	private FlwBizMgmFacade flwBizMgm;
	private FlowDAO flowDAO;
    private String defBean;
    private String insBean;
    private String fileBean;
    private String fileInsBean;
    private String adjunctInsBean;
    private String faceParamsInsBean;
    private String cnodeBean;
    private String cpathBean;
    private String nodeBean;
    private String pathBean;
    private String logBean;
    private String materialRemove;
    
    public FlwInstanceMgmImpl()
    {
        defBean = "com.sgepit.frame.flow.hbm.".concat("FlwDefinition");
        insBean = "com.sgepit.frame.flow.hbm.".concat("FlwInstance");
        fileBean = "com.sgepit.frame.flow.hbm.".concat("FlwFiles");
        fileInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwFilesIns");
        adjunctInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwAdjunctIns");
        faceParamsInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwFaceParamsIns");
        cnodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNode");
        cpathBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNodePath");
        nodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwNode");
        pathBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodePath");
        logBean = "com.sgepit.frame.flow.hbm.".concat("FlwLog");
        materialRemove = "com.sgepit.frame.flow.hbm.".concat("FlwMaterialRemove");
    }

    public static FlwInstanceMgmImpl getFromApplicationContext(ApplicationContext ctx)
    {
        return (FlwInstanceMgmImpl)ctx.getBean("flwInstanceMgm");
    }
    public void setFlwBizMgm(FlwBizMgmFacade flwBizMgm) {
		this.flwBizMgm = flwBizMgm;
	}

	public void setFlowDAO(FlowDAO flowDAO) {
		this.flowDAO = flowDAO;
	}

	/**
	 * 流程发起 flw.new.action.js
	 * @param defid 定义的流程id 表flw_definition的pk
	 * @param ins 流程实例记录 表flw_instance记录
	 * @param log 流程日志 表flw_log记录
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
    public String insertFlwInstance(String defid, FlwInstance ins, FlwLog log)
        throws SQLException, BusinessException
    {
        String insid = "";
        try
        {
            FlwDefinition def = (FlwDefinition)flowDAO.findById(defBean, defid);//获取流程定义对象
            ins.setFlwDefinition(def);//设置流程实例的flowid
            flowDAO.insert(ins);//插入流程实例记录
            log.setFlwInstance(ins);
            log.setFromnodeid("-1");
            log.setIsresend("0");
            flowDAO.insert(log);//插入日志
            insid = ins.getInsid();
            
            //跨系统流程处理的数据交互
            WebContext webContext = WebContextFactory.get();
            HttpServletRequest request = webContext.getHttpServletRequest() ;
            FlwLogMgmFacade flwLogMgmImpl = (FlwLogMgmFacade)Constant.wact.getBean("flwLogMgm");
            flwLogMgmImpl.flwLogDataExchange(insid, request);
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return insid;
        }
        return insid;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteFlwInstance(java.lang.String)
	 */
    public boolean deleteFlwInstance(String insid)
    {
        try
        {
            FlwInstance instance = (FlwInstance)flowDAO.findById(insBean, insid);
            List adjunctList = flowDAO.findByWhere2(adjunctInsBean, (new StringBuilder("insid='")).append(insid).append("'").toString());
            if(!adjunctList.isEmpty())
            {
                JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
                for(int i = 0; i < adjunctList.size(); i++)
                {
                    String sql = (new StringBuilder("delete APP_BLOB where fileid='")).append(((FlwAdjunctIns)adjunctList.get(i)).getFileid()).append("'").toString();
                    jdbcTemplate.execute(sql);
                }

                flowDAO.deleteAll(adjunctList);
            }
            flowDAO.delete(instance);
        }
        catch(DataAccessException e)
        {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#getTableColumns(java.lang.String, java.lang.String)
	 */
    public ListOrderedMap getTableColumns(String tabName, String where)
        throws Exception
    {
	    return flwBizMgm.getBizData(tabName, where);
    }
    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#deleteFlowIns(java.lang.String)
	 */
    public boolean deleteFlowIns(String insid, boolean isDelBiz)
    {
        try
        {
        	//删除数据交换的内容：
        	WebContext webContext = WebContextFactory.get();
            HttpServletRequest request = webContext.getHttpServletRequest() ;
            String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";
        	SystemMgmFacade systemMgmImpl = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
        	
        	String toUserID = "";
        	RockUser toUser = null;
            SgccIniUnit toUserUnit = null;
            List<SgccIniUnit> toUnitList = new ArrayList<SgccIniUnit>();
            String toUnitIds = "";
            
            List<FlwLog> flwLogList = this.flowDAO.findByWhere(FlwLog.class.getName(), "insid='" + insid + "'");
            for (int i = 0; i < flwLogList.size(); i++) {
            	toUserID = flwLogList.get(i).getTonode();
            	if (toUserID.equalsIgnoreCase("systemuserid")) {
    				continue;
    			}
            	toUser = (RockUser) this.flowDAO.findById(RockUser.class.getName(), toUserID);
                toUserUnit = systemMgmImpl.getBelongUnit(toUser.getUnitid());

                /*	判断跨系统节点的方法：
                 *	1. 流程接收人所属单位的APP_URL不同于不同于当前部署单位的程序地址；
                	2. 系统部署在项目单位，流程处理接收人不在3级单位和项目单位下；
                	2. 系统部署在集团， 流程处理接收人是3级单位或项目单位用户
                 */
                if(toUnitIds.indexOf("`" + toUserUnit.getUnitid() + "`")==-1
                		&& toUserUnit.getAppUrl()!=null && 
                		(!toUserUnit.getAppUrl().toLowerCase().startsWith(appUrl)
                				|| (Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A") && !toUserUnit.getUnitTypeId().equals("A") && !toUserUnit.getUnitTypeId().equals("3")) 
                				|| (Constant.propsMap.get("DEPLOY_UNITTYPE").equals("0") && (toUserUnit.getUnitTypeId().equals("A") || toUserUnit.getUnitTypeId().equals("3"))))) {
                	if(toUnitIds.length()==0) {
                		toUnitIds = "`" + toUserUnit.getUnitid() + "`";
                	} else {
                		toUnitIds += toUserUnit.getUnitid() + "`";
                	}
                	toUnitList.add(toUserUnit);
                }
    		}
            
            FlwInstance instance = (FlwInstance)flowDAO.findById(insBean, insid);
            List removeList = flowDAO.findByWhere(materialRemove, (new StringBuilder()).append("insid='").
            		append(instance.getInsid()).append("'").toString());
            if(!removeList.isEmpty()){
            	flowDAO.deleteAll(removeList);
            }
            
            List fileList = flowDAO.findByWhere2(fileInsBean, (new StringBuilder("insid='")).append(insid).append("'").toString());
            if(!fileList.isEmpty())
            {
                JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
                for(int i = 0; i < fileList.size(); i++)
                {
                    String sql = (new StringBuilder("delete APP_BLOB where fileid='")).append(((FlwFilesIns)fileList.get(i)).getFileid()).append("'").toString();
                    jdbcTemplate.execute(sql);
                    FlwFiles file = (FlwFiles)flowDAO.findById(fileBean, ((FlwFilesIns)fileList.get(i)).getFileid());
                    flowDAO.delete(file);
                }

                flowDAO.deleteAll(fileList);
            }
            List adjunctList = flowDAO.findByWhere2(adjunctInsBean, (new StringBuilder("insid='")).append(insid).append("'").toString());
            if(!adjunctList.isEmpty())
            {
                JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
                for(int i = 0; i < adjunctList.size(); i++)
                {
                    String sql = (new StringBuilder("delete APP_BLOB where fileid='")).append(((FlwAdjunctIns)adjunctList.get(i)).getFileid()).append("'").toString();
                    jdbcTemplate.execute(sql);
                }

                flowDAO.deleteAll(adjunctList);
            }
            
            if(isDelBiz){
            	flwBizMgm.deleteBizIns(insid);
            }
            
            if (!flwLogList.isEmpty()) {
            	flowDAO.deleteAll(flwLogList);
            }
            
            flowDAO.delete(instance);
            
            //跨系统流程处理的数据交互
            FlwLogMgmFacade flwLogMgmImpl = (FlwLogMgmFacade)Constant.wact.getBean("flwLogMgm");
            flwLogMgmImpl.flwLogDataDeleteExchange(insid, toUnitList, request);
        }
        catch(DataAccessException e)
        {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#findFlwInsno(java.lang.String)
	 */
    public String findFlwInsno(String type)
    {
        String flag = "001";
        JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
        String sql = (new StringBuilder("select lpad(max(nvl(substr(flowno,-3),0))+1,3,0) from flw_instance where flowno like '%")).append(type).append("%").append("'").toString();
        flag = (String)jdbc.queryForObject(sql, String.class);
        if(flag == "" || flag == null)
            return flag = "001";
        else
            return flag;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#addConToFaceIns(java.lang.String, java.lang.String)
	 */
    public void addConToFaceIns(String insid, String conno)
    {
        FlwFaceParamsIns fpi = new FlwFaceParamsIns(insid, "null", (new StringBuilder("conno:")).append(conno).append(":string").toString());
        flowDAO.saveOrUpdate(fpi);
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#DEL_FLOW(java.lang.String)
	 */
    public String DEL_FLOW(String flowid)
    {
        List defList = flowDAO.findByWhere2(defBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(defList.isEmpty())
            return (new StringBuilder("没有流程ID：【")).append(flowid).append("】的流程！").toString();
        List insList = flowDAO.findByWhere2(insBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(!insList.isEmpty())
        {
            FlwInstance flwIns;
            for(Iterator iterator = insList.iterator(); iterator.hasNext(); deleteFlowIns(flwIns.getInsid(),true))
                flwIns = (FlwInstance)iterator.next();

        }
        List fileList = flowDAO.findByWhere2(fileBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(!fileList.isEmpty())
        {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
            for(int i = 0; i < fileList.size(); i++)
            {
                String sql = (new StringBuilder("delete APP_BLOB where fileid='")).append(((FlwFiles)fileList.get(i)).getFileid()).append("'").toString();
                jdbcTemplate.execute(sql);
            }

            flowDAO.deleteAll(fileList);
        }
        List cPathList = flowDAO.findByWhere2(cpathBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(!cPathList.isEmpty())
            flowDAO.deleteAll(cPathList);
        List cNodeList = flowDAO.findByWhere2(cnodeBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(!cNodeList.isEmpty())
            flowDAO.deleteAll(cNodeList);
        List pathList = flowDAO.findByWhere2(pathBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(!pathList.isEmpty())
            flowDAO.deleteAll(pathList);
        List nodeList = flowDAO.findByWhere2(nodeBean, (new StringBuilder("flowid='")).append(flowid).append("'").toString());
        if(!nodeList.isEmpty())
            flowDAO.deleteAll(nodeList);
        FlwDefinition flwDef = (FlwDefinition)flowDAO.findById(defBean, flowid);
        flowDAO.delete(flwDef);
        return "成功删除流程！";
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#DEL_INS(java.lang.String)
	 */
    public String DEL_INS(String insid)
    {
        List insList = flowDAO.findByWhere2(insBean, (new StringBuilder("insid='")).append(insid).append("'").toString());
        if(insList.isEmpty())
            return (new StringBuilder("没有实例ID：【")).append(insid).append("】的流程实例！").toString();
        else
            return deleteFlowIns(insid,true) ? "实例删除成功！" : "实例删除失败！";
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#resetFlwLog(java.lang.String[][])
	 */
    public boolean resetFlwLog(String arrEdit[][])
    {
        try
        {
            for(int i = 0; i < arrEdit.length; i++)
            {
                String logid = arrEdit[i][0];
                String tonode = arrEdit[i][1];
                FlwLog flwLog = (FlwLog)flowDAO.findById(logBean, logid);
                flwLog.setTonode(tonode);
                flowDAO.saveOrUpdate(flwLog);
                if("P".equals(flwLog.getFtype()) && !"".equals(flwLog.getNodeid()))
                {
//                    String _insid = flwLog.getFlwInstance().getInsid();
//                    String _cnodeid = flwLog.getNodeid();
                }
            }

        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#saveFlwTitle(java.lang.String, java.lang.String)
	 */
    public void saveFlwTitle(String insid, String title)
    {
        FlwInstance flwIns = (FlwInstance)flowDAO.findById(insBean, insid);
        flwIns.setTitle(title);
        flowDAO.saveOrUpdate(flwIns);
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#saveFlwNo(java.lang.String, java.lang.String)
	 */
    public void saveFlwNo(String insid, String flwno)
    {
        FlwInstance flwIns = (FlwInstance)flowDAO.findById(insBean, insid);
        flwIns.setFlowno(flwno);
        flowDAO.saveOrUpdate(flwIns);
    }

    /* (non-Javadoc)
	 * @see com.sgepit.frame.flow.service.x#isFlwData(java.lang.String, java.lang.String)
	 */
    public boolean isFlwData(String data_no, String data)
    {
        String str = (new StringBuilder(String.valueOf(data_no))).append(":").append(data).append(":string").toString();
        List list = flowDAO.findByWhere2(faceParamsInsBean, (new StringBuilder("paramvalues like '%")).append(str).append("%'").toString());
        return list.size() > 0;
    }
    /**
     * 删除流程附件
     */
    public boolean delInsAdjunct(String fileids) {
    	try{
    		JdbcTemplate jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
    		jdbcTemplate.execute("delete from app_blob where fileid in ("+fileids+")");
    		jdbcTemplate.execute("delete from flw_adjunct_ins where fileid in ("+fileids+")");
    		return true;
    	}catch(Exception ex){
    		ex.printStackTrace();
    		return false;
    	}
    }
    /**
     * sgdw:施工单位
     * zydm:专业代码
     * dwgc:单位工程
     * clmc:材料名称
     */
	@SuppressWarnings("unchecked")
	public String getSelectData() {
		StringBuilder sb = new StringBuilder();
		String jsonString = "";
		String sgdw = "[]",zydm = "[]",dwgc = "[]",clmc = "[]";
		List lt1 = flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.PropertyType", "module_name = '流程编号'");
		for(Iterator it1=lt1.iterator();it1.hasNext();){
			com.sgepit.frame.sysman.hbm.PropertyType pthbm = (com.sgepit.frame.sysman.hbm.PropertyType)it1.next();
			String typeName = pthbm.getTypeName()==null?"":pthbm.getTypeName();
			String ptid = pthbm.getUids();
			String tmpStr="";
			
			List lt2=flowDAO.findByWhere("com.sgepit.frame.sysman.hbm.PropertyCode", 
					"type_name='"+ptid+"' and property_name is not null and property_code is not null");
			for(Iterator it2=lt2.iterator();it2.hasNext();){
				com.sgepit.frame.sysman.hbm.PropertyCode pchbm = (com.sgepit.frame.sysman.hbm.PropertyCode)it2.next();
				if(tmpStr.length()>0)
					tmpStr+=",['"+pchbm.getPropertyCode()+"','"+pchbm.getPropertyName()+"']";
				else
					tmpStr+="['"+pchbm.getPropertyCode()+"','"+pchbm.getPropertyName()+"']";
			};
			if(typeName.equals("施工单位")){
				if(tmpStr.length()>0) sgdw = "["+tmpStr+"]";
			}else if(typeName.equals("材料名称")){
				if(tmpStr.length()>0) clmc = "["+tmpStr+"]";
			}else if(typeName.equals("专业代码")){
				if(tmpStr.length()>0) zydm = "["+tmpStr+"]";
			}else if(typeName.equals("单位工程")){
				if(tmpStr.length()>0) dwgc = "["+tmpStr+"]";
			}
		}
		
		jsonString=sb.append("[{sgdw:").append(sgdw).append(",").
					  append("zydm:").append(zydm).append(",").
					  append("dwgc:").append(dwgc).append(",").
					  append("clmc:").append(clmc).append("}]").toString();
		return jsonString;
	}
}
