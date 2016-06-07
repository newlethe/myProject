package com.sgepit.pcmis.approvl.service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import net.sf.json.JSONObject;

import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockRole2user;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.pcmis.approvl.dao.PCApprovlDAO;
import com.sgepit.pcmis.approvl.hbm.PCApprovlInfoStatistics;
import com.sgepit.pcmis.approvl.hbm.PcPwApprovalAdvise;
import com.sgepit.pcmis.approvl.hbm.PcPwApprovalMgm;
import com.sgepit.pcmis.approvl.hbm.PcPwSortTree;
import com.sgepit.pcmis.approvl.hbm.PcPwSortTreeSub;
import com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo;
import com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo;

public class PCApprovlServiceImpl extends BaseMgmImpl implements PCApprovlService {
	//项目批文分类维护	
	private PCApprovlDAO pcApprovlDAO;
	
	
	public PCApprovlDAO getPcApprovlDAO() {
		return pcApprovlDAO;
	}

	public void setPcApprovlDAO(PCApprovlDAO pcApprovlDAO) {
		this.pcApprovlDAO = pcApprovlDAO;
	}

	/**
	 * 批文分类树，不带checked模式, 只显示批文分类, 不显示分类下具体的可办理批文
	 * @param : String parentId 
	 */
	public List<ColumnTreeNode> pwSortTree(String parentId, String unitType2Id) throws BusinessException {
		
		//根据集团二级公司的项目单位编号获得该二级公司下所属的所有项目单位
		SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
		
		List<SgccIniUnit> units= sys.getPidsByUnitid(unitType2Id);
		
		String _pids = "`";
		for(SgccIniUnit unit:units)
		{
			_pids += unit.getUnitid() + "`";
		}
		
		Map<String, String>  map = new HashMap<String, String>();
		
		//找到二级公司所管辖所有项目单位的批文
		List lt0 = pcApprovlDAO.findByWhere(PcPwApprovalMgm.class.getName(), 
		"deal_status <> '"+0+"' and instr('"+ _pids +"','`'||pid||'`')>0 and nodepath is not null");
		
		//lt0是所有处于"办理"或"办理中"状态批文的集合
		for(Iterator itor = lt0.iterator(); itor.hasNext();)
		{
			PcPwApprovalMgm  pcPwMgm =(PcPwApprovalMgm)itor.next();
			String classfiyNo = pcPwMgm.getPwNo();
			
			//只取得节点自己的批文编号放入map中
			map.put(classfiyNo, null);
		}
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId: new String("0");
		String str = null;
		if(null==unitType2Id || ""==unitType2Id)
		{	
			//如果传递过来的unitType2Id是项目单位的编号
			 str = "parentId='"+parentId+"' order by CLASSFIY_NO_PRETEND asc";
		}
		else
		{    
			//如果传递过来的unitType2Id是二级企业的编号, 限定在该二级企业下寻找项目单位
			 str = "parentId='"+parentId+"'"+"and UNITID='" + unitType2Id+"'order by CLASSFIY_NO_PRETEND asc";
		}
		
		//objects代表所有的批文标准
		List<PcPwSortTree> objects = this.pcApprovlDAO.findByWhere(PcPwSortTree.class.getName(), str);
		Iterator<PcPwSortTree> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			PcPwSortTree temp = (PcPwSortTree) itr.next();
			long leaf = temp.getLeaf();			
			n.setId(temp.getUids());			// treenode.id
			n.setText(temp.getClassifyName());		// treenode.text
			n.setLeaf(false);				// treenode.leaf
			n.setCls("master-task");		// treenode.cls
			n.setIconCls("task-folder");	// treenode.iconCls
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(temp);
			jo.put("disabled", map.containsKey(temp.getClassfiyNo()));
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}
	
	/**
	 * 带check模式的批文分类树的生成
	 * 
	 */
	public List<ColumnTreeNode> pwSortTreeSub(String parentId, String unitType2Id, String pid) throws BusinessException {
		List lt0 = pcApprovlDAO.findByWhere(PcPwApprovalMgm.class.getName(), 
				"deal_status <> '0' and pid = '"+ pid + "' and nodepath is not null");
		Map<String,String> nmap = new HashMap<String,String>(); 
		for(Iterator it=lt0.iterator();it.hasNext();){
			PcPwApprovalMgm hbm = (PcPwApprovalMgm) it.next();
			String nodepath = hbm.getNodepath();
			String[] nodeArr = nodepath.split("/");
			for(int i=0;i<nodeArr.length;i++){
				String node = nodeArr[i];
				if(node!=null&&!node.equals("")){
					nmap.put(node, null);
				}
			}
		}
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		parentId = parentId != null && !parentId.equals("") ? parentId: new String("0");
		
		String str = "parentId='"+parentId+"' and unitid='"+unitType2Id+"' order by CLASSFIY_NO_PRETEND asc";
		
		List<PcPwSortTree> objects = pcApprovlDAO.findByWhere(PcPwSortTree.class.getName(), str);
		Iterator<PcPwSortTree> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			PcPwSortTree temp = (PcPwSortTree) itr.next();

			TreeNode n = new TreeNode();
			n.setId(temp.getUids());			// treenode.id
			n.setText(temp.getClassifyName());		// treenode.text
			n.setIfcheck("true");

			JSONObject jo = JSONObject.fromObject(temp);
			if(unitType2Id.equals("")||pid.equals("")){
				jo.put("checked", false);
			}else{
				List lt = pcApprovlDAO.findByWhere(PcPwSortTreeSub.class.getName(), "classfiy_no='"+temp.getClassfiyNo()+
						"' and unitid='"+unitType2Id+"' and pid='"+pid+"'");
				if(lt.size()>0){
					jo.put("checked", true);
				}else{
					jo.put("checked", false);
				}
			}
			jo.put("uiProvider", "col");
			jo.put("disabled", nmap.containsKey(temp.getClassfiyNo()));
			cn.setColumns(jo);					// columns
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			list.add(cn);
		}
		return list;
	}
	
	public List<ColumnTreeNode> inputTreeSub(String parentId, String unitType2Id, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		parentId = parentId != null && !parentId.equals("") ? parentId: new String("0");
		
		String str = "parentId='"+parentId+"' and pid='"+pid+"' order by CLASSFIY_NO_PRETEND asc";
		
		List<PcPwSortTreeSub> objects = pcApprovlDAO.findByWhere(PcPwSortTreeSub.class.getName(), str);
		Iterator<PcPwSortTreeSub> itr = objects.iterator();
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			PcPwSortTreeSub temp = (PcPwSortTreeSub) itr.next();

			TreeNode n = new TreeNode();
			n.setId(temp.getUids());			// treenode.id
			n.setText(temp.getClassifyName());		// treenode.text
			n.setIfcheck("none");

			if(pid.equals("")){
				n.setLeaf(true);				
				n.setIconCls("task");	
			}else{
//				List lt = pcApprovlDAO.findByWhere(PcPwSortTreeSub.class.getName(), 
//						"parentid='"+temp.getClassfiyNo()+
//					"' and  pid='"+pid+"'");
//				if(lt.size()==0){
//					n.setLeaf(true);				
//					n.setIconCls("task");	
//				}else{
//					n.setLeaf(false);				// treenode.leaf
//					n.setCls("master-task");		// treenode.cls
//					n.setIconCls("task-folder");	// treenode.iconCls
//				}
			}
			n.setLeaf(false);				// treenode.leaf
			n.setCls("master-task");		// treenode.cls
			n.setIconCls("task-folder");	// treenode.iconCls
			JSONObject jo = JSONObject.fromObject(temp);
			jo.remove("leaf");
			jo.put("uiProvider", "col");
			cn.setColumns(jo);					// columns
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			list.add(cn);
		}
		return list;
	}
	
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws SQLException, BusinessException
	{
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		if (treeName.equalsIgnoreCase("pwsortTree")) {	
			
			String unitType2Id = null;
			//从map中取得industryType的值
			Set set = params.entrySet();
			
			for(Iterator iter = set.iterator(); iter.hasNext();)
			{
				Map.Entry entry = (Map.Entry)iter.next();
				
				String key = entry.getKey().toString();
				if(key.equals("unitid"))
				{
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) unitType2Id=vals[0];
					break;
				}
			}
			
			list = this.pwSortTree(parentId, unitType2Id);
			return list;
		} 
		
		if (treeName.equalsIgnoreCase("pwsortTreeSub")) {	
			
			String unitType2Id = "";
			String pid = "";
			//从map中取得industryType的值
			Set set = params.entrySet();
			
			for(Iterator iter = set.iterator(); iter.hasNext();)
			{
				Map.Entry entry = (Map.Entry)iter.next();
				
				String key = entry.getKey().toString();
				if(key.equals("unitid"))
				{
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) unitType2Id=vals[0];
				}else if(key.equals("pid")){
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) pid=vals[0];
				}
			}
			
			list = this.pwSortTreeSub(parentId, unitType2Id, pid);
			return list;
		} 
		
		if (treeName.equalsIgnoreCase("inputTreeSub")) {	
			
			String unitType2Id = "";
			String pid = "";
			//从map中取得industryType的值
			Set set = params.entrySet();
			
			for(Iterator iter = set.iterator(); iter.hasNext();)
			{
				Map.Entry entry = (Map.Entry)iter.next();
				
				String key = entry.getKey().toString();
				
				if(key.equals("unitid"))
				{
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) unitType2Id=vals[0];
				}else if(key.equals("pid")){
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) pid=vals[0];
				}
			}
			
			list = this.inputTreeSub(parentId, unitType2Id, pid);
			return list;
		} 
		
		return null;
	}
	
    /**
     * @param treeName 树名称
     * @param parentId 父节点编号
     * @param params 该参数为备用, 用来实现功能扩展
     * @return 返回以为parentId为父节点的所有子节点的集合(包含组织机构和前期项目)
     */
	@SuppressWarnings("unchecked")
	public List<TreeNode> buildTree(String treeName, String parentId, Map params) throws BusinessException
	{
		//批文管理首页下拉框单位树            
		List<TreeNode> list = new ArrayList<TreeNode>();
		if(treeName.equals("pwUnitTree"))
		{
			String unitType2Id = "";
			String pid = "";
			//从map中取得industryType的值
			Set set = params.entrySet();
			
			for(Iterator iter = set.iterator(); iter.hasNext();)
			{
				Map.Entry entry = (Map.Entry)iter.next();
				
				String key = entry.getKey().toString();
				
				if(key.equals("unitid"))
				{
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) unitType2Id=vals[0];
				}else if(key.equals("pid")){
					String[] vals = (String[]) entry.getValue();
					if(vals.length>0) pid=vals[0];
				}
			}
			
			list = this.pwUnitTree(parentId, unitType2Id, pid);
			return list;
		}
		
		//创建批文初始化页面的二级公司, 三级公司, 项目单位树
		if(treeName.equals("pwInitUnitTree"))
		{
			//测试用例 集团二级公司---山西新兴能源产业集团有限公司---编号103
//			parentId = "103";
			list = this.pwUnitTree(parentId, null, null);
			return list;
		}
		return null;
	}
	
	public List<TreeNode> pwUnitTree(String parentId, String unitType2Id, String pid)
	{
		List<TreeNode> nodeList = new ArrayList<TreeNode>();
		String upunitId = parentId;
		parentId = parentId != null && !parentId.equals("") ? parentId: new String("0");
		if(parentId==null || parentId.equals(""))
		{
			upunitId = new String("0");
		}
		
		//str可以满足三级公司下建立多层三级公司的情况
		String str = "upunit='" + upunitId + "' and unit_type_id in('0','1','2','3','4','5','A')";
		
		List<SgccIniUnit> sgccBeanList = pcApprovlDAO.findByWhere(SgccIniUnit.class.getName(), str);
		Iterator<SgccIniUnit> itr = sgccBeanList.iterator();
		while (itr.hasNext()) {
			SgccIniUnit temp = (SgccIniUnit)itr.next();
			TreeNode n = new TreeNode();
			
			//正式的项目单位将节点的nodeType设置为"A", 否则设置为"~A"表示非项目单位
			n.setId(temp.getUnitid());			// treenode.id
			n.setText(temp.getUnitname());		// treenode.text
			if(temp.getUnitTypeId().equals("A"))  
			{
				n.setNodeType("A");
				n.setLeaf(true);
				n.setIconCls("form");
			}
			else  //如果不是项目单位, 判断该公司是否有其负责的前期项目和正式项目, 如果有就设置为父节点, 没有设置为子节点
			{
				n.setNodeType("~A");
				n.setIconCls("master-task");
				//是否有正式项目
				List lt = pcApprovlDAO.findByWhere(SgccIniUnit.class.getName(), 
								"upunit='"+temp.getUnitid()+"' and unit_type_id in('0','1','2','3','4','5','A')");
				//是否有前期项目
				List lt2 = pcApprovlDAO.findByWhere(PcZhxxQianqPrjInfo.class.getName(), 
								"memo_c1='"+temp.getUnitid()+"'");
				if(lt.size()==0&&lt2.size()==0)
				{
					n.setLeaf(true);
				}
				else 
				{	
					n.setLeaf(false);
				}	
			}
			nodeList.add(n);
		}
		
		//前期项目维护中项目
		List<PcZhxxQianqPrjInfo> prePrjList = 
						pcApprovlDAO.findByWhere(PcZhxxQianqPrjInfo.class.getName(),"memo_c1='" + upunitId + "'");
		if(prePrjList.size()>0)
		{
			for(Iterator it= prePrjList.iterator(); it.hasNext();)
			{
				PcZhxxQianqPrjInfo prePrj = (PcZhxxQianqPrjInfo)it.next();
				TreeNode node = new TreeNode();
				//pc_zhxx_qianq_prj_info表中维护的是前期项目的信息, 所有nodeType都设置为"A"
				node.setNodeType("A");
				node.setId(prePrj.getPid());
				node.setText(prePrj.getPrjName());
				//前期项目维护中项目都是子节点
				node.setLeaf(true);
//				node.setCls("cls");
				nodeList.add(node);
			}
		}
		return nodeList;
	}
	
	public boolean deleteApprovlClassfiyByNO(String appClassfiyNO) throws SQLException, BusinessException
	{   
		//使用findByPropert方法来获得对象的实例然后删除
		String beanName = "com.sgepit.pcmis.approvl.hbm.PcPwSortTree";
		String delClassfiyNO = appClassfiyNO;
		try 
		{
			PcPwSortTree del = (PcPwSortTree)pcApprovlDAO.findBeanByProperty(beanName,"classfiyNo",delClassfiyNO);
			List list = pcApprovlDAO.findByProperty(beanName,"parentid",del.getParentid());
			if(list.size()==0||list.size()==1){
				PcPwSortTree pHbm = (PcPwSortTree)pcApprovlDAO.findBeanByProperty(beanName,"classfiyNo",del.getParentid());
				if(pHbm!=null){
					pHbm.setLeaf(new Long(1));
					pcApprovlDAO.saveOrUpdate(pHbm);
				}
			}
			pcApprovlDAO.delete(del);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
			// TODO: handle exception
		}
	}

	public boolean deleteApporvlFileById(String id) throws SQLException, BusinessException
	{
		return true;  //需要修改
	}

	public boolean deleteApprovlInsById(String id) throws SQLException, BusinessException
	{
		return true;   //需要修改
	}
	
	public String getApprolsByWhere(String orderby, Integer start, Integer limit,Map params) throws SQLException, BusinessException
	{
		return "";  //需要修改
	}
	/**
	 * 新增或修改批文分类，在新增的时候需要同步更新父节点的leaf值
	 * @return
	 * @author liangwj
	 * @since 2011.5.25
	 */
	public boolean addOrUpdateApprovlPWSort(PcPwSortTree pcPwSortTree) {
		try{
			PcPwSortTree pPwSort = (PcPwSortTree) pcApprovlDAO.findBeanByProperty(PcPwSortTree.class.getName(), "classfiyNo", pcPwSortTree.getParentid());
			if(pPwSort!=null){
				pPwSort.setLeaf(new Long(0));
				pcApprovlDAO.saveOrUpdate(pPwSort);
			}
			
			if(pcPwSortTree.getUids()!=null&&pcPwSortTree.getUids().equals("")){
				pcPwSortTree.setUids(null);
			}
			
			pcApprovlDAO.saveOrUpdate(pcPwSortTree);
			return true;
		}catch(BusinessException ex){
			ex.printStackTrace();
			return false;
		}
	}

	
	@SuppressWarnings("unchecked")
	public List getProjectsApprolInfoByUnitid(String orderby, Integer start, Integer limit, HashMap params)  throws SQLException, BusinessException
	{
//		JdbcTemplate jt= new JdbcTemplate(HibernateSessionFactory.getConnectionFactory());
		List list = new ArrayList();
//		SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
//		
//		String unitid = params.get("unitid")==null?"":params.get("unitid").toString();
//		String projName = params.get("projName")==null?"%":params.get("projName").toString();
//		
//		//的到综合信息管理中所有项目编号
//		
//		List ltOfPid = new ArrayList<String>();
//		
//		//将所有前期项目的pid加入到ltOfPid中
//		List preProjList = pcApprovlDAO.findByWhere2(com.sgepit.pcmis.zhxx.hbm.PcZhxxQianqPrjInfo.class.getName(),
//							"pid like '%'");
//		for(Iterator itor = preProjList.iterator(); itor.hasNext();)
//		{
//			PcZhxxQianqPrjInfo prePrjInfo = (PcZhxxQianqPrjInfo)itor.next();
//			ltOfPid.add(prePrjInfo.getPid());
//		}
//		
//		//将综合信息表中所有pid加入到ltOfPid中
//		List sgccList = sys.getPidsByUnitid(unitid);
//		for(Iterator itor = sgccList.iterator();itor.hasNext();)
//		{
//			SgccIniUnit unit = (SgccIniUnit) itor.next();
//			ltOfPid.add(unit.getUnitid());
//		}
//		
//		//得到前期项目维护表中的所有的项目编号
//		
//		for (Iterator it = ltOfPid.iterator(); it.hasNext();) {
//			PCApprovlInfoStatistics hbm = new PCApprovlInfoStatistics();
//			String pid = (String)it.next();
//			List lt0 = pcApprovlDAO.findByWhere(com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo.class.getName(), 
//					"pid='"+pid+"' and prj_Name like '%"+projName+"%'");
//			if(lt0.size()==0) continue;
//			
//			String appDone = "select count(*) from pc_pw_approval_mgm where "
//					+ "PID ='" + pid + "' and DEAL_STATUS = '2'";
//			int approvalProcessed = jt.queryForInt(appDone);
//			hbm.setApprovalProcessed(approvalProcessed);
//
//			String appDoing = "select count(*) from pc_pw_approval_mgm where "
//				+ "PID ='" + pid + "' and DEAL_STATUS = '1'";
//			int approvalProcessing = jt.queryForInt(appDoing);
//			hbm.setApprovalProcessing(approvalProcessing);
//
//			String appWait = "select count(*) from pc_pw_approval_mgm where "
//				+ "PID ='" + pid + "' and DEAL_STATUS = '0'";
//			int approvalWaitProcess = jt.queryForInt(appWait);
//			hbm.setApprovalWaitProcess(approvalWaitProcess);
//
//			int approvalTotal = approvalWaitProcess + approvalProcessing
//					+ approvalProcessed;
//			hbm.setApprovalTotal(approvalTotal);
//
//			hbm.setPid(pid);
//			list.add(hbm);
//		}
		return list;
	}
	
	/**
	 * 功能: 查找二级公司或者三级公司下所有的项目单位(包含前期项目维护中的项目)
	 * @param unitid String 二级公司或者三级公司编号单位编号
	 * @param unitType  公司类型(1级公司, 2级公司, 三级公司还是项目单位)
	 */
	@SuppressWarnings("unchecked")
	public List getAllPrjByUnit2(String unitid) throws SQLException, BusinessException 
	{
		if(unitid==null||unitid.equals(""))
			return null;
		
		List prjInfo = new ArrayList();
		List<VPcPwPrjInfo> vPrjInfo = pcApprovlDAO.findByWhere2(com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo.class.getName(),
																								"memo_c1 like'"+unitid+"%'");
		for(Iterator itor = vPrjInfo.iterator(); itor.hasNext();)
		{
			VPcPwPrjInfo hbm = (VPcPwPrjInfo)itor.next();
			List tempList = new ArrayList();
			tempList.add(hbm.getPid());
			tempList.add(hbm.getPrjName());
			prjInfo.add(tempList);
		}
		return prjInfo;	
	}	
	
	@SuppressWarnings("unchecked")
	public List getAllPrjPwInfoByUnitid(String orederby, Integer start, Integer limit, HashMap params) throws SQLException, BusinessException
	{
		String unitid = params.get("unitid")==null?"" : params.get("unitid").toString();
		String projName = params.get("projName")==null?"%" : params.get("projName").toString(); 
		String type = params.get("type")==null?"" : params.get("type").toString();
		String level = params.get("level")==null?"" : params.get("level").toString();
		
		StringBuffer whereSql = new StringBuffer("");  //过滤条件
		List list = new ArrayList();
		
		if(!unitid.startsWith("Q"))  //判断是否选择了
		{	
			SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
			SgccIniUnit unitHbm = sys.getUnitById(unitid);
			if(unitHbm.getUnitTypeId().equals("0"))    //集团公司
			{
				whereSql.append("prj_Name like '%"+projName+"%'");
			}
			else if(unitHbm.getUnitTypeId().equals("2"))//二级公司
			{
				whereSql.append("unit2id='" + unitHbm.getUnitid()+"' and prj_Name like '%" + projName+"%'");
			}
			else if(unitHbm.getUnitTypeId().equals("3"))//三级公司
			{
				String unit3Ids = getAllUnit3(unitid);
				whereSql.append("unit3id in("+ unit3Ids +") and prj_Name like '%"+projName+"%'");
			}             
			else        //正式项目(pc_zhxx_prj_info和sgcc_ini_unit表中都有此项目数据)
			{   
				whereSql.append("pid='"+unitid+"' and prj_Name like '%" + projName+"%'");
			}	
		}
		else //    前期项目(该项目信息只存在pc_zhxx_qianq_prj_info表中, Sgcc_ini_unit没有该项目信息, )                    
		{
			whereSql.append("pid='"+unitid+"' and prj_Name like '%" + projName+"%'");
		}	
		
		//项目级别的过滤参数
		whereSql.append(level.equals("")?"" : " and backup_c1 in ('"+level.replace(",", "','")+"')");
		
		//项目类型过滤参数
		whereSql.append(type.equals("")?"" : " and PRJ_TYPE in('"+type.replace(",", "','")+"')");
		
		List allPrjList = 
				this.pcApprovlDAO.findByWhere2(com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo.class.getName(), whereSql.toString());
		
		if(allPrjList.isEmpty())
		{
			return list;
		}
		for (Iterator it = allPrjList.iterator(); it.hasNext();) {
			VPcPwPrjInfo prjHbm = (VPcPwPrjInfo)it.next();
			PCApprovlInfoStatistics hbm = new PCApprovlInfoStatistics();
			hbm.setPid(prjHbm.getPid());
			hbm.setPrjName(prjHbm.getPrjName());
			hbm.setUids(prjHbm.getUids());
			hbm.setIndustryType(prjHbm.getIndustryType());
			hbm.setBuildNature(prjHbm.getBuildNature());
			hbm.setMemoC1(prjHbm.getMemoC1());
			hbm.setMemoC2(prjHbm.getMemoC2());
			hbm.setMemoC3(prjHbm.getMemoC3());
			hbm.setMemoC4(prjHbm.getMemoC4());
			hbm.setGuiMoDw(prjHbm.getGuiMoDw());
			hbm.setInvestScale(prjHbm.getInvestScale());
			hbm.setPrjType(prjHbm.getPrjType());
			hbm.setPrjRespond(prjHbm.getPrjRespond());
			hbm.setBackupC1(prjHbm.getBackupC1());
			hbm.setApprovalProcessed(prjHbm.getApprovalProcessed());
			hbm.setApprovalProcessing(prjHbm.getApprovalProcessing());
			hbm.setApprovalWaitProcess(prjHbm.getApprovalWaitProcess());
			hbm.setApprovalTotal(prjHbm.getApprovalTotal());
			hbm.setProvincelApprovalNum(prjHbm.getProvincelApprovalNum());
			list.add(hbm);
		}
		return list;
	}
	/**
	 * 根据批文分类实例化批文
	 */
	@SuppressWarnings("unchecked")
	public boolean initApprolInfoBySortId(String sortPk,String nodePath,String pid) {
		try {
			String beanName = PcPwApprovalMgm.class.getName();
			//项目单位初始化批文中的具体批文（节点为叶子节点）
			String sql = "select tab.pwno,tab.pwname,tab.sort_uids from (select (select count(t1.pid) n from pc_pw_sort_tree_sub t1 connect by " +
						 "prior t1.classfiy_no=t1.parentid start with t1.parentid=t.classfiy_no) as n,t.classfiy_no as pwno," +
						 "t.uids as sort_uids,t.classify_name as pwname " +
						 "from pc_pw_sort_tree_sub t where t.pid='"+pid+"') tab where tab.n=0"; 
			List lt0 = pcApprovlDAO.getDataAutoCloseSes(sql);
			
			if(lt0==null||lt0.size()==0) 
				return true;
			
			//查询项目单位下所有批文
			Map<String,PcPwApprovalMgm> undealsMap = new HashMap<String,PcPwApprovalMgm>();
			List lt1 = pcApprovlDAO.findByWhere(beanName, "pid='"+pid+"'");
			for(Iterator it1=lt1.iterator();it1.hasNext();){
				PcPwApprovalMgm hbm = (PcPwApprovalMgm)it1.next();
				undealsMap.put(hbm.getPwNo(), hbm);
			}
			
			for(Iterator it0=lt0.iterator();it0.hasNext();){
				Object[] o = (Object[]) it0.next();
				String pwno = o[0].toString();//批文编号
				String pwname = o[1].toString();//批文名称
				String uids = o[2].toString();
				
				if(!(undealsMap.containsKey(pwno))){//具体批文未被实例化
					//批文路径(自下至上)
					String sql1 = "select t1.classfiy_no pwpath from (select t.* from pc_pw_sort_tree_sub t where t.pid='"+pid+"') t1 connect by " +
							 	  "prior t1.parentid=t1.classfiy_no start with t1.classfiy_no='"+pwno+"'";
					List lt2 = pcApprovlDAO.getDataAutoCloseSes(sql1);
					if(lt2!=null&&lt2.size()>0){
						StringBuilder path = new StringBuilder("/0");
						for(int i=lt2.size()-1;i>=0;i--){
							String n = lt2.get(i).toString();
							path.append("/").append(n);
						}
						//具体批文办理不存在，则实例化
						PcPwApprovalMgm pwMgm = new PcPwApprovalMgm();
						pwMgm.setPid(pid);
						pwMgm.setSortUids(uids);
						pwMgm.setPwNo(pwno);
						pwMgm.setPwName(pwname);
						pwMgm.setNodepath(path.toString());
						pwMgm.setRateStatus(0.0);
						pwMgm.setDealStatus("0");
						pcApprovlDAO.insert(pwMgm);
					}
				}else{//具体批文已经被实例化
					undealsMap.remove(pwno);
				}
			}
			
			//删除不在初始化范围并处于未办理的批文
			for(Iterator<String> it3=undealsMap.keySet().iterator();it3.hasNext();){
				PcPwApprovalMgm mgm = undealsMap.get(it3.next());
				String dealStatus = mgm.getDealStatus();
				//未办理，需要删除
				if(dealStatus.equals("0")){
					//删除大对象
					//pcApprovlDAO.deleteFileInBlob(fileid)
					SgccAttachListDAO sgccAttachListDAO = (SgccAttachListDAO) Constant.wact.getBean("sgccAttachListDAO");
					sgccAttachListDAO.deleteAttachList(mgm.getUids(), "PWFILES", null);
					//PWFILES
					//删除附件信息
					//删除建议
					List lt4 = pcApprovlDAO.findByProperty(PcPwApprovalAdvise.class.getName(), "mgmUids", mgm.getUids());
					if(lt4.size()>0)	pcApprovlDAO.delete(lt4);
					//删除批文办理
					pcApprovlDAO.delete(mgm);
				}
			}
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * 根据二级企业、项目单位、批文编号串初始化项目单位的批文分类
	 * @param unitId 二级企业
	 * @param pid  项目单位
	 * @param sortIds 批文分类编号，使用","隔开
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public boolean initProjPwSortBySortIds(String unitId, String pid,String sortIds) {
		String[] sortIdArr = sortIds.split(",");
		
		try {
			JdbcTemplate jt= new JdbcTemplate(HibernateSessionFactory.getConnectionFactory());
			String delSubAll = "delete from pc_pw_sort_tree_sub where pid='" + pid +"'";
			String delMgmAll = "delete from pc_pw_approval_mgm where pid ='" + pid +"'and deal_status='0'";
			jt.execute(delSubAll);
			jt.execute(delMgmAll);
			for(int i=0,j=sortIdArr.length;i<j;i++){
				PcPwSortTree sort = (PcPwSortTree) pcApprovlDAO.findBeanByProperty(PcPwSortTree.class.getName(), "classfiyNo", sortIdArr[i]);
				if(sort!=null){
					PcPwSortTreeSub sortSub = new PcPwSortTreeSub();
					sortSub.setClassfiyNo(sort.getClassfiyNo());
					sortSub.setClassfiyNoPre(sort.getClassfiyNoPre());
					sortSub.setClassifyName(sort.getClassifyName());
					sortSub.setIndustryType(sort.getIndustryType());
					sortSub.setLastOperator(sort.getLastOperator());
					sortSub.setMemo(sort.getMemo());
					sortSub.setParentid(sort.getParentid());
					sortSub.setPid(pid);
					sortSub.setLeaf(sort.getLeaf());
					sortSub.setPwLevel(sort.getPwLevel());
					sortSub.setUnitid(unitId);
					pcApprovlDAO.insert(sortSub);
				}
			}
			return true;
		} catch (BusinessException e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	 /**
	 * 集团二级公司将初始化批文下发给项目单位,实时交互方式
	 * @param pid String 
	 */
	@SuppressWarnings("unchecked")
	  public String distributePcPwTree(String pid)
	  {
		
		SgccIniUnit unitBean = (SgccIniUnit) this.pcApprovlDAO.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", pid);
		
		//如果项目编号为PID的项目单位在sgcc_ini_unit表中找不到，立即返回交互失败
		if(unitBean==null)
		{
			return "failer";
		}	
		
		//判断项目单位是否有数据交互的地址app_url，没有说明不需要进行数据交互，立即返回"unnecessary"
		String appUrl = unitBean.getAppUrl();
		if( appUrl == null || appUrl.equals("") )
		{
			return "unnecessary";
		} 
		
		
		
	    List beanList = new ArrayList();

	    String beanName = "com.sgepit.pcmis.approvl.hbm.PcPwSortTreeSub";

	    beanList = this.pcApprovlDAO.findByProperty(beanName, "pid", pid);
	    
	    //批文初始化的时候选中要初始化批文，如果未保存beanList.length=0
	    if(beanList.size()==0)
	    	return "failer";

	    List listInQueue = new ArrayList();

	    PCDataExchangeService exchangeServiceImp = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");

	    listInQueue = exchangeServiceImp.getExchangeDataList(beanList, pid,"下发批文分类树");
	    
		Map<String, String> retVal = exchangeServiceImp.sendExchangeData(listInQueue);

		String result = retVal.get("result");
		return result;
	    
	  }
	  
	  /**
	   * 项目单位向其集团二级公司上报批文办理情况,实时交互方式
	   * @param unitid
	   * @return
	   */
	@SuppressWarnings("unchecked")
	public String submitPcPwMgm(String unitid)
	  {
		
	    List<PcPwApprovalMgm> beanList = new ArrayList<PcPwApprovalMgm>();

		String beanName = "com.sgepit.pcmis.approvl.hbm.PcPwApprovalMgm";

		beanList = (List<PcPwApprovalMgm>) this.pcApprovlDAO.findByWhere(
				beanName, "1=1");
		
	    if(beanList.size()==0)
	    	return "failed";

		List<PcDataExchange> listInQueue = new ArrayList<PcDataExchange>();

		PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");

		listInQueue = exchangeServiceImp.getExchangeDataList(beanList, "103", "发送批文办理情况");

		Map<String, String> retVal = exchangeServiceImp.sendExchangeData(listInQueue);

		String result = retVal.get("result");
		
		return result;
	  }
	
	/**
	 * 项目单位向其集团二级公司上报相关批文建议内容，实时交互方式（新增，修改，删除的时候也要进行数据交互）
	 * 
	 * @param unitid String 集团二级公司编号
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String distributePcPwAdvise(String pid, String mgmUids)
	{
		List<PcPwApprovalAdvise> beanList = new ArrayList<PcPwApprovalAdvise>();

		beanList = (List<PcPwApprovalAdvise>) this.pcApprovlDAO.findByWhere(
				PcPwApprovalAdvise.class.getName(), "pid='"+pid+"'and mgm_uids='"+mgmUids+"'");
		
	    if(beanList.size()==0)
	    	return "failer";
	    
		List<PcDataExchange> listInQueue = new ArrayList<PcDataExchange>();

		PCDataExchangeService exchangeServiceImp = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");
		String beforeSql = "delete from pc_pw_approval_advise where pid='"+pid+"' and mgm_uids='"+mgmUids+"'";
		
		listInQueue = exchangeServiceImp.getExchangeDataList(beanList, pid,beforeSql,null,"发送批文建议");
		
		Map<String, String> retVal = exchangeServiceImp.sendExchangeData(listInQueue);
		
		String result = retVal.get("result");
		
		return result;
	}
	
	/**
	 * 获得选中的三级公司下所有的三级公司(仅限前期项目使用)
	 * @param unit3Id
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getAllUnit3(String unit3Id)
	{
		String sql = "select unitid from sgcc_ini_unit where unit_type_id='3' connect by prior unitid=upunit start with unitid='" + unit3Id + "'";
		StringBuffer buf = new StringBuffer();
		List<String> list = this.pcApprovlDAO.getDataAutoCloseSes(sql);
		if(list.isEmpty())
		{	
			return "'" + unit3Id + "'";
		}
		else
		{
			for(Iterator itor = list.iterator(); itor.hasNext();)
			{
				buf.append("'"+itor.next().toString()+"',");
			}
		}
		buf.deleteCharAt(buf.length()-1);
		return buf.toString();
	}
	
	/**
	 * 获得用户对URL页面的访问权限
	 * @param userid  用户编号
	 * @param URL  用户要访问的页面
	 * @return  返回权限(1完全控制 > 2写、运行 > 3读 > 4禁止访问)
	 */
	@SuppressWarnings("unchecked")
	public String getPageLvl(String userid, String URL) throws SQLException, BusinessException
	{
		if(userid==null||userid.equals("")||URL==null||URL.equals(""))
		{
			return  "6";
		}
		
		//获得userid所具有的所有角色
		List<RockRole2user> userRoleBeans = this.pcApprovlDAO.findByWhere2(RockRole2user.class.getName(),
																						"userid='"+userid+"'");
		RockPower rockPowerBean = (RockPower) this.pcApprovlDAO.findBeanByProperty(RockPower.class.getName(), 
																						"url", new String(URL));
		if(userRoleBeans.isEmpty()||rockPowerBean==null)
		{
			return "6";
		}
		StringBuffer buffer = new StringBuffer("(");
		for(Iterator itor = userRoleBeans.iterator();itor.hasNext();)
		{
			RockRole2user roleBean = (RockRole2user) itor.next();
			buffer.append("'"+roleBean.getRolepk()+"',");
		}
		
		String roles = buffer.deleteCharAt(buffer.length()-1).toString()+")";
		//获得页面的主键值
		String powerPk = rockPowerBean.getPowerpk();
		
		String whereSql = "select min(lvl) from rock_character2power where powerpk='"+powerPk+"' and rolepk in"+roles;
		List<BigDecimal> rtList = this.pcApprovlDAO.getDataAutoCloseSes(whereSql);
		if(rtList.isEmpty())
		{
			return "6";
		}
		String powerOfPage = rtList.get(0).toString();
		
		return powerOfPage;
	}
}
